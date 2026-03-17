import Link from "next/link";

import { buttonClassName } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Card className="max-w-lg">
        <CardHeader>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">
            Not found
          </p>
          <CardTitle className="text-3xl">Page not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted">
            The page you requested does not exist in the current frontend.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className={buttonClassName()}>
              Back to overview
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
    </div>
  );
}
