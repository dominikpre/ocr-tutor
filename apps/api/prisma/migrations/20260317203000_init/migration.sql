-- Keep the default public schema explicit so local development starts from a
-- known namespace.
CREATE SCHEMA IF NOT EXISTS "public";

-- Store submission state as a proper enum rather than a free-form text column.
CREATE TYPE "SubmissionStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED');

-- Collections are the user-facing buckets chosen on upload.
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- Each row in Submission corresponds to one uploaded image file.
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "imageWidth" INTEGER NOT NULL,
    "imageHeight" INTEGER NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'UPLOADED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- Prevent duplicate collection names.
CREATE UNIQUE INDEX "Collection_name_key" ON "Collection"("name");

-- Prevent two rows from pointing at the same stored file path.
CREATE UNIQUE INDEX "Submission_storagePath_key" ON "Submission"("storagePath");

-- Support collection-scoped lookups efficiently.
CREATE INDEX "Submission_collectionId_idx" ON "Submission"("collectionId");

-- Support newest-first ordering on the submissions screens.
CREATE INDEX "Submission_submittedAt_idx" ON "Submission"("submittedAt");

-- Enforce that every submission belongs to a valid collection.
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
