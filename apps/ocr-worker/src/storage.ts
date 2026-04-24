import { readFile } from "node:fs/promises";
import path from "node:path";

import { config } from "./config.js";

export type SubmissionImageReference = {
  mimeType: string;
  storageKey: string;
};

export type SubmissionImagePayload = {
  bytes: Buffer;
  mimeType: string;
  storageKey: string;
};

export interface SubmissionImageStore {
  readSubmissionImage(
    reference: SubmissionImageReference,
  ): Promise<SubmissionImagePayload>;
}

class LocalDiskSubmissionImageStore implements SubmissionImageStore {
  rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = path.resolve(rootDir);
  }

  async readSubmissionImage(
    reference: SubmissionImageReference,
  ): Promise<SubmissionImagePayload> {
    // storagePath is treated as an opaque storage key so this adapter can be
    // swapped with object storage without changing worker orchestration logic.
    const imagePath = path.resolve(this.rootDir, reference.storageKey);
    const allowedPrefix = `${this.rootDir}${path.sep}`;

    if (imagePath !== this.rootDir && !imagePath.startsWith(allowedPrefix)) {
      throw new Error(`Invalid storage key "${reference.storageKey}".`);
    }

    const bytes = await readFile(imagePath);

    return {
      bytes,
      mimeType: reference.mimeType,
      storageKey: reference.storageKey,
    };
  }
}

export function createSubmissionImageStore(): SubmissionImageStore {
  if (config.storageDriver === "local") {
    return new LocalDiskSubmissionImageStore(config.uploadsDir);
  }

  throw new Error(
    [
      'SUBMISSION_STORAGE_DRIVER="object" is configured, but no object-storage',
      "adapter is implemented yet. Keep it on local for now and add an object",
      "adapter when you migrate.",
    ].join(" "),
  );
}
