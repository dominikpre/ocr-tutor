import Link from "next/link";

import { UploadForm } from "@/features/upload/upload-form";
import { listCollections } from "@/lib/api/submissions";
import { buttonClassName } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default async function UploadPage() {
  const collections = await listCollections();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Upload</h1>
          <p className="mt-1 text-sm text-muted">
            Add one or more image files to an existing collection or create a
            new one.
          </p>
        </div>
        <Link
          href="/submissions"
          className={buttonClassName({ variant: "secondary" })}
        >
          View submissions
        </Link>
      </div>

      <UploadForm collections={collections} />

      <Card>
        <CardHeader>
          <CardTitle>Current scope</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted">
            This page stores uploaded images and metadata now. OCR, corrections,
            and overlays still come later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
