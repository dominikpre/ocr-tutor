import { apiFetch } from "@/lib/api/client";
import type { Submission } from "@ocr-tutor/contracts";

export async function listSubmissions(): Promise<Submission[]> {
  return apiFetch<Submission[]>("/api/submissions", {
    cache: "no-store",
  });
}

export async function getSubmissionById(
  id: string,
): Promise<Submission | null> {
  return apiFetch<Submission>(`/api/submissions/${id}`, {
    allowNotFound: true,
    cache: "no-store",
  });
}

export async function listCollections(): Promise<string[]> {
  return apiFetch<string[]>("/api/collections", {
    cache: "no-store",
  });
}
