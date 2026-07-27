import { getPrisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MapPin, Clock, Users, Briefcase, FileText, Trash2, ExternalLink } from "lucide-react";

const locationTypeStyles: Record<string, string> = {
  REMOTE: "bg-chart-2/10 text-[rgb(var(--chart-2))] border-chart-2/20",
  HYBRID: "bg-chart-1/10 text-[rgb(var(--chart-1))] border-chart-1/20",
  ON_SITE: "bg-chart-4/10 text-[rgb(var(--chart-4))] border-chart-4/20",
};

const locationTypeLabels: Record<string, string> = {
  REMOTE: "Remote", HYBRID: "Hybrid", ON_SITE: "On-site",
};

const experienceStyles: Record<string, string> = {
  ENTRY: "bg-muted text-muted-foreground", MID: "bg-muted text-muted-foreground",
  SENIOR: "bg-muted text-muted-foreground", LEAD: "bg-muted text-muted-foreground",
  EXECUTIVE: "bg-muted text-muted-foreground",
};

async function deleteJob(formData: FormData) {
  "use server";
  const user = await currentUser();
  if (!user || user.role !== "RECRUITER") throw new Error("Unauthorized");
  const jobId = formData.get("jobId") as string;
  const job = await getPrisma().job.findUnique({ where: { id: jobId } });
  if (!job || job.recruiterId !== user.id) throw new Error("Forbidden");
  await getPrisma().job.delete({ where: { id: jobId } });
  revalidatePath("/dashboard/jobs");
}

export default async function RecruiterJobsPage() {
  const user = await currentUser();
  if (!user || user.role !== "RECRUITER") redirect("/dashboard");

  const jobs = await getPrisma().job.findMany({
    where: { recruiterId: user.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">{jobs.length} job{jobs.length !== 1 ? "s" : ""} posted</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/jobs/create">
            <PlusCircle className="h-4 w-4" />
            Create Job
          </Link>
        </Button>
      </div>

      {jobs.length === 0 && (
        <Card className="border shadow-sm">
          <CardContent className="py-20 text-center text-muted-foreground">
            <div className="w-12 h-12 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-medium">No jobs yet</p>
            <p className="text-sm mt-1.5 mb-6 text-muted-foreground/80">Create your first job posting to attract top talent.</p>
            <Button asChild>
              <Link href="/dashboard/jobs/create">Create Your First Job</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {jobs.map((job) => {
          const salary = job.salaryMin || job.salaryMax
            ? `${job.currency === "USD" ? "$" : ""}${job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : ""}${job.salaryMin && job.salaryMax ? "\u2013" : ""}${job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : ""}`
            : null;

          return (
            <Card key={job.id} className="border shadow-sm hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-[15px]">{job.title}</h2>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${locationTypeStyles[job.locationType]}`}>
                        {locationTypeLabels[job.locationType]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium text-foreground/80">{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      {job.experienceLevel && (
                        <span className={`px-1.5 py-0.5 rounded ${experienceStyles[job.experienceLevel]}`}>
                          {job.experienceLevel.charAt(0) + job.experienceLevel.slice(1).toLowerCase()}
                        </span>
                      )}
                      {salary && <span className="font-medium text-foreground/70">{salary}</span>}
                    </div>
                    {job.techSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.techSkills.slice(0, 4).map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{s}</span>
                        ))}
                        {job.techSkills.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">+{job.techSkills.length - 4}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{job._count.applications} applicant{job._count.applications !== 1 ? "s" : ""}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" asChild className="h-8">
                      <Link href={`/dashboard/jobs/${job.id}/edit`}>
                        <ExternalLink className="h-3.5 w-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                    </Button>
                    <form action={deleteJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <Button type="submit" variant="outline" size="sm" className="h-8 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
