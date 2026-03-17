export type OverlayKind = "annotation" | "correction";

export type OverlayBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Overlay = {
  id: string;
  label: string;
  kind: OverlayKind;
  bounds: OverlayBounds;
  comment?: string;
};
