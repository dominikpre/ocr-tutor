export type SubmissionStatus = "uploaded" | "processing" | "completed";

export type SubmissionImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type SubmissionOverlay = {
  id: string;
  label: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  comment?: string;
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
  overlays: SubmissionOverlay[];
};

export type UploadResponse = {
  collectionName: string;
  filesReceived: number;
  status: SubmissionStatus;
  persisted: boolean;
  message: string;
};
