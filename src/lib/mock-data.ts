export type TemplateFile = {
  id: string;
  name: string;
  uploadedAt: string;
  ocrStatus: string;
  reviewStatus: string;
};

export const templateFiles: TemplateFile[] = [
  {
    id: "template-1",
    name: "Template file 01",
    uploadedAt: "2026-03-17",
    ocrStatus: "queued",
    reviewStatus: "todo",
  },
  {
    id: "template-2",
    name: "Template file 02",
    uploadedAt: "2026-03-16",
    ocrStatus: "done",
    reviewStatus: "todo",
  },
];

export function getTemplateFile(id: string) {
  return templateFiles.find((file) => file.id === id);
}
