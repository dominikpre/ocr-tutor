import type { SubmissionStatus } from "@ocr-tutor/contracts";
import { Badge } from "@/ui/badge";

type SubmissionStatusBadgeProps = {
  status: SubmissionStatus;
};

export function SubmissionStatusBadge({
  status,
}: SubmissionStatusBadgeProps) {
  if (status === "processing") {
    return <Badge variant="info">Processing</Badge>;
  }

  if (status === "completed") {
    return <Badge variant="success">Completed</Badge>;
  }

  return <Badge variant="neutral">Uploaded</Badge>;
}
