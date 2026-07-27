import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Active Jobs",
    value: "24",
    change: "+12%",
    icon: Briefcase,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    label: "Total Applicants",
    value: "847",
    change: "+18%",
    icon: Users,
    color:
      "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  },
  {
    label: "Interview Rate",
    value: "32%",
    change: "+5%",
    icon: TrendingUp,
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    label: "AI Descriptions",
    value: "156",
    change: "+45%",
    icon: Sparkles,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
];

const recentApplications = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    score: 94,
    status: "Reviewing" as const,
    time: "2h ago",
  },
  {
    name: "Michael Torres",
    role: "Product Designer",
    score: 88,
    status: "Shortlisted" as const,
    time: "4h ago",
  },
  {
    name: "Emily Watson",
    role: "Backend Engineer",
    score: 82,
    status: "New" as const,
    time: "6h ago",
  },
  {
    name: "David Kim",
    role: "ML Engineer",
    score: 91,
    status: "Interview" as const,
    time: "1d ago",
  },
];

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Reviewing: "default",
  Shortlisted: "secondary",
  New: "outline",
  Interview: "default",
};

export function RecruiterDashboard() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Recruiter Dashboard
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Your Hiring Command Center
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Get a bird&apos;s-eye view of your recruitment pipeline with
            real-time analytics and AI-powered insights.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="shadow-sm border-border/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-2xl font-bold">
                    {stat.value}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-sm border-border/60 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Recent Applications
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/applicants">
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentApplications.map((app) => (
              <div
                key={app.name}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {app.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{app.name}</p>
                    <p className="text-xs text-muted-foreground">{app.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {app.score}%
                    </p>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                  <Badge
                    variant={statusVariant[app.status]}
                    className="capitalize"
                  >
                    {app.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {app.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              Explore Full Dashboard
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
