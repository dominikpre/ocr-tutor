import { fetchApi, fetchJson, readJson } from "@/lib/api/client";
import type { Submission } from "@ocr-tutor/contracts";

export async function listSubmissions(): Promise<Submission[]> {
  return fetchJson<Submission[]>("/api/submissions", {
    cache: "no-store",
  });
}

export async function getSubmissionById(
  id: string,
): Promise<Submission | null> {
  const response = await fetchApi(`/api/submissions/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  return readJson<Submission>(response);
}

export async function resetSubmissionOcr(id: string): Promise<Submission> {
  return fetchJson<Submission>(`/api/submissions/${id}/reset-ocr`, {
    method: "POST",
  });
}

export async function runSubmissionOcr(id: string): Promise<Submission> {
  return fetchJson<Submission>(`/api/submissions/${id}/run-ocr`, {
    method: "POST",
  });
}

export async function listCollections(): Promise<string[]> {
  return fetchJson<string[]>("/api/collections", {
    cache: "no-store",
  });
}
