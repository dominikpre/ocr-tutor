"use client";

import { useState } from "react";
import Image from "next/image";
import type { Submission } from "@ocr-tutor/contracts";

import { OverlayLayer } from "@/features/review/overlay-layer";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

type ImageOverlayViewerProps = {
  image: Submission["image"];
  overlays: Submission["overlays"];
};

export function ImageOverlayViewer({
  image,
  overlays,
}: ImageOverlayViewerProps) {
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(
    overlays[0]?.id ?? null,
  );
  const selectedOverlay =
    overlays.find((overlay) => overlay.id === selectedOverlayId) ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Original image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-md border border-border bg-[color:var(--surface-muted)]">
          <div
            className="relative"
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-contain"
            />
            <OverlayLayer
              overlays={overlays}
              selectedOverlayId={selectedOverlayId}
              onSelect={setSelectedOverlayId}
            />
          </div>
        </div>

        {selectedOverlay ? (
          <div className="rounded-md border border-border px-3 py-2 text-sm">
            <p className="font-medium">{selectedOverlay.label}</p>
            <p className="mt-1 text-muted">
              {selectedOverlay.comment ?? "No note for this overlay."}
            </p>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-sm font-medium">Overlays</p>

          {overlays.length === 0 ? (
            <p className="text-sm text-muted">No overlays yet.</p>
          ) : null}

          {overlays.map((overlay) => {
            const isSelected = overlay.id === selectedOverlayId;

            return (
              <button
                key={overlay.id}
                type="button"
                onClick={() => setSelectedOverlayId(overlay.id)}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-left",
                  isSelected
                    ? "border-black bg-[color:var(--surface-muted)]"
                    : "border-border bg-white",
                )}
              >
                <p className="text-sm font-medium">{overlay.label}</p>
                <p className="mt-1 text-sm text-muted">
                  {overlay.comment ?? "No note provided."}
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
