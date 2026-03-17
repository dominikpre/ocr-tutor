import { Button } from "@/ui/button";

type UploadSubmitProps = {
  isPending: boolean;
  fileCount: number;
  disabled?: boolean;
};

export function UploadSubmit({
  isPending,
  fileCount,
  disabled,
}: UploadSubmitProps) {
  return (
    <Button type="submit" disabled={disabled || isPending}>
      {isPending ? "Uploading..." : `Upload ${fileCount} file${fileCount === 1 ? "" : "s"}`}
    </Button>
  );
}
