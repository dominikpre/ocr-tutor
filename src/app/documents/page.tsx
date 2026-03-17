import { FileList } from "@/components/file-list";
import { ContentContainer } from "@/components/content-container";
import { ScaffoldBox } from "@/components/scaffold-box";
import { templateFiles } from "@/lib/mock-data";

export default function DocumentsPage() {
  return (
    <ContentContainer className="space-y-6 py-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">Review</h1>
        <p className="text-sm leading-6 text-muted">
          Simple review scaffold for uploaded files.
        </p>
      </section>

      <ScaffoldBox title="TODO: list / cover switch" />

      <ScaffoldBox title="TODO: review queue">
        <FileList files={templateFiles} />
      </ScaffoldBox>
    </ContentContainer>
  );
}
