"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

type ApplyButtonProps = {
  jobId: string;
  hasApplied: boolean;
};

export function ApplyButton({ jobId, hasApplied }: ApplyButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to apply");
      }

      setApplied(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (applied) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-chart-2/10 text-[rgb(var(--chart-2))] px-4 py-2 text-sm font-medium">
        <CheckCircle className="h-4 w-4" />
        Applied
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button onClick={handleApply} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Applying...
          </>
        ) : (
          "Apply Now"
        )}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
