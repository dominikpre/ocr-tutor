import { mockApi } from "@/lib/api/client";
import type { Submission } from "@/lib/types/submission";

const mockSubmissions: Submission[] = [
  {
    id: "submission-001",
    title: "Page 1",
    collectionName: "History reflections",
    fileName: "history-page-1.jpg",
    submittedAt: "2026-03-14T09:15:00.000Z",
    status: "completed",
    image: {
      url: "/mock/essay-01.svg",
      alt: "Handwritten history reflection page",
      width: 1200,
      height: 1600,
    },
    correctedText:
      "The factory system changed cities very quickly, and many families left the countryside. Workers had jobs, but they also faced long shifts and unhealthy working conditions.",
    overlays: [
      {
        id: "overlay-1",
        label: "Main claim",
        kind: "annotation",
        bounds: { x: 0.12, y: 0.19, width: 0.7, height: 0.1 },
        comment: "Clear opening idea.",
      },
      {
        id: "overlay-2",
        label: "Spelling issue",
        kind: "correction",
        bounds: { x: 0.22, y: 0.33, width: 0.22, height: 0.07 },
        comment: "familys -> families",
      },
    ],
  },
  {
    id: "submission-002",
    title: "Page 2",
    collectionName: "Science notebook",
    fileName: "science-page-2.jpg",
    submittedAt: "2026-03-15T11:40:00.000Z",
    status: "processing",
    image: {
      url: "/mock/essay-02.svg",
      alt: "Handwritten science notebook page",
      width: 1200,
      height: 1600,
    },
    correctedText:
      "Correction text is not ready yet. The backend service will fill this in later.",
    overlays: [
      {
        id: "overlay-4",
        label: "Sentence block",
        kind: "annotation",
        bounds: { x: 0.12, y: 0.22, width: 0.74, height: 0.08 },
        comment: "Main sentence area detected.",
      },
      {
        id: "overlay-6",
        label: "Possible correction",
        kind: "correction",
        bounds: { x: 0.16, y: 0.42, width: 0.68, height: 0.08 },
        comment: "This line will show a correction once processing finishes.",
      },
    ],
  },
  {
    id: "submission-003",
    title: "Page 3",
    collectionName: "Literature journal",
    fileName: "literature-page-3.jpg",
    submittedAt: "2026-03-16T08:05:00.000Z",
    status: "uploaded",
    image: {
      url: "/mock/essay-03.svg",
      alt: "Handwritten literature journal page",
      width: 1200,
      height: 1600,
    },
    correctedText:
      "This submission was uploaded and is waiting to be processed.",
    overlays: [
      {
        id: "overlay-7",
        label: "Shadowed section",
        kind: "annotation",
        bounds: { x: 0.18, y: 0.34, width: 0.62, height: 0.18 },
        comment: "Low contrast area in the image.",
      },
    ],
  },
];

function compareSubmittedAtDesc(left: Submission, right: Submission) {
  return (
    new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
  );
}

export async function listSubmissions(): Promise<Submission[]> {
  const response = await mockApi(
    () => [...mockSubmissions].sort(compareSubmittedAtDesc),
    180,
  );
  return response.data;
}

export async function getSubmissionById(
  id: string,
): Promise<Submission | null> {
  const response = await mockApi(
    () => mockSubmissions.find((submission) => submission.id === id) ?? null,
    220,
  );

  return response.data;
}

export async function listCollections(): Promise<string[]> {
  const response = await mockApi(
    () =>
      Array.from(
        new Set(mockSubmissions.map((submission) => submission.collectionName)),
      ),
    120,
  );

  return response.data;
}
