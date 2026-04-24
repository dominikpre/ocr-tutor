"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { runSubmissionOcr } from "@/lib/api/submissions";
import { Button } from "@/ui/button";

type RunOcrButtonProps = {
  submissionId: string;
};

export function RunOcrButton({ submissionId }: RunOcrButtonProps) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  async function handleRunOcr() {
    setIsRunning(true);
    setError("");

    try {
      await runSubmissionOcr(submissionId);
      router.refresh();
    } catch (runError) {
      setError(
        runError instanceof Error ? runError.message : "Could not start OCR.",
      );
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button disabled={isRunning} onClick={handleRunOcr}>
        {isRunning ? "Starting..." : "Run OCR"}
      </Button>
      {error ? <p className="max-w-80 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
