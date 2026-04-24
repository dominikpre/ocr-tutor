import http from "node:http";

import { config } from "./config.js";
import { prisma } from "./prisma.js";
import {
  runWorker,
  triggerSubmissionOcr,
  waitForTriggeredOcr,
} from "./worker.js";

let stopRequested = false;
let shutdownSignal: NodeJS.Signals | null = null;

const shutdownHandler = (signal: NodeJS.Signals) => {
  if (stopRequested) {
    return;
  }

  stopRequested = true;
  shutdownSignal = signal;
  console.info(`[ocr-worker] Received ${signal}. Finishing in-flight work...`);
};

process.on("SIGINT", shutdownHandler);
process.on("SIGTERM", shutdownHandler);

function sendJson(
  response: http.ServerResponse,
  statusCode: number,
  body: unknown,
) {
  response.writeHead(statusCode, {
    "content-type": "application/json",
  });
  response.end(JSON.stringify(body));
}

function waitUntilStopped(shouldStop: () => boolean) {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (shouldStop()) {
        clearInterval(interval);
        resolve();
      }
    }, 250);
  });
}

async function startTriggerServer() {
  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://ocr-worker.local");
    const match = url.pathname.match(/^\/api\/submissions\/([^/]+)\/ocr$/);

    if (request.method !== "POST" || !match?.[1]) {
      sendJson(response, 404, { error: "Not found." });
      return;
    }

    try {
      const submissionId = decodeURIComponent(match[1]);
      const triggered = await triggerSubmissionOcr(submissionId);

      if (!triggered) {
        sendJson(response, 409, {
          error: `Submission "${submissionId}" is not ready for OCR.`,
        });
        return;
      }

      sendJson(response, 202, { status: "processing" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected OCR trigger error.";
      sendJson(response, 500, { error: message });
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(config.triggerPort, config.triggerHost, () => {
      server.off("error", reject);
      resolve();
    });
  });

  console.info(
    `[ocr-worker] Manual trigger endpoint listening on http://${config.triggerHost}:${config.triggerPort}.`,
  );

  return server;
}

async function closeServer(server: http.Server) {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

const triggerServer = await startTriggerServer();

try {
  if (config.workerMode === "manual") {
    console.info(
      "[ocr-worker] Manual mode enabled. Automatic polling is disabled.",
    );
    await waitUntilStopped(() => stopRequested);
  } else {
    await runWorker(() => stopRequested);
  }
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Unexpected worker crash.";
  console.error(`[ocr-worker] Fatal error: ${message}`);
  process.exitCode = 1;
} finally {
  await closeServer(triggerServer);
  await waitForTriggeredOcr();
  await prisma.$disconnect();

  if (shutdownSignal) {
    console.info(`[ocr-worker] Prisma disconnected after ${shutdownSignal}.`);
  }
}
