-- Keep the raw model response so local debugging can inspect parser inputs.
ALTER TABLE "Submission"
ADD COLUMN "ocrRawResponse" TEXT;
