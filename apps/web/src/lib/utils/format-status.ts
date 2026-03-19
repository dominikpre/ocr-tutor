const statusLabels: Record<string, string> = {
  uploaded: "Uploaded",
  processing: "Processing",
  completed: "Completed",
};

export function formatStatus(value: string) {
  return statusLabels[value] ?? value.replaceAll("-", " ");
}
