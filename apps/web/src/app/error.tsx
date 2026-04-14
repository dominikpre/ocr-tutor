"use client";

import { useEffect } from "react";
import Link from "next/link";

import { buttonClassName } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

type AppErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function AppErrorPage({ error, reset }: AppErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isApiError = error.message.includes("Could not reach the API");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isApiError ? "Backend unavailable" : "Could not load this page"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-muted">
            {isApiError
              ? error.message
              : "Something went wrong while loading this page."}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => reset()} className={buttonClassName()}>
              Retry
            </button>
            <Link
              href="/"
              className={buttonClassName({ variant: "secondary" })}
            >
              Back home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
