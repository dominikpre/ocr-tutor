-- Add terminal failure state for submissions that exceed retry attempts.
ALTER TYPE "SubmissionStatus" ADD VALUE 'failed';

-- Capture OCR lifecycle metadata written by the background worker.
ALTER TABLE "Submission"
ADD COLUMN "ocrAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "ocrLastError" TEXT,
ADD COLUMN "nextOcrAttemptAt" TIMESTAMP(3),
ADD COLUMN "processedAt" TIMESTAMP(3);

-- Speed up worker claim queries by status and retry eligibility.
CREATE INDEX "Submission_status_nextOcrAttemptAt_submittedAt_idx" ON "Submission"("status", "nextOcrAttemptAt", "submittedAt");
