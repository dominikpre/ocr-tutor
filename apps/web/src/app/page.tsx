import Link from "next/link";

import { SubmissionsList } from "@/features/submissions/submissions-list";
import { listSubmissions } from "@/lib/api/submissions";
import { buttonClassName } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default async function HomePage() {
  const submissions = await listSubmissions();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Minimal OCR tutor MVP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted">
            Upload handwritten images into a collection, view stored
            submissions, and open a detail page with the original image. OCR
            results and corrections are not part of this MVP yet.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/upload" className={buttonClassName()}>
              Upload files
            </Link>
            <Link
              href="/submissions"
              className={buttonClassName({ variant: "secondary" })}
            >
              View submissions
            </Link>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent submissions</h2>
        <SubmissionsList submissions={submissions} />
      </section>
    </div>
  );
}
