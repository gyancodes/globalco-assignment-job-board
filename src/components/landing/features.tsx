import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Brain, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Job Search",
    description:
      "Find the perfect role with intelligent search and filtering across thousands of opportunities from leading companies.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    icon: Brain,
    title: "AI Resume Review",
    description:
      "Instant AI-powered feedback on your resume with scoring, ATS compatibility analysis, and actionable suggestions.",
    color:
      "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
  },
  {
    icon: Zap,
    title: "AI Job Descriptions",
    description:
      "Generate professional, inclusive job descriptions in seconds. Just enter the role details and let AI do the rest.",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    icon: Users,
    title: "Streamlined Hiring",
    description:
      "Manage your entire hiring pipeline from application to offer. Track applicants, review resumes, and make data-driven decisions.",
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to Hire or Get Hired
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Powerful AI-driven tools for both candidates and recruiters,
            designed to make hiring effortless.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border-border/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <CardHeader>
                  <div
                    className={`w-11 h-11 rounded-xl ${feature.color} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
