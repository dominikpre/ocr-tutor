import Link from "next/link";

import { ContentContainer } from "@/components/content-container";
import { controlClassName } from "@/components/control-styles";

export default function NotFound() {
  return (
    <ContentContainer className="py-16">
      <div className="space-y-4 rounded-lg border border-border bg-white p-6">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="text-sm leading-6 text-muted">
          This page does not exist in the current scaffold.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/documents" className={controlClassName()}>
            Review
          </Link>
          <Link href="/" className={controlClassName()}>
            Home
          </Link>
        </div>
      </div>
    </ContentContainer>
  );
}
