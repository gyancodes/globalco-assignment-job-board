"use client";

import { useState } from "react";
import type { ResumeReviewResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileText, CheckCircle, AlertCircle, Lightbulb, Target, Sparkles } from "lucide-react";

export function ResumeReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeReviewResult | null>(null);

  async function extractTextFromFile(file: File): Promise<string> {
    if (file.type === "text/plain") {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }

    if (file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/ai/extract-text", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to extract text from PDF");
      }
      const { text } = await res.json();
      return text;
    }

    throw new Error("Unsupported file type. Please upload a .txt or .pdf file.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resumeText = await extractTextFromFile(file);

      const res = await fetch("/api/ai/resume-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, resumeUrl: file.name }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyze resume");
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Resume (TXT or PDF)</label>
          <div className="relative">
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground file:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <Button type="submit" disabled={!file || loading}>
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
          ) : (
            <><Upload className="h-4 w-4" /> Review Resume</>
          )}
        </Button>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}
      </form>

      {loading && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Analyzing your resume with AI...</p>
            <p className="text-sm mt-1">This may take a few seconds</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Resume Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-1000"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold tabular-nums">{result.score}/100</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-500" />
                  ATS Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${result.atsScore}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold tabular-nums">{result.atsScore}/100</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {result.technicalSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Soft Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {result.softSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-200 bg-emerald-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {result.strengths.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-emerald-500 shrink-0 mt-0.5">&bull;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {result.weaknesses.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-destructive shrink-0 mt-0.5">&bull;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Missing Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {result.missingSkills.map((skill) => (
                  <Badge key={skill} variant="destructive">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Grammar Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {result.grammarSuggestions.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-muted-foreground shrink-0">&bull;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Formatting Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {result.formattingSuggestions.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-muted-foreground shrink-0">&bull;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {result.recommendations.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary shrink-0 mt-0.5">&bull;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
