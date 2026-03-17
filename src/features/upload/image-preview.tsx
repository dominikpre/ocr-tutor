"use client";

/* eslint-disable @next/next/no-img-element */

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

type ImagePreviewProps = {
  previewUrl: string;
  fileName: string;
};

export function ImagePreview({ previewUrl, fileName }: ImagePreviewProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-hidden rounded-md border border-border bg-[color:var(--surface-muted)]">
          <img
            src={previewUrl}
            alt={fileName}
            className="aspect-[4/5] w-full object-contain"
          />
        </div>
        <p className="text-sm text-muted">{fileName}</p>
      </CardContent>
    </Card>
  );
}
