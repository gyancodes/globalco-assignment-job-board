import { Badge } from "@/components/ui/badge";
import { FileText, Search, Target, Star } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Sign up as a candidate or recruiter in seconds. No credit card required.",
    icon: FileText,
  },
  {
    number: "02",
    title: "Browse or Post Jobs",
    description:
      "Candidates explore AI-matched opportunities. Recruiters create listings with AI assistance.",
    icon: Search,
  },
  {
    number: "03",
    title: "Apply & Review",
    description:
      "Submit applications with AI-optimized resumes. Recruiters review candidates with smart tools.",
    icon: Target,
  },
  {
    number: "04",
    title: "Get Hired or Hire",
    description:
      "Connect with top talent or land your dream role — faster than ever.",
    icon: Star,
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Four simple steps to transform your hiring process.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                    {step.number}
                  </div>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] right-auto w-[calc(100%-6rem)] h-px bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
