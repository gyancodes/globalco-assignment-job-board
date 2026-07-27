import { getPrisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { ApplyButton } from "@/features/jobs/components/apply-button";
import { JobMatchScore } from "@/features/jobs/components/job-match-score";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, MapPin, DollarSign,
  Building2, Globe, GraduationCap, Heart,
  Lightbulb
} from "lucide-react";

type Params = Promise<{ id: string }>;

const locationTypeLabels: Record<string, string> = {
  REMOTE: "Remote", HYBRID: "Hybrid", ON_SITE: "On-site",
};

const locationTypeStyles: Record<string, string> = {
  REMOTE: "bg-chart-2/10 text-[rgb(var(--chart-2))] border-chart-2/20",
  HYBRID: "bg-chart-1/10 text-[rgb(var(--chart-1))] border-chart-1/20",
  ON_SITE: "bg-chart-4/10 text-[rgb(var(--chart-4))] border-chart-4/20",
};

const expLevelLabels: Record<string, string> = {
  ENTRY: "Entry", MID: "Mid", SENIOR: "Senior", LEAD: "Lead", EXECUTIVE: "Executive",
};

const empTypeLabels: Record<string, string> = {
  FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract",
  INTERNSHIP: "Internship", FREELANCE: "Freelance",
};

function fmtSalary(min: number | null, max: number | null, currency: string): string | null {
  if (!min && !max) return null;
  const s = (n: number) => n >= 1000 ? `${currency === "USD" ? "$" : ""}${(n / 1000).toFixed(0)}k` : `${n.toLocaleString()}`;
  if (min && max) return `${s(min)} \u2013 ${s(max)}`;
  if (min) return `From ${s(min)}`;
  return `Up to ${s(max!)}`;
}

export default async function JobDetailPage(props: { params: Params }) {
  const { id } = await props.params;

  const job = await getPrisma().job.findUnique({
    where: { id },
    include: {
      recruiter: { select: { id: true, fullName: true, email: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!job) notFound();

  const user = await currentUser();
  let hasApplied = false;
  if (user?.role === "CANDIDATE") {
    const app = await getPrisma().application.findUnique({
      where: { candidateId_jobId: { candidateId: user.id, jobId: job.id } },
    });
    hasApplied = !!app;
  }

  const salary = fmtSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6">
      <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
                    <Badge variant="outline" className={locationTypeStyles[job.locationType]}>
                      {locationTypeLabels[job.locationType]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{empTypeLabels[job.employmentType]}</Badge>
                {salary && <Badge variant="outline" className="bg-chart-2/10 text-[rgb(var(--chart-2))] border-chart-2/20"><DollarSign className="h-3 w-3 mr-0.5" />{salary}</Badge>}
                <Badge variant="outline"><GraduationCap className="h-3 w-3 mr-0.5" />{expLevelLabels[job.experienceLevel]}</Badge>
                {job.visaSponsorship && <Badge variant="outline" className="bg-chart-1/10 text-[rgb(var(--chart-1))] border-chart-1/20"><Globe className="h-3 w-3 mr-0.5" />Visa sponsorship</Badge>}
              </div>

              {job.techSkills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Tech Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {job.techSkills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
                  </div>
                </div>
              )}

              <div className="border-t pt-5 space-y-4">
                <div>
                  <h2 className="font-semibold mb-2">About the Role</h2>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.description}</p>
                </div>

                {job.aboutCompany && (
                  <div>
                    <h2 className="font-semibold mb-2">About the Company</h2>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.aboutCompany}</p>
                  </div>
                )}

                {job.benefits && (
                  <div>
                    <h2 className="font-semibold mb-2 flex items-center gap-1.5"><Heart className="h-4 w-4 text-[rgb(var(--chart-5))]" /> Benefits</h2>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.benefits}</p>
                  </div>
                )}

                {job.interviewProcess && (
                  <div>
                    <h2 className="font-semibold mb-2 flex items-center gap-1.5"><Lightbulb className="h-4 w-4 text-[rgb(var(--chart-3))]" /> Interview Process</h2>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.interviewProcess}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Posted</span>
                  <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Applicants</span>
                  <span className="font-medium">{job._count.applications}</span>
                </div>
                {job.companySize && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Company size</span>
                    <span className="font-medium">{job.companySize}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Employment</span>
                  <span className="font-medium">{empTypeLabels[job.employmentType]}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{expLevelLabels[job.experienceLevel]}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                {user?.role === "CANDIDATE" && <ApplyButton jobId={job.id} hasApplied={hasApplied} />}
                {!user && <Button className="w-full" asChild><Link href="/sign-in">Sign in to apply</Link></Button>}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Posted by <span className="font-medium text-foreground">{job.recruiter.fullName}</span>
              </p>
            </CardContent>
          </Card>

          {user?.role === "CANDIDATE" && <JobMatchScore jobId={job.id} />}
        </div>
      </div>
    </div>
  );
}
