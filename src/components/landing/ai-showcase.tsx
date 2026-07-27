import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Brain,
  Star,
} from "lucide-react";
import Link from "next/link";

const technicalSkills = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS",
];
const softSkills = [
  "Leadership",
  "Communication",
  "Problem Solving",
  "Team Collaboration",
];
const missingSkills = ["GraphQL", "Docker", "Kubernetes"];

export function AiShowcase() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1.5" />
            AI-Powered Analysis
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Intelligent Resume Analysis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Upload your resume and get instant AI feedback. Our advanced model
            analyzes your profile against industry standards.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="shadow-sm border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Resume Score
                    </CardTitle>
                    <span className="text-2xl font-bold tabular-nums">92</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[92%] rounded-full bg-primary transition-all" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Strong match for target roles
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-500" />
                      ATS Score
                    </CardTitle>
                    <span className="text-2xl font-bold tabular-nums">78</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[78%] rounded-full bg-emerald-500 transition-all" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Room for ATS optimization
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Resume Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Experienced full-stack engineer with 5+ years building
                  scalable web applications. Strong proficiency in React,
                  TypeScript, and Node.js. Proven track record of leading
                  cross-functional teams and delivering high-impact features.
                  Currently seeking senior-level roles in product-driven
                  organizations.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground ml-1">
                    4.0 / 5.0
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {technicalSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Soft Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {softSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-red-200/60 dark:border-red-900/60">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Missing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((skill) => (
                    <Badge key={skill} variant="destructive">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/60 bg-primary/[0.02]">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Add quantifiable achievements to your experience section",
                  "Include a professional summary at the top",
                  "Optimize keywords for ATS compatibility",
                ].map((suggestion) => (
                  <div
                    key={suggestion}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link href="/dashboard/resume">
              Try AI Resume Review
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
