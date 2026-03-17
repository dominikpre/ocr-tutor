import { FileList } from "@/components/file-list";
import { ContentContainer } from "@/components/content-container";
import { controlClassName } from "@/components/control-styles";
import { ScaffoldBox } from "@/components/scaffold-box";
import { templateFiles } from "@/lib/mock-data";

export default function UploadPage() {
  return (
    <ContentContainer className="space-y-6 py-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">Upload</h1>
        <p className="text-sm leading-6 text-muted">
          Choose a file. Upload handling is still TODO.
        </p>
        <label
          htmlFor="page-upload"
          className={controlClassName("cursor-pointer")}
        >
          Choose file
        </label>
        <input
          id="page-upload"
          type="file"
          accept="image/*,.pdf"
          className="sr-only"
        />
      </section>

      <ScaffoldBox title="TODO: uploaded files">
        <FileList files={templateFiles} />
      </ScaffoldBox>
    </ContentContainer>
  );
}
