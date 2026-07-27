"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Upload } from "lucide-react";

type ApplyButtonProps = {
  jobId: string;
  hasApplied: boolean;
};

export function ApplyButton({ jobId, hasApplied }: ApplyButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  async function handleApply() {
    setIsLoading(true);
    setError(null);

    try {
      let resumeUrl: string | undefined;

      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);
        const uploadRes = await fetch("/api/ai/extract-text", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          resumeUrl = resumeFile.name;
        }
      }

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, resumeUrl }),
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
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
        <Upload className="h-4 w-4" />
        <span>{resumeFile ? resumeFile.name : "Attach resume (optional)"}</span>
        <input
          type="file"
          accept=".txt,.pdf"
          className="hidden"
          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
        />
      </label>
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
