import type { Overlay } from "@/lib/types/overlay";

export type SubmissionStatus = "uploaded" | "processing" | "completed";

export type SubmissionImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type Submission = {
  id: string;
  title: string;
  collectionName: string;
  fileName: string;
  submittedAt: string;
  status: SubmissionStatus;
  image: SubmissionImage;
  correctedText: string;
  overlays: Overlay[];
};
