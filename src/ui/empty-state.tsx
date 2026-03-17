import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">
          Empty state
        </p>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-xl text-sm leading-6 text-muted">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
