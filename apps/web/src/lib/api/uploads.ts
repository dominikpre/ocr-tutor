import { fetchJson } from "@/lib/api/client";
import type { UploadResponse } from "@ocr-tutor/contracts";

type CreateUploadInput = {
  collectionName: string;
  files: File[];
};

export async function createUpload(
  request: CreateUploadInput,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("collectionName", request.collectionName);

  for (const file of request.files) {
    formData.append("files", file);
  }

  return fetchJson<UploadResponse>("/api/submissions", {
    method: "POST",
    body: formData,
  });
}
