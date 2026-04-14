"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UploadResponse } from "@ocr-tutor/contracts";

import { ImagePreview } from "@/features/upload/image-preview";
import { UploadDropzone } from "@/features/upload/upload-dropzone";
import { UploadSubmit } from "@/features/upload/upload-submit";
import { createUpload } from "@/lib/api/uploads";
import { buttonClassName } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input, inputClassName } from "@/ui/input";

type UploadFormProps = {
  collections: string[];
};

export function UploadForm({ collections }: UploadFormProps) {
  const router = useRouter();
  const [availableCollections, setAvailableCollections] = useState(collections);
  const [selectedCollection, setSelectedCollection] = useState(collections[0] ?? "");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAvailableCollections(collections);
    setSelectedCollection((currentSelection) => {
      if (currentSelection.length > 0) {
        return currentSelection;
      }

      return collections[0] ?? "";
    });
  }, [collections]);

  useEffect(() => {
    if (files.length === 0) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(files[0]);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [files]);

  const collectionName = newCollectionName.trim() || selectedCollection;
  const canSubmit = files.length > 0 && collectionName.length > 0;

  function addFiles(nextFiles: File[]) {
    setFiles((currentFiles) => {
      const knownFiles = new Set(
        currentFiles.map(
          (file) => `${file.name}-${file.size}-${file.lastModified}`,
        ),
      );

      const uniqueFiles = nextFiles.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        return !knownFiles.has(key);
      });

      return [...currentFiles, ...uniqueFiles];
    });
  }

  function removeFile(index: number) {
    setFiles((currentFiles) => currentFiles.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const nextResult = await createUpload({
        collectionName,
        files,
      });

      setResult(nextResult);
      setAvailableCollections((currentCollections) => {
        if (currentCollections.includes(collectionName)) {
          return currentCollections;
        }

        return [...currentCollections, collectionName].sort((left, right) =>
          left.localeCompare(right),
        );
      });
      setSelectedCollection(collectionName);
      setFiles([]);
      setNewCollectionName("");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Upload failed unexpectedly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Existing collection">
                <select
                  value={selectedCollection}
                  onChange={(event) => setSelectedCollection(event.currentTarget.value)}
                  className={inputClassName()}
                  disabled={availableCollections.length === 0}
                >
                  {availableCollections.length === 0 ? (
                    <option value="">No collections yet</option>
                  ) : null}
                  {availableCollections.map((collection) => (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Or create a new collection">
                <Input
                  value={newCollectionName}
                  onChange={(event) =>
                    setNewCollectionName(event.currentTarget.value)
                  }
                  placeholder="e.g. Week 3 homework"
                />
              </Field>
            </div>

            <UploadDropzone onAddFiles={addFiles} />

            {files.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected files</p>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.lastModified}`}
                      className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
                    >
                      <span className="min-w-0 truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className={buttonClassName({ variant: "ghost", size: "sm" })}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <UploadSubmit
                isPending={isSubmitting}
                fileCount={files.length}
                disabled={!canSubmit}
              />
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setFiles([]);
                  setResult(null);
                }}
                className={buttonClassName({ variant: "ghost" })}
              >
                Clear
              </button>
            </div>

            {errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      {previewUrl ? (
        <ImagePreview previewUrl={previewUrl} fileName={files[0]?.name ?? ""} />
      ) : null}

      {result ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm">{result.message}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
