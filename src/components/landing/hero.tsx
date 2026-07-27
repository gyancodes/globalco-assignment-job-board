import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle,
  Users,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-24 md:pt-36 pb-20 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <Badge variant="secondary" className="mb-6 px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1.5" />
              AI-Powered Hiring Platform
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 leading-[1.1]">
            Hire Smarter, <span className="text-primary">Faster</span>
            <br />
            with AI
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 leading-relaxed">
            AI-powered resume reviews, smart job matching, and intelligent
            hiring tools. Built for modern teams and ambitious candidates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button
              size="lg"
              asChild
              className="shadow-lg shadow-primary/25 h-11 px-8"
            >
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-11 px-8">
              <Link href="/jobs">
                <Briefcase className="mr-1.5 h-4 w-4" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 md:mt-28 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-x-4 -inset-y-6 bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent rounded-3xl" />
            <Card className="relative shadow-xl border-border/80 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">
                  dashboard.hireai.io
                </span>
              </div>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 divide-x divide-border">
                  <div className="p-5 space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Recent Jobs
                    </h3>
                    {[
                      {
                        title: "Senior Frontend Engineer",
                        company: "Stripe",
                        time: "2h ago",
                      },
                      {
                        title: "Product Designer",
                        company: "Linear",
                        time: "5h ago",
                      },
                      {
                        title: "ML Engineer",
                        company: "OpenAI",
                        time: "1d ago",
                      },
                    ].map((job) => (
                      <div key={job.title} className="group cursor-pointer">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {job.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{job.company}</span>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      AI Resume Score
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground">
                            Match Score
                          </span>
                          <span className="font-semibold">92%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full w-[92%] rounded-full bg-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="text-muted-foreground">
                            ATS Score
                          </span>
                          <span className="font-semibold">78%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full w-[78%] rounded-full bg-chart-2" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {["TypeScript", "GraphQL", "Docker"].map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-full bg-chart-5/10 text-[rgb(var(--chart-5))] px-2 py-0.5 text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: "Active Jobs", value: "142", icon: Briefcase },
                        {
                          label: "Total Candidates",
                          value: "2,847",
                          icon: Users,
                        },
                        {
                          label: "AI Reviews Today",
                          value: "89",
                          icon: Sparkles,
                        },
                      ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                          <div
                            key={stat.label}
                            className="flex items-center gap-3"
                          >
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">
                                {stat.value}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {stat.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
