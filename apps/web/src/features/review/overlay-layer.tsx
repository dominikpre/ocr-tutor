import type { Submission } from "@ocr-tutor/contracts";
import { cn } from "@/lib/utils/cn";

type OverlayLayerProps = {
  overlays: Submission["overlays"];
  selectedOverlayId: string | null;
  onSelect: (id: string) => void;
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
              "border-primary bg-primary/10",
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
