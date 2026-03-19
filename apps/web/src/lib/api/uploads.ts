import { mockApi } from "@/lib/api/client";
import type { UploadRequest, UploadResponse } from "@/lib/types/api";

export async function createUpload(
  request: UploadRequest,
): Promise<UploadResponse> {
  const response = await mockApi<UploadResponse>(
    () => ({
      collectionName: request.collectionName,
      filesReceived: request.files.length,
      status: "uploaded",
      persisted: false,
      message: `Accepted ${request.files.length} file${request.files.length === 1 ? "" : "s"} for "${request.collectionName}".`,
    }),
    300,
  );

  return response.data;
}
