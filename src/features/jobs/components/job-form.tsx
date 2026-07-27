"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobSchema, type CreateJobInput } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, Briefcase, MapPin, Building2, DollarSign, Globe, GraduationCap, Clock, Heart, FileText, Users, Lightbulb } from "lucide-react";

const locationTypes = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ON_SITE", label: "On-site" },
];

const experienceLevels = [
  { value: "ENTRY", label: "Entry" },
  { value: "MID", label: "Mid" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
  { value: "EXECUTIVE", label: "Executive" },
];

const employmentTypes = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
];

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];

type JobFormProps = {
  defaultValues?: Partial<CreateJobInput>;
  jobId?: string;
};

export function JobForm({ defaultValues, jobId }: JobFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(defaultValues?.techSkills ?? []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema) as any,
    defaultValues: { ...defaultValues, techSkills: skills } as any,
  });

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      const next = [...skills, s];
      setSkills(next);
      setValue("techSkills", next);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    const next = skills.filter((s) => s !== skill);
    setSkills(next);
    setValue("techSkills", next);
  }

  async function onSubmit(data: CreateJobInput) {
    setError(null);
    try {
      const url = jobId ? `/api/jobs/${jobId}` : "/api/jobs";
      const method = jobId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, techSkills: skills }),
      });
      if (!res.ok) {
        const err = await res.json();
        const msg = err.details
          ? err.details.map((d: { path: string; message: string }) => `${d.path}: ${d.message}`).join("; ")
          : err.error || "Something went wrong";
        throw new Error(msg);
      }
      router.push("/dashboard/jobs");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-8">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>Job title, company details, and location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Job Title</label>
                <input
                  id="title" {...register("title")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. Senior Frontend Engineer"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">Company</label>
                <input
                  id="company" {...register("company")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. Acme Inc."
                />
                {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <input
                  id="location" {...register("location")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. San Francisco, CA"
                />
                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location Type</label>
                <select
                  {...register("locationType")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {locationTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="companySize" className="text-sm font-medium">Company Size</label>
                <select
                  id="companySize" {...register("companySize")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-primary" />
              Compensation & Details
            </CardTitle>
            <CardDescription>Salary range, employment type, and experience level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-4 gap-5">
              <div className="space-y-2">
                <label htmlFor="salaryMin" className="text-sm font-medium">Salary Min</label>
                <input
                  id="salaryMin" type="number" {...register("salaryMin")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="80000"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="salaryMax" className="text-sm font-medium">Salary Max</label>
                <input
                  id="salaryMax" type="number" {...register("salaryMax")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="150000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <select
                  {...register("currency")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Employment Type</label>
                <select
                  {...register("employmentType")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {employmentTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level</label>
                <select
                  {...register("experienceLevel")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {experienceLevels.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Visa Sponsorship</label>
                <div className="flex h-10 items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" value="true" {...register("visaSponsorship")} className="accent-primary" />
                    Available
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" value="false" {...register("visaSponsorship")} className="accent-primary" />
                    Not available
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Skills</label>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  className="flex h-10 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Type a skill and press Enter"
                />
                <Button type="button" variant="outline" onClick={addSkill} className="shrink-0">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="ml-0.5 hover:text-foreground transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              Job Description
            </CardTitle>
            <CardDescription>Detailed description of the role, responsibilities, and requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description" {...register("description")}
                rows={10}
                className="flex min-h-[200px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity unique..."
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="aboutCompany" className="text-sm font-medium">About the Company</label>
              <textarea
                id="aboutCompany" {...register("aboutCompany")}
                rows={4}
                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                placeholder="Tell candidates about your company mission, culture, and what makes it a great place to work..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="benefits" className="text-sm font-medium">Benefits</label>
              <textarea
                id="benefits" {...register("benefits")}
                rows={3}
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                placeholder="Health insurance, equity, remote stipend, 401k matching, unlimited PTO..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="interviewProcess" className="text-sm font-medium">Interview Process</label>
              <textarea
                id="interviewProcess" {...register("interviewProcess")}
                rows={3}
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                placeholder="1. Phone screen (30 min)&#10;2. Technical interview (60 min)&#10;3. System design (60 min)&#10;4. On-site / Final round"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : jobId ? "Update Job" : "Publish Job"}
          </Button>
        </div>
      </div>
    </form>
  );
}
