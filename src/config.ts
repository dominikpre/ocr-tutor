import "dotenv/config";

import path from "node:path";

// Parse numeric env vars once and fall back to a safe default when they are
// missing or malformed. This keeps the rest of the code free of repetitive
// Number(...) and NaN checks.
function getNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Keep base URLs normalized so later URL joins do not produce a double slash.
function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

const port = getNumber(process.env.PORT, 4000);
const databaseUrl = process.env.DATABASE_URL;

// The service cannot talk to Prisma without a database connection string, so we
// fail fast during startup instead of surfacing a less clear runtime error later.
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set.");
}

// Centralize all runtime configuration here so the rest of the app imports a
// single typed object instead of reading from process.env ad hoc.
export const config = {
  // Prisma still reads DATABASE_URL from the schema env binding, but keeping it
  // here makes the final resolved config visible in one place for reviewers.
  databaseUrl,
  // Allow only the demo frontend origin during local development.
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000",
  // Cap upload size early at the Fastify multipart layer.
  maxFileSizeBytes: getNumber(process.env.MAX_FILE_SIZE_BYTES, 10 * 1024 * 1024),
  port,
  // The public base URL is used when building absolute image URLs for the
  // frontend response payloads.
  publicBaseUrl: stripTrailingSlash(
    process.env.PUBLIC_BASE_URL ?? `http://localhost:${port}`,
  ),
  // Resolve the uploads directory against the repo root so relative paths are
  // stable regardless of how the process is started.
  uploadsDir: path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "uploads"),
};
