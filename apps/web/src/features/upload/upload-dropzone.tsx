"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/ui/button";

type UploadDropzoneProps = {
  onAddFiles: (files: File[]) => void;
};

const acceptedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const acceptedExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".heic",
  ".heif",
]);

const acceptedTypes = [
  ...acceptedMimeTypes,
  ...acceptedExtensions,
].join(",");

function isAcceptedFile(file: File) {
  if (acceptedMimeTypes.has(file.type)) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  return Array.from(acceptedExtensions).some((extension) =>
    fileName.endsWith(extension),
  );
}

export function UploadDropzone({ onAddFiles }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

  function handleFiles(nextFileList: FileList | null) {
    const nextFiles = Array.from(nextFileList ?? []);

    if (nextFiles.length === 0) {
      return;
    }

    const acceptedFiles = nextFiles.filter(isAcceptedFile);
    const rejectedFiles = nextFiles.filter((file) => !isAcceptedFile(file));

    if (acceptedFiles.length > 0) {
      onAddFiles(acceptedFiles);
    }

    if (rejectedFiles.length > 0) {
      const fileLabel =
        rejectedFiles.length === 1
          ? rejectedFiles[0]?.name
          : `${rejectedFiles.length} files`;
      setRejectionMessage(
        `Ignored unsupported file type for ${fileLabel}. Use PNG, JPG, WEBP, HEIC, or HEIF.`,
      );
      return;
    }

    setRejectionMessage(null);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "rounded-md border border-dashed p-6",
        isDragging ? "border-black bg-[color:var(--surface-muted)]" : "border-border",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes}
        multiple
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-base font-semibold">Drop files here</p>
          <p className="text-sm leading-6 text-muted">
            Or pick one or more handwritten images from your device.
          </p>
          {rejectionMessage ? (
            <p aria-live="polite" className="text-sm text-red-600">
              {rejectionMessage}
            </p>
          ) : null}
        </div>

        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
          >
            Pick files
          </Button>
        </div>
      </div>
    </div>
  );
}
