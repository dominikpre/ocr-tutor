import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ResetOcrButton } from "@/features/submissions/reset-ocr-button";
import { RunOcrButton } from "@/features/submissions/run-ocr-button";
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

function JsonDebugBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-[color:var(--surface-muted)] p-4 text-sm leading-6">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function TextDebugBlock({ children }: { children: string }) {
  return (
    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-[color:var(--surface-muted)] p-4 text-sm leading-6">
      {children || "(empty)"}
    </pre>
  );
}

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

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{submission.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
            <SubmissionStatusBadge status={submission.status} />
            <span>{submission.collectionName}</span>
            <span>{submission.fileName}</span>
            <span>{formatDate(submission.submittedAt)}</span>
          </div>
        </div>
        {submission.status === "uploaded" ? (
          <RunOcrButton submissionId={submission.id} />
        ) : (
          <ResetOcrButton submissionId={submission.id} />
        )}
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

      <Card>
        <CardHeader>
          <CardTitle>OCR debug output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <dt className="text-muted">Attempts</dt>
              <dd className="font-medium">{submission.ocrAttempts}</dd>
            </div>
            <div>
              <dt className="text-muted">Processed</dt>
              <dd className="font-medium">
                {submission.processedAt ? formatDate(submission.processedAt) : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Next attempt</dt>
              <dd className="font-medium">
                {submission.nextOcrAttemptAt
                  ? formatDate(submission.nextOcrAttemptAt)
                  : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Text length</dt>
              <dd className="font-medium">{submission.correctedText.length}</dd>
            </div>
            <div>
              <dt className="text-muted">Overlays</dt>
              <dd className="font-medium">{submission.overlays.length}</dd>
            </div>
          </dl>

          {submission.ocrLastError ? (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">Last error</h2>
              <TextDebugBlock>{submission.ocrLastError}</TextDebugBlock>
            </section>
          ) : null}

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Raw Ollama response</h2>
            <TextDebugBlock>
              {submission.ocrRawResponse ??
                "No raw Ollama response has been stored for this submission."}
            </TextDebugBlock>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Corrected text</h2>
            <TextDebugBlock>{submission.correctedText}</TextDebugBlock>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Overlays JSON</h2>
            <JsonDebugBlock value={submission.overlays} />
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
