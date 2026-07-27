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
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Sparkles, ArrowRight, CheckCircle, Briefcase,
  MapPin, DollarSign, Building2, Users, Zap, Clock,
  ChevronRight, RotateCcw,
} from "lucide-react";

const locationTypeLabel: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
};

const expLevelColors: Record<string, string> = {
  ENTRY: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  MID: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  SENIOR: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  LEAD: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  EXECUTIVE: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return "";
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "";
  const fmt = (n: number) => `${sym}${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function JobDescriptionGenerator() {
  const router = useRouter();
  const [result, setResult] = useState<GeneratedJobDescription | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  function useDescription() {
    if (!result) return;
    sessionStorage.setItem("ai-job-data", JSON.stringify(result));
    router.push("/dashboard/jobs/create");
  }

  const salary = result ? formatSalary(result.salaryMin, result.salaryMax, result.currency) : "";

  return (
    <div className="space-y-8">
      {!result ? (
        /* ── Input form ────────────────────────────────────────────────── */
        <div className="max-w-2xl">
          {/* Prompt banner */}
          <div className="rounded-2xl border bg-gradient-to-br from-primary/8 via-background to-primary/3 p-5 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI-Powered Generator</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fill in a few details and get a complete, professional job posting in seconds.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Role */}
              <div className="space-y-1.5">
                <label htmlFor="role" className="text-sm font-medium flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  Role Title <span className="text-destructive ml-0.5">*</span>
                </label>
                <input
                  id="role"
                  {...register("role")}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/55"
                  placeholder="e.g. Senior Frontend Engineer"
                />
                {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <label htmlFor="experience" className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Experience Level <span className="text-destructive ml-0.5">*</span>
                </label>
                <input
                  id="experience"
                  {...register("experience")}
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/55"
                  placeholder="e.g. 5+ years"
                />
                {errors.experience && <p className="text-xs text-destructive">{errors.experience.message}</p>}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <label htmlFor="skills" className="text-sm font-medium flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                Required Skills <span className="text-destructive ml-0.5">*</span>
              </label>
              <textarea
                id="skills"
                {...register("skills")}
                rows={3}
                className="flex w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none placeholder:text-muted-foreground/55"
                placeholder="React, TypeScript, Node.js, PostgreSQL, AWS..."
              />
              {errors.skills && <p className="text-xs text-destructive">{errors.skills.message}</p>}
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/8 border border-destructive/20 p-3.5 text-sm text-destructive flex items-start gap-2">
                <span className="shrink-0">⚠</span>
                {error}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-xl text-sm font-medium">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating your job posting…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate with AI
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </>
              )}
            </Button>
          </form>

          {/* Loading shimmer */}
          {isSubmitting && (
            <div className="mt-6 rounded-2xl border bg-muted/20 p-6 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-2/5 rounded bg-muted" />
                  <div className="h-3 w-3/5 rounded bg-muted" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-11/12 rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                {[40, 56, 32, 48, 36].map((w, i) => (
                  <div key={i} className="h-6 rounded-full bg-muted" style={{ width: w }} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── Result ────────────────────────────────────────────────────── */
        <div className="space-y-5 max-w-3xl">
          {/* Action bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Job description generated successfully
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { setResult(null); reset(); }}>
                <RotateCcw className="h-3.5 w-3.5" />
                Regenerate
              </Button>
              <Button size="sm" className="rounded-xl" onClick={useDescription}>
                Use & Fill Form
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border overflow-hidden shadow-sm">
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b px-6 py-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{result.title}</h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {result.company}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border hidden sm:block" />
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {result.location}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border hidden sm:block" />
                    <span>{locationTypeLabel[result.locationType] ?? result.locationType}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.experienceLevel && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expLevelColors[result.experienceLevel] ?? "bg-muted text-muted-foreground"}`}>
                      {result.experienceLevel}
                    </span>
                  )}
                  {result.employmentType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {result.employmentType.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 mt-4">
                {salary && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    <DollarSign className="h-4 w-4" />
                    {salary}
                  </div>
                )}
                {result.companySize && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {result.companySize} employees
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Tech Stack */}
              {result.techSkills.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.techSkills.map((s) => (
                      <Badge key={s} className="rounded-lg px-2.5 py-0.5 text-xs">{s}</Badge>
                    ))}
                  </div>
                </section>
              )}

              <div className="h-px bg-border" />

              {/* Description */}
              <section>
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Job Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.description}</p>
              </section>

              {/* About Company */}
              {result.aboutCompany && (
                <>
                  <div className="h-px bg-border" />
                  <section>
                    <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">About the Company</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.aboutCompany}</p>
                  </section>
                </>
              )}

              {/* Benefits */}
              {result.benefits.length > 0 && (
                <>
                  <div className="h-px bg-border" />
                  <section>
                    <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Benefits & Perks</h3>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {result.benefits.map((b) => (
                        <div key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          {b}
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {/* Interview Process */}
              {result.interviewProcess && (
                <>
                  <div className="h-px bg-border" />
                  <section>
                    <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Interview Process</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{result.interviewProcess}</p>
                  </section>
                </>
              )}
            </div>

            {/* Footer CTA */}
            <div className="border-t bg-muted/20 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground">
                Happy with the result? Click below to publish it to your job board.
              </p>
              <Button onClick={useDescription} className="rounded-xl">
                Publish This Job
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
