import "dotenv/config";

import path from "node:path";

const defaultPort = 4000;
const port = process.env.PORT ? Number(process.env.PORT) : defaultPort;
// Match the committed Docker Compose defaults so the service can boot locally
// even before a .env file exists.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/ocr_tutor?schema=public";

// Centralize all runtime configuration here so the rest of the app imports a
// single typed object instead of reading from process.env ad hoc.
export const config = {
  // Keep the final resolved DB connection visible in one place for reviewers.
  databaseUrl,
  // Allow only the web app origin during local development.
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  // Cap upload size early at the Fastify multipart layer.
  maxFileSizeBytes: process.env.MAX_FILE_SIZE_BYTES
    ? Number(process.env.MAX_FILE_SIZE_BYTES)
    : 10 * 1024 * 1024,
  maxFileCount: process.env.MAX_FILE_COUNT
    ? Number(process.env.MAX_FILE_COUNT)
    : 50,
  ocrWorkerBaseUrl: (
    process.env.OCR_WORKER_BASE_URL ?? "http://127.0.0.1:4010"
  ).replace(/\/$/, ""),
  port,
  // The public base URL is used when building absolute image URLs for the
  // frontend response payloads.
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? `http://localhost:${port}`,
  // Resolve the uploads directory against the repo root so relative paths are
  // stable regardless of how the process is started.
  uploadsDir: path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "uploads"),
};
