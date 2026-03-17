import { cn } from "@/lib/utils";

const baseControlClassName =
  "inline-flex items-center rounded-md border border-border bg-white px-3 py-2 text-sm";

export function controlClassName(className?: string) {
  return cn(baseControlClassName, className);
}
