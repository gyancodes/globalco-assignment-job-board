"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import type { JobMatchResult } from "@/types";

type JobMatchScoreProps = {
  jobId: string;
};

export function JobMatchScore({ jobId }: JobMatchScoreProps) {
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch("/api/ai/job-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to get match");
        }
        const json = await res.json();
        setResult(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : null);
      } finally {
        setLoading(false);
      }
    }
    fetchMatch();
  }, [jobId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyzing your profile...
        </CardContent>
      </Card>
    );
  }

  if (error || !result) return null;

  const scoreColor = result.overallScore >= 70
    ? "text-[rgb(var(--chart-2))]"
    : result.overallScore >= 40
    ? "text-[rgb(var(--chart-3))]"
    : "text-[rgb(var(--chart-5))]";

  const scoreBg = result.overallScore >= 70
    ? "bg-chart-2/10"
    : result.overallScore >= 40
    ? "bg-chart-3/10"
    : "bg-chart-5/10";

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Match Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl ${scoreBg} flex items-center justify-center shrink-0`}>
            <span className={`text-2xl font-bold ${scoreColor}`}>{result.overallScore}%</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Skills Match</p>
            <p className={`text-lg font-bold mt-1 ${result.skillsScore >= 70 ? "text-[rgb(var(--chart-2))]" : result.skillsScore >= 40 ? "text-[rgb(var(--chart-3))]" : "text-[rgb(var(--chart-5))]"}`}>
              {result.skillsScore}%
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Experience Match</p>
            <p className={`text-lg font-bold mt-1 ${result.experienceScore >= 70 ? "text-[rgb(var(--chart-2))]" : result.experienceScore >= 40 ? "text-[rgb(var(--chart-3))]" : "text-[rgb(var(--chart-5))]"}`}>
              {result.experienceScore}%
            </p>
          </div>
        </div>

        {result.matchingSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-[rgb(var(--chart-2))]" /> Matching Skills
            </p>
            <div className="flex flex-wrap gap-1">
              {result.matchingSkills.map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px] bg-chart-2/10 text-[rgb(var(--chart-2))] border-chart-2/20">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {result.missingSkills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <XCircle className="h-3 w-3 text-[rgb(var(--chart-5))]" /> Skills to Develop
            </p>
            <div className="flex flex-wrap gap-1">
              {result.missingSkills.map((s) => (
                <Badge key={s} variant="outline" className="text-[10px] text-muted-foreground border-dashed">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {result.recommendations.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <Lightbulb className="h-3 w-3 text-[rgb(var(--chart-3))]" /> Recommendations
            </p>
            <ul className="space-y-1">
              {result.recommendations.map((r, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                  <span className="text-primary mt-0.5">&bull;</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
