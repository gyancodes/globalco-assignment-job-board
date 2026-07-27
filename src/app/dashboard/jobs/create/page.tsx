"use client";

import { useState } from "react";
import { JobForm } from "@/features/jobs/components/job-form";
import type { GeneratedJobDescription } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getInitialAiData(): GeneratedJobDescription | null {
  try {
    const stored = sessionStorage.getItem("ai-job-data");
    if (stored) {
      const parsed = JSON.parse(stored) as GeneratedJobDescription;
      sessionStorage.removeItem("ai-job-data");
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export default function CreateJobPage() {
  const [aiData] = useState<GeneratedJobDescription | null>(getInitialAiData);

  const defaultValues = aiData
    ? {
        title: aiData.title,
        company: aiData.company,
        location: aiData.location,
        locationType: aiData.locationType as "REMOTE" | "HYBRID" | "ON_SITE",
        salaryMin: aiData.salaryMin,
        salaryMax: aiData.salaryMax,
        currency: aiData.currency,
        techSkills: aiData.techSkills,
        visaSponsorship: aiData.visaSponsorship,
        experienceLevel: aiData.experienceLevel as "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE",
        employmentType: aiData.employmentType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE",
        companySize: aiData.companySize,
        aboutCompany: aiData.aboutCompany,
        description: aiData.description,
        benefits: aiData.benefits?.join("\n"),
        interviewProcess: aiData.interviewProcess,
      }
    : undefined;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        {aiData && (
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/jobs/create/ai">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {aiData ? "Review AI-Generated Job" : "Create Job"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {aiData
              ? "Review and edit the AI-generated job posting before publishing"
              : "Fill in the details for your new job posting"}
          </p>
        </div>
      </div>
      <JobForm defaultValues={defaultValues} />
    </div>
  );
}
