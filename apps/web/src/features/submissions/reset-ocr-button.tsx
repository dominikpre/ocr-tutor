"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { resetSubmissionOcr } from "@/lib/api/submissions";
import { Button } from "@/ui/button";

type ResetOcrButtonProps = {
  submissionId: string;
};

export function ResetOcrButton({ submissionId }: ResetOcrButtonProps) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    setIsResetting(true);
    setError("");

    try {
      await resetSubmissionOcr(submissionId);
      router.refresh();
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Could not reset OCR status.",
      );
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        disabled={isResetting}
        onClick={handleReset}
        variant="secondary"
      >
        {isResetting ? "Resetting..." : "Reset OCR"}
      </Button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
