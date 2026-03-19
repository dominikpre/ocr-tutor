import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { SubmissionStatus } from "@prisma/client";

import { config } from "./config.js";
import { prisma } from "./prisma.js";
import {
  buildImageAlt,
  buildImageUrl,
  ensureUploadsDir,
  persistUpload,
  removeStoredFiles,
} from "./storage.js";

// A tiny application-level error type lets route handlers throw clear 4xx
// failures without manually shaping reply payloads everywhere.
class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Prisma stores enum values in uppercase, while the frontend contract uses the
// original lowercase strings from the mocked domain model.
function toApiStatus(status: SubmissionStatus) {
  switch (status) {
    case SubmissionStatus.COMPLETED:
      return "completed";
    case SubmissionStatus.PROCESSING:
      return "processing";
    default:
      return "uploaded";
  }
}

// Convert the database row into the exact response shape expected by the demo
// frontend. OCR-related fields remain empty placeholders in this MVP.
function toSubmissionResponse(
  submission: {
    id: string;
    title: string;
    fileName: string;
    status: SubmissionStatus;
    storagePath: string;
    imageWidth: number;
    imageHeight: number;
    submittedAt: Date;
    collection: {
      name: string;
    };
  },
) {
  return {
    id: submission.id,
    title: submission.title,
    collectionName: submission.collection.name,
    fileName: submission.fileName,
    submittedAt: submission.submittedAt.toISOString(),
    status: toApiStatus(submission.status),
    image: {
      url: buildImageUrl(submission.storagePath),
      alt: buildImageAlt(submission.title),
      width: submission.imageWidth,
      height: submission.imageHeight,
    },
    correctedText: "",
    overlays: [],
  };
}

export async function buildApp() {
  // Static file serving depends on the upload directory already existing.
  await ensureUploadsDir();

  // Fastify owns HTTP transport concerns; Prisma and file storage stay in
  // dedicated helper modules so the route file remains readable.
  const app = fastify({
    logger: true,
  });

  // The browser upload form talks directly to this service, so CORS must allow
  // the frontend origin during local development.
  await app.register(cors, {
    origin: config.frontendOrigin,
  });

  // Configure multipart parsing limits once at the framework edge.
  await app.register(multipart, {
    limits: {
      files: config.maxFileCount,
      fileSize: config.maxFileSizeBytes,
    },
  });

  // Expose saved images under a stable public path that matches the URLs we put
  // into the JSON response payloads.
  await app.register(fastifyStatic, {
    prefix: "/uploads/",
    root: config.uploadsDir,
  });

  // Return only collection names because the upload screen only needs them to
  // populate the selector.
  app.get("/api/collections", async () => {
    const collections = await prisma.collection.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
      },
    });

    return collections.map((collection) => collection.name);
  });

  // The list endpoint drives the homepage and submissions overview, so it
  // returns the frontend-ready domain objects sorted newest first.
  app.get("/api/submissions", async () => {
    const submissions = await prisma.submission.findMany({
      include: {
        collection: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return submissions.map(toSubmissionResponse);
  });

  // The detail endpoint reuses the same response mapper as the list endpoint,
  // but loads only one submission and returns a 404 when it does not exist.
  app.get("/api/submissions/:id", async (request) => {
    const { id } = request.params as { id: string };
    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        collection: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!submission) {
      throw new HttpError(404, `Submission "${id}" was not found.`);
    }

    return toSubmissionResponse(submission);
  });

  // Accept one logical submission batch: a collection name plus one or more
  // files. Each file becomes one Submission row in the database.
  app.post("/api/submissions", async (request, reply) => {
    // Track stored files so we can clean them up if anything later in the
    // request fails.
    const savedStoragePaths: string[] = [];
    // Collect validated upload metadata here before opening the database
    // transaction.
    const preparedUploads: Array<Awaited<ReturnType<typeof persistUpload>>> = [];
    let collectionName = "";

    try {
      // request.parts() streams both fields and files in the order they arrive.
      const parts = request.parts();

      for await (const part of parts) {
        // Capture regular form fields first.
        if (part.type === "field") {
          if (part.fieldname === "collectionName") {
            collectionName = String(part.value).trim();
          }
          continue;
        }

        // Reject unexpected file field names so the API contract stays tight.
        if (part.fieldname !== "files") {
          part.file.resume();
          throw new HttpError(400, `Unexpected file field "${part.fieldname}".`);
        }

        const fileName = part.filename ? part.filename.trim() : "";

        // Multipart uploads should always provide a filename. Missing names make
        // later storage/debugging much harder, so reject them.
        if (!fileName) {
          throw new HttpError(400, "Each uploaded file must have a name.");
        }

        // The MVP only accepts images because the detail page renders the stored
        // file directly.
        if (!part.mimetype.startsWith("image/")) {
          part.file.resume();
          throw new HttpError(400, `File "${fileName}" must be an image.`);
        }

        // Read the full file into memory once. This keeps the MVP simple and
        // also gives image-size direct access to the bytes for dimension
        // extraction.
        const buffer = await part.toBuffer();

        if (buffer.length === 0) {
          throw new HttpError(400, `File "${fileName}" is empty.`);
        }

        // Write the file to disk and capture the metadata needed for the later
        // DB insert.
        const preparedUpload = await persistUpload(buffer, fileName, part.mimetype);
        preparedUploads.push(preparedUpload);
        savedStoragePaths.push(preparedUpload.storagePath);
      }

      // Enforce the required form field after parsing because multipart fields
      // and files can arrive in any order.
      if (!collectionName) {
        throw new HttpError(400, "collectionName is required.");
      }

      if (preparedUploads.length === 0) {
        throw new HttpError(400, "At least one file must be uploaded.");
      }

      // Persist all rows in one transaction so the database never ends up with
      // only part of a multi-file batch.
      await prisma.$transaction(async (tx) => {
        // Reuse an existing collection with the same trimmed name, or create it
        // the first time it appears.
        const collection = await tx.collection.upsert({
          where: {
            name: collectionName,
          },
          update: {},
          create: {
            name: collectionName,
          },
        });

        // Create one Submission record per uploaded file.
        for (const preparedUpload of preparedUploads) {
          await tx.submission.create({
            data: {
              collectionId: collection.id,
              fileName: preparedUpload.fileName,
              imageHeight: preparedUpload.imageHeight,
              imageWidth: preparedUpload.imageWidth,
              mimeType: preparedUpload.mimeType,
              sizeBytes: preparedUpload.sizeBytes,
              storagePath: preparedUpload.storagePath,
              title: preparedUpload.title,
            },
          });
        }
      });

      const fileCount = preparedUploads.length;
      const pluralSuffix = fileCount === 1 ? "" : "s";

      // The frontend upload panel expects an aggregate success response rather
      // than the full created records.
      return reply.code(201).send({
        collectionName,
        filesReceived: fileCount,
        status: "uploaded",
        persisted: true,
        message: `Accepted ${fileCount} file${pluralSuffix} for "${collectionName}".`,
      });
    } catch (error) {
      // If validation or DB persistence fails, remove any files already written
      // for this request.
      await removeStoredFiles(savedStoragePaths);
      throw error;
    }
  });

  // Normalize all thrown errors into a small JSON shape the frontend can show.
  app.setErrorHandler((error, _request, reply) => {
    const statusCode =
      error instanceof HttpError
        ? error.statusCode
        : typeof error === "object" &&
            error !== null &&
            "statusCode" in error &&
            typeof error.statusCode === "number" &&
            error.statusCode >= 400
          ? error.statusCode
          : 500;

    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    void reply.status(statusCode).send({
      error: message,
    });
  });

  // Close Prisma when Fastify shuts down so local development does not leave
  // hanging DB connections behind.
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}
