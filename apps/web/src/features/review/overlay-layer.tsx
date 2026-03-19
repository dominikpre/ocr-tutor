import type { Overlay, OverlayKind } from "@/lib/types/overlay";
import { cn } from "@/lib/utils/cn";

type OverlayLayerProps = {
  overlays: Overlay[];
  selectedOverlayId: string | null;
  onSelect: (id: string) => void;
};

const kindStyles: Record<OverlayKind, string> = {
  annotation: "border-accent bg-accent/10",
  correction: "border-primary bg-primary/10",
};

export function OverlayLayer({
  overlays,
  selectedOverlayId,
  onSelect,
}: OverlayLayerProps) {
  return (
    <>
      {overlays.map((overlay) => {
        const isSelected = overlay.id === selectedOverlayId;

        return (
          <button
            key={overlay.id}
            type="button"
            aria-label={overlay.label}
            onClick={() => onSelect(overlay.id)}
            className={cn(
              "absolute rounded-md border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#999999]",
              kindStyles[overlay.kind],
              isSelected ? "opacity-100" : "opacity-70 hover:opacity-100",
            )}
            style={{
              left: `${overlay.bounds.x * 100}%`,
              top: `${overlay.bounds.y * 100}%`,
              width: `${overlay.bounds.width * 100}%`,
              height: `${overlay.bounds.height * 100}%`,
            }}
          >
            <span className="sr-only">{overlay.label}</span>
          </button>
        );
      })}
    </>
  );
}
