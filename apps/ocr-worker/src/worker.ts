import { config } from "./config.js";
import { OcrOutputParseError, extractOcrFromImage } from "./ollama.js";
import { prisma } from "./prisma.js";
import { createSubmissionImageStore } from "./storage.js";

type ClaimedSubmission = {
  id: string;
  imageHeight: number;
  imageWidth: number;
  mimeType: string;
  ocrAttempts: number;
  storagePath: string;
};

const imageStore = createSubmissionImageStore();

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function truncateErrorMessage(message: string) {
  const normalized = message.trim();
  return normalized.length > 2000
    ? `${normalized.slice(0, 1997)}...`
    : normalized;
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return truncateErrorMessage(error.message);
  }

  return "Unexpected OCR worker failure.";
}

async function claimSubmissions(limit: number): Promise<ClaimedSubmission[]> {
  return prisma.$queryRaw<ClaimedSubmission[]>`
    WITH candidates AS (
      SELECT "id"
      FROM "Submission"
      WHERE "status" = 'uploaded'::"SubmissionStatus"
        AND (
          "nextOcrAttemptAt" IS NULL
          OR "nextOcrAttemptAt" <= NOW()
        )
      ORDER BY
        COALESCE("nextOcrAttemptAt", "submittedAt") ASC,
        "submittedAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT ${limit}
    )
    UPDATE "Submission" AS submission
    SET
      "status" = 'processing'::"SubmissionStatus",
      "ocrAttempts" = submission."ocrAttempts" + 1,
      "ocrLastError" = NULL,
      "nextOcrAttemptAt" = NULL
    FROM candidates
    WHERE submission."id" = candidates."id"
    RETURNING
      submission."id",
      submission."imageHeight",
      submission."imageWidth",
      submission."mimeType",
      submission."ocrAttempts",
      submission."storagePath";
  `;
}

async function handleClaimedSubmission(submission: ClaimedSubmission) {
  try {
    const image = await imageStore.readSubmissionImage({
      mimeType: submission.mimeType,
      storageKey: submission.storagePath,
    });

    const ocrResult = await extractOcrFromImage(
      image.bytes,
      submission.imageWidth,
      submission.imageHeight,
    );

    await prisma.submission.update({
      data: {
        correctedText: ocrResult.correctedText,
        ocrLastError: null,
        ocrRawResponse: ocrResult.rawResponse,
        overlays: JSON.parse(JSON.stringify(ocrResult.overlays)),
        nextOcrAttemptAt: null,
        processedAt: new Date(),
        status: "completed",
      },
      where: {
        id: submission.id,
      },
    });

    console.info(
      `[ocr-worker] Completed ${submission.id} (attempt ${submission.ocrAttempts}).`,
    );
  } catch (error) {
    const errorMessage = toErrorMessage(error);
    const shouldMarkFailed = submission.ocrAttempts >= config.maxAttempts;
    const nextAttemptAt = shouldMarkFailed
      ? null
      : new Date(Date.now() + config.retryDelayMs);

    await prisma.submission.update({
      data: {
        ocrLastError: errorMessage,
        ...(error instanceof OcrOutputParseError
          ? { ocrRawResponse: error.rawResponse }
          : {}),
        nextOcrAttemptAt: nextAttemptAt,
        processedAt: shouldMarkFailed ? new Date() : null,
        status: shouldMarkFailed ? "failed" : "uploaded",
      },
      where: {
        id: submission.id,
      },
    });

    const nextState = shouldMarkFailed ? "failed" : "uploaded";
    const retryAt = nextAttemptAt ? nextAttemptAt.toISOString() : "n/a";

    console.error(
      [
        `[ocr-worker] ${submission.id} failed on attempt ${submission.ocrAttempts}.`,
        `Moved back to "${nextState}" with next retry at ${retryAt}.`,
        `Reason: ${errorMessage}`,
      ].join(" "),
    );
  }
}

export async function runWorker(shouldStop: () => boolean) {
  console.info(
    [
      `[ocr-worker] Starting with pollInterval=${config.pollIntervalMs}ms,`,
      `batchSize=${config.claimBatchSize}, maxAttempts=${config.maxAttempts},`,
      `retryDelay=${config.retryDelayMs}ms,`,
      `storageDriver=${config.storageDriver}, ollamaBaseUrl=${config.ollamaBaseUrl.toString()}.`,
    ].join(" "),
  );

  while (!shouldStop()) {
    try {
      const claimed = await claimSubmissions(config.claimBatchSize);

      if (claimed.length === 0) {
        await sleep(config.pollIntervalMs);
        continue;
      }

      for (const submission of claimed) {
        if (shouldStop()) {
          break;
        }

        await handleClaimedSubmission(submission);
      }
    } catch (error) {
      console.error(`[ocr-worker] Loop error: ${toErrorMessage(error)}`);
      await sleep(config.pollIntervalMs);
    }
  }

  console.info("[ocr-worker] Shutdown requested. Worker loop stopped.");
}
