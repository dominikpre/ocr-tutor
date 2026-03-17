import Link from "next/link";

import { ContentContainer } from "@/components/content-container";
import { controlClassName } from "@/components/control-styles";
import { ScaffoldBox } from "@/components/scaffold-box";

export default function Home() {
  return (
    <ContentContainer className="space-y-6 py-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">OCRTutor MVP</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted">
          Minimal scaffold for handwriting upload, OCR processing, and review.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/upload" className={controlClassName()}>
            Upload
          </Link>
          <Link href="/documents" className={controlClassName()}>
            Review
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <ScaffoldBox title="TODO: workflow explainer" />
        <ScaffoldBox title="TODO: OCR / feedback preview" />
      </div>
    </ContentContainer>
  );
}
