import Link from "next/link";

import { SubmissionsList } from "@/features/submissions/submissions-list";
import { listSubmissions } from "@/lib/api/submissions";
import { buttonClassName } from "@/ui/button";

export default async function SubmissionsPage() {
  const submissions = await listSubmissions();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Submissions</h1>
          <p className="mt-1 text-sm text-muted">
            Simple list of uploaded pages and their current processing status.
          </p>
        </div>
        <Link href="/upload" className={buttonClassName()}>
          Upload files
        </Link>
      </div>

      <SubmissionsList submissions={submissions} />
    </div>
  );
}
