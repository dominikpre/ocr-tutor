import Link from "next/link";
import type { Submission } from "@ocr-tutor/contracts";

import { SubmissionsListItem } from "@/features/submissions/submissions-list-item";
import { buttonClassName } from "@/ui/button";
import { EmptyState } from "@/ui/empty-state";

type SubmissionsListProps = {
  submissions: Submission[];
};

export function SubmissionsList({ submissions }: SubmissionsListProps) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        title="No submissions yet"
        description="Upload one or more files to create the first submission set."
        action={
          <Link href="/upload" className={buttonClassName()}>
            Start with an upload
          </Link>
        }
      />
    );
  }

  return (
    <ul className="space-y-4">
      {submissions.map((submission) => (
        <SubmissionsListItem key={submission.id} submission={submission} />
      ))}
    </ul>
  );
}
