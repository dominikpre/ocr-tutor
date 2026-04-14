import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeVariant = "neutral" | "info" | "success";

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-[color:var(--surface-muted)] text-foreground",
  info: "bg-[#eff6ff] text-[#1d4ed8]",
  success: "bg-[#f0fdf4] text-[#15803d]",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
