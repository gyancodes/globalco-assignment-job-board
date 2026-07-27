"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateJobDescriptionSchema,
  type GenerateJobDescriptionInput,
} from "@/lib/validations";
import type { GeneratedJobDescription } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ArrowRight, CheckCircle, Briefcase, MapPin, DollarSign } from "lucide-react";

export function JobDescriptionGenerator() {
  const router = useRouter();
  const [result, setResult] = useState<GeneratedJobDescription | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GenerateJobDescriptionInput>({
    resolver: zodResolver(generateJobDescriptionSchema),
  });

  async function onSubmit(data: GenerateJobDescriptionInput) {
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai/generate-job-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate description");
      }

      const json = await res.json();
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function useDescription() {
    if (!result) return;
    sessionStorage.setItem("ai-job-data", JSON.stringify(result));
    router.push("/dashboard/jobs/create");
  }

  function formatSalary(min: number | null, max: number | null, currency: string): string {
    if (!min && !max) return "";
    const sym = currency === "USD" ? "$" : currency === "EUR" ? "\u20AC" : currency === "GBP" ? "\u00A3" : "";
    if (min && max) return `${sym}${(min / 1000).toFixed(0)}k \u2013 ${sym}${(max / 1000).toFixed(0)}k`;
    if (min) return `From ${sym}${(min / 1000).toFixed(0)}k`;
    if (max) return `Up to ${sym}${(max / 1000).toFixed(0)}k`;
    return "";
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium">Role Title</label>
          <input
            id="role" {...register("role")}
            className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Senior Frontend Engineer"
          />
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="experience" className="text-sm font-medium">Experience Level</label>
          <input
            id="experience" {...register("experience")}
            className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="5+ years"
          />
          {errors.experience && <p className="text-xs text-destructive">{errors.experience.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="skills" className="text-sm font-medium">Required Skills</label>
          <textarea
            id="skills" {...register("skills")}
            rows={3}
            className="flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            placeholder="React, TypeScript, Node.js, PostgreSQL..."
          />
          {errors.skills && <p className="text-xs text-destructive">{errors.skills.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Generate Description</>
          )}
        </Button>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}
      </form>

      {result && (
        <Card className="overflow-hidden">
          <div className="p-6 border-b bg-muted/20 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Generated Job Posting</h2>
            </div>
            <Button onClick={useDescription} size="sm">
              Use & Fill Form
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-bold">{result.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {result.company}
                  <span className="mx-1">&middot;</span>
                  <MapPin className="h-3.5 w-3.5" />
                  {result.location}
                  <span className="mx-1">&middot;</span>
                  {result.locationType === "REMOTE" ? "Remote" : result.locationType === "HYBRID" ? "Hybrid" : "On-site"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.experienceLevel && <Badge variant="secondary">{result.experienceLevel}</Badge>}
                {result.employmentType && <Badge variant="secondary">{result.employmentType.replace("_", " ")}</Badge>}
                {result.companySize && <Badge variant="outline">{result.companySize} employees</Badge>}
              </div>
            </div>

            {result.salaryMin || result.salaryMax ? (
              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                <DollarSign className="h-4 w-4" />
                {formatSalary(result.salaryMin, result.salaryMax, result.currency)}
              </div>
            ) : null}

            {result.techSkills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.techSkills.map((s) => <Badge key={s}>{s}</Badge>)}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{result.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">About the Company</h4>
              <p className="text-sm text-muted-foreground">{result.aboutCompany}</p>
            </div>

            {result.benefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Benefits</h4>
                <ul className="space-y-1.5">
                  {result.benefits.map((b) => (
                    <li key={b} className="text-sm text-muted-foreground flex gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.interviewProcess && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Interview Process</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{result.interviewProcess}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
