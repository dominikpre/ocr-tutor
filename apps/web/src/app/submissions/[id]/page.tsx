import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

      <Card>
        <CardHeader>
          <CardTitle>Original image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-md border border-border bg-[color:var(--surface-muted)]">
            <div
              className="relative"
              style={{
                aspectRatio: `${submission.image.width} / ${submission.image.height}`,
              }}
            >
              <Image
                src={submission.image.url}
                alt={submission.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-contain"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
