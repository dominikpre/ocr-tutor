import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function inputClassName(className?: string) {
  return cn(
    "h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-foreground outline-none focus:border-black",
    className,
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={inputClassName(className)}
      {...props}
    />
  );
}
