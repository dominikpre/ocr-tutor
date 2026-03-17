import Link from "next/link";

import { controlClassName } from "@/components/control-styles";
import type { TemplateFile } from "@/lib/mock-data";

type FileListProps = {
  files: TemplateFile[];
};

export function FileList({ files }: FileListProps) {
  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li
          key={file.id}
          className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-sm text-muted">{file.uploadedAt}</p>
          </div>
          <p className="text-sm text-muted">
            OCR: {file.ocrStatus} / Review: {file.reviewStatus}
          </p>
          <Link href={`/documents/${file.id}`} className={controlClassName()}>
            Open
          </Link>
        </li>
      ))}
    </ul>
  );
}
