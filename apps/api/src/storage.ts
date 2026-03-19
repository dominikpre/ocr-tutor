import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { imageSize } from "image-size";

import { config } from "./config.js";

// This is the in-memory representation of a validated upload after the file has
// been written to disk and enough metadata has been extracted to persist it.
export type PreparedUpload = {
  fileName: string;
  imageHeight: number;
  imageWidth: number;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  title: string;
};

// Make sure the upload root exists before the service begins accepting files.
export async function ensureUploadsDir() {
  await mkdir(config.uploadsDir, { recursive: true });
}

// The API returns absolute image URLs so the frontend can render them directly
// without having to guess which backend host served the metadata.
export function buildImageUrl(storagePath: string) {
  const encodedPath = storagePath
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return new URL(`/uploads/${encodedPath}`, `${config.publicBaseUrl}/`).toString();
}

// The MVP has no OCR-derived alt text, so provide a deterministic fallback.
export function buildImageAlt(title: string) {
  return `Uploaded submission image for ${title}`;
}

// Reuse the original file stem as a human-readable submission title.
export function deriveTitle(fileName: string) {
  const stem = path.parse(fileName).name.trim();
  return stem.length > 0 ? stem : "Untitled";
}

// Persist the raw file to disk and extract the dimensions needed by the
// frontend image viewer. The database row is created later, after all files in
// the request have been validated.
export async function persistUpload(
  buffer: Buffer,
  originalFileName: string,
  mimeType: string,
) {
  // Drop any directory segments that might be present in the uploaded filename.
  const safeFileName = path.basename(originalFileName);
  // Keep the original extension but generate a random stored filename to avoid
  // collisions across uploads.
  const extension = path.extname(safeFileName);
  const storagePath = `${randomUUID()}${extension}`;
  const dimensions = imageSize(buffer);

  // The detail page needs a real aspect ratio, so reject files whose dimensions
  // cannot be detected.
  if (!dimensions.width || !dimensions.height) {
    throw new Error(`Could not determine image dimensions for "${safeFileName}".`);
  }

  await writeFile(path.join(config.uploadsDir, storagePath), buffer);

  // Return the metadata that will be inserted into Postgres.
  return {
    fileName: safeFileName,
    imageHeight: dimensions.height,
    imageWidth: dimensions.width,
    mimeType,
    sizeBytes: buffer.length,
    storagePath,
    title: deriveTitle(safeFileName),
  } satisfies PreparedUpload;
}

// If a request fails after some files have already been written, remove those
// partially persisted artifacts so disk state stays aligned with the database.
export async function removeStoredFiles(storagePaths: string[]) {
  await Promise.all(
    storagePaths.map(async (storagePath) => {
      try {
        await rm(path.join(config.uploadsDir, storagePath), { force: true });
      } catch {
        // Best effort cleanup for failed requests.
      }
    }),
  );
}
