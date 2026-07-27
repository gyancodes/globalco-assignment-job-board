"use client";

import { useState, useRef, useCallback } from "react";
import type { ResumeReviewResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Target,
  Sparkles,
  FileUp,
  TrendingUp,
  Zap,
  Briefcase,
  ArrowRight,
  Star,
  X,
} from "lucide-react";

type ReviewTab = "overview" | "skills" | "improve" | "suggestions";

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function ResumeReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeReviewResult | null>(null);
  const [activeTab, setActiveTab] = useState<ReviewTab>("overview");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "text/plain" || droppedFile.type === "application/pdf")) {
      setFile(droppedFile);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  }, []);

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
      setActiveTab("overview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function resetReview() {
    setFile(null);
    setResult(null);
    setError(null);
    setActiveTab("overview");
  }

  const tabs: { id: ReviewTab; label: string; icon: typeof Star }[] = [
    { id: "overview", label: "Overview", icon: Star },
    { id: "skills", label: "Skills", icon: Briefcase },
    { id: "improve", label: "Improve", icon: TrendingUp },
    { id: "suggestions", label: "Suggestions", icon: Zap },
  ];

  const ScoreMeter = ({ value, label, icon: Icon, color }: { value: number; label: string; icon: typeof Target; color: string }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${getScoreBg(value)} transition-all duration-1000`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className={`text-2xl font-bold tabular-nums ${getScoreColor(value)}`}>{value}/100</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
              dragOver
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="space-y-3 cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {dragOver ? "Drop your file here" : "Drag & drop your resume"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    TXT or PDF up to 10MB
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!file || loading}
            className="w-full h-11"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Review with AI</>
            )}
          </Button>

          {loading && (
            <Card className="py-10">
              <CardContent className="flex flex-col items-center text-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-base font-medium">Analyzing your resume with AI...</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{file?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {result.score >= 80 ? "Great resume!" : result.score >= 60 ? "Room for improvement" : "Needs significant work"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={resetReview}>
              <Upload className="h-4 w-4" />
              New Review
            </Button>
          </div>

          <div className="flex gap-1 p-1 rounded-lg bg-muted">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <ScoreMeter value={result.score} label="Resume Score" icon={Target} color="text-primary" />
                <ScoreMeter value={result.atsScore} label="ATS Compatibility" icon={FileText} color="text-emerald-500" />
                <ScoreMeter value={result.impactScore ?? 0} label="Impact & Metrics" icon={TrendingUp} color="text-violet-500" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-primary" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                </CardContent>
              </Card>

              {result.roleSuggestions && result.roleSuggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Best-Fit Roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.roleSuggestions.map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs py-1">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.quickWins && result.quickWins.length > 0 && (
                <Card className="border-amber-200 bg-amber-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700 text-base">
                      <Zap className="h-4 w-4" />
                      Quick Wins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.quickWins.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex gap-2">
                          <ArrowRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Technical Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {result.technicalSkills.length > 0 ? (
                        result.technicalSkills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No technical skills detected</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Soft Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {result.softSkills.length > 0 ? (
                        result.softSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{skill}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No soft skills detected</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {result.missingSkills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
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
              )}

              {result.keywordDensity && result.keywordDensity.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Keywords to Add for ATS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywordDensity.map((kw) => (
                        <Badge key={kw} variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">{kw}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "improve" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-emerald-200 bg-emerald-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {result.strengths.map((item) => (
                          <li key={item} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-emerald-500 shrink-0 mt-1">&bull;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No strengths detected</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive text-sm font-medium">
                      <AlertCircle className="h-4 w-4" />
                      Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.weaknesses.length > 0 ? (
                      <ul className="space-y-2">
                        {result.weaknesses.map((item) => (
                          <li key={item} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-destructive shrink-0 mt-1">&bull;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No weaknesses detected</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "suggestions" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {result.grammarSuggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Grammar & Phrasing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.grammarSuggestions.map((item) => (
                          <li key={item} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-muted-foreground shrink-0 mt-1">&bull;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {result.formattingSuggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Formatting & Layout</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.formattingSuggestions.map((item) => (
                          <li key={item} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-muted-foreground shrink-0 mt-1">&bull;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {result.recommendations.length > 0 && (
                <Card className="bg-primary/5 border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary shrink-0 mt-1">&bull;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
