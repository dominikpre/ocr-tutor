import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentContainer } from "@/components/content-container";
import { controlClassName } from "@/components/control-styles";
import { ScaffoldBox } from "@/components/scaffold-box";
import { getTemplateFile } from "@/lib/mock-data";

type DocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  const file = getTemplateFile(id);

  if (!file) {
    notFound();
  }

  return (
    <ContentContainer className="space-y-6 py-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">{file.name}</h1>
        <p className="text-sm leading-6 text-muted">
          OCR: {file.ocrStatus} / Review: {file.reviewStatus}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/documents" className={controlClassName()}>
            Back to review
          </Link>
          <Link href="/upload" className={controlClassName()}>
            Upload
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <ScaffoldBox title="TODO: OCR output" />
        <ScaffoldBox title="TODO: corrected text" />
        <ScaffoldBox title="TODO: feedback overlay" />
      </div>
    </ContentContainer>
  );
}
