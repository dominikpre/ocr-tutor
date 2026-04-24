import "dotenv/config";

import path from "node:path";

const defaultDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/ocr_tutor?schema=public";

type StorageDriver = "local" | "object";

function parseNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveOllamaBaseUrl(rawValue: string | undefined) {
  const fallback = "http://127.0.0.1:11434";
  const trimmed = rawValue?.trim() || fallback;
  const withProtocol =
    /^https?:\/\//i.test(trimmed) || /^http:\/\/\[/i.test(trimmed)
      ? trimmed
      : `http://${trimmed}`;

  try {
    return new URL(withProtocol);
  } catch {
    throw new Error(`Invalid OLLAMA_BASE_URL value "${trimmed}".`);
  }
}

function resolveStorageDriver(rawValue: string | undefined): StorageDriver {
  if (rawValue === "object") {
    return "object";
  }

  if (rawValue === "local" || rawValue === undefined) {
    return "local";
  }

  throw new Error(
    `Unsupported SUBMISSION_STORAGE_DRIVER "${rawValue}". Use "local" or "object".`,
  );
}

export const config = {
  claimBatchSize: parseNumber(process.env.OCR_CLAIM_BATCH_SIZE, 2),
  databaseUrl: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  maxAttempts: parseNumber(process.env.OCR_MAX_ATTEMPTS, 3),
  ollamaApiKey: process.env.OLLAMA_API_KEY?.trim() || "",
  ollamaBaseUrl: resolveOllamaBaseUrl(process.env.OLLAMA_BASE_URL),
  ollamaModel: process.env.OLLAMA_MODEL?.trim() || "llava:7b",
  ollamaRequestTimeoutMs: parseNumber(
    process.env.OLLAMA_REQUEST_TIMEOUT_MS,
    120_000,
  ),
  pollIntervalMs: parseNumber(process.env.OCR_POLL_INTERVAL_MS, 3_000),
  retryDelayMs: parseNumber(process.env.OCR_RETRY_DELAY_MS, 120_000),
  storageDriver: resolveStorageDriver(process.env.SUBMISSION_STORAGE_DRIVER),
  uploadsDir: path.resolve(
    process.cwd(),
    process.env.UPLOADS_DIR ?? "../api/uploads",
  ),
};
