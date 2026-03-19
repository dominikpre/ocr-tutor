import Link from "next/link";

import type { Submission } from "@/lib/types/submission";
import { formatDate } from "@/lib/utils/format-date";
import { buttonClassName } from "@/ui/button";
import { Card } from "@/ui/card";
import { SubmissionStatusBadge } from "@/features/submissions/submission-status-badge";

type SubmissionsListItemProps = {
  submission: Submission;
};

export function SubmissionsListItem({
  submission,
}: SubmissionsListItemProps) {
  return (
    <li>
      <Card>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">{submission.title}</h3>
            <p className="text-sm text-muted">
              {submission.collectionName} · {submission.fileName}
            </p>
            <p className="text-sm text-muted">
              Submitted {formatDate(submission.submittedAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SubmissionStatusBadge status={submission.status} />
            <Link href={`/submissions/${submission.id}`} className={buttonClassName()}>
              Open
            </Link>
          </div>
        </div>
      </Card>
    </li>
  );
}
