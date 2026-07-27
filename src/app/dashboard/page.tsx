import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Briefcase, Users, ArrowRight, Clock, TrendingUp, FileText, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  if (user.role === "RECRUITER") {
    const jobCount = await getPrisma().job.count({ where: { recruiterId: user.id } });
    const applicationCount = await getPrisma().application.count({
      where: { job: { recruiterId: user.id } },
    });

    const recentJobs = await getPrisma().job.findMany({
      where: { recruiterId: user.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return (
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back{user.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}</h1>
            <p className="text-sm text-muted-foreground mt-1">Here is what is happening with your job postings today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
              <div className="w-9 h-9 rounded-xl bg-chart-1/10 text-[rgb(var(--chart-1))] flex items-center justify-center">
                <Briefcase className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tabular-nums">{jobCount}</p>
                <span className="text-xs text-muted-foreground">total posted</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-chart-1 transition-all" style={{ width: `${Math.min(jobCount * 20, 100)}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applicants</CardTitle>
              <div className="w-9 h-9 rounded-xl bg-chart-2/10 text-[rgb(var(--chart-2))] flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tabular-nums">{applicationCount}</p>
                <span className="text-xs text-muted-foreground">across all jobs</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-chart-2 transition-all" style={{ width: `${Math.min(applicationCount * 10, 100)}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. per Job</CardTitle>
              <div className="w-9 h-9 rounded-xl bg-chart-4/10 text-[rgb(var(--chart-4))] flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tabular-nums">
                  {jobCount > 0 ? (applicationCount / jobCount).toFixed(1) : "0"}
                </p>
                <span className="text-xs text-muted-foreground">applicants per job</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-chart-4 transition-all" style={{ width: `${Math.min((jobCount > 0 ? (applicationCount / jobCount) * 20 : 0), 100)}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Recent Job Postings</CardTitle>
              <Link href="/dashboard/jobs" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentJobs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Briefcase className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm font-medium">No jobs posted yet</p>
                  <p className="text-xs mt-1">Create your first posting to get started.</p>
                </div>
              ) : (
                <div className="-mx-6">
                  {recentJobs.map((job) => (
                    <Link key={job.id} href={`/dashboard/jobs/${job.id}/edit`}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/40 transition-colors border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company} &middot; {job._count.applications} applicant{job._count.applications !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                        <span>{new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/jobs/create"
                className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-accent/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-chart-1/10 text-[rgb(var(--chart-1))] flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Post a New Job</p>
                  <p className="text-xs text-muted-foreground">Create a job listing and attract candidates</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Link>
              <Link href="/dashboard/jobs/create/ai"
                className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-accent/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-chart-3/10 text-[rgb(var(--chart-3))] flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Generate with AI</p>
                  <p className="text-xs text-muted-foreground">Use AI to write a professional job description</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Link>
              <Link href="/dashboard/applicants"
                className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-accent/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-chart-4/10 text-[rgb(var(--chart-4))] flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Review Applicants</p>
                  <p className="text-xs text-muted-foreground">View and manage incoming applications</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const applicationCount = await getPrisma().application.count({
    where: { candidateId: user.id },
  });

  const recentApps = await getPrisma().application.findMany({
    where: { candidateId: user.id },
    include: { job: { select: { id: true, title: true, company: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const statusStyles: Record<string, string> = {
    PENDING: "bg-chart-3/10 text-[rgb(var(--chart-3))] border-chart-3/20",
    REVIEWING: "bg-chart-1/10 text-[rgb(var(--chart-1))] border-chart-1/20",
    ACCEPTED: "bg-chart-2/10 text-[rgb(var(--chart-2))] border-chart-2/20",
    REJECTED: "bg-chart-5/10 text-[rgb(var(--chart-5))] border-chart-5/20",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back{user.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your job applications and opportunities.</p>
      </div>

      <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
          <div className="w-9 h-9 rounded-xl bg-chart-1/10 text-[rgb(var(--chart-1))] flex items-center justify-center">
            <FileText className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tabular-nums">{applicationCount}</p>
            <span className="text-xs text-muted-foreground">total submitted</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-chart-1 transition-all" style={{ width: `${Math.min(applicationCount * 20, 100)}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentApps.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm font-medium">No applications yet</p>
              <p className="text-xs mt-1">Browse jobs and submit your first application.</p>
            </div>
          ) : (
            <div className="-mx-6">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between px-6 py-3.5 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{app.job.title}</p>
                      <p className="text-xs text-muted-foreground">{app.job.company}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[11px] px-2 py-0 ${statusStyles[app.status] ?? ""}`}>
                    {app.status.toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
