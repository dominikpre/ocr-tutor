import type { SubmissionStatus } from "@/lib/types/submission";

export type ApiMeta = {
  mock: boolean;
  requestedAt: string;
  latencyMs: number;
};

export type ApiResponse<T> = {
  data: T;
  meta: ApiMeta;
};

export type UploadFile = {
  name: string;
  size: number;
  type: string;
};

export type UploadRequest = {
  collectionName: string;
  files: UploadFile[];
};

export type UploadResponse = {
  collectionName: string;
  filesReceived: number;
  status: SubmissionStatus;
  persisted: boolean;
  message: string;
};
