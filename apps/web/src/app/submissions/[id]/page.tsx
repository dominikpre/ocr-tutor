import Link from "next/link";
import { notFound } from "next/navigation";

import { CorrectedTextPanel } from "@/features/review/corrected-text-panel";
import { ImageOverlayViewer } from "@/features/review/image-overlay-viewer";
import { SubmissionStatusBadge } from "@/features/submissions/submission-status-badge";
import { getSubmissionById } from "@/lib/api/submissions";
import { formatDate } from "@/lib/utils/format-date";
import { buttonClassName } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

type SubmissionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/submissions"
          className={buttonClassName({ variant: "secondary" })}
        >
          Back to submissions
        </Link>
        <Link href="/upload" className={buttonClassName()}>
          Upload files
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{submission.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
          <SubmissionStatusBadge status={submission.status} />
          <span>{submission.collectionName}</span>
          <span>{submission.fileName}</span>
          <span>{formatDate(submission.submittedAt)}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ImageOverlayViewer
          image={submission.image}
          overlays={submission.overlays}
        />
        <CorrectedTextPanel value={submission.correctedText} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted">
          <p>Collection: {submission.collectionName}</p>
          <p>File: {submission.fileName}</p>
          <p>Submitted: {formatDate(submission.submittedAt)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
