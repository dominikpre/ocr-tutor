import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-md border border-border bg-white px-3 py-2 text-sm leading-6 text-foreground outline-none focus:border-black",
        className,
      )}
      {...props}
    />
  );
}
