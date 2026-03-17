import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ScaffoldBoxProps = {
  title: string;
  children?: ReactNode;
  className?: string;
};

export function ScaffoldBox({
  title,
  children,
  className,
}: ScaffoldBoxProps) {
  return (
    <section className={cn("rounded-lg border border-border bg-white p-4", className)}>
      <p className="text-sm text-muted">{title}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </section>
  );
}
