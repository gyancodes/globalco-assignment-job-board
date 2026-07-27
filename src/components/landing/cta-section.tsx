import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3 } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Badge variant="secondary" className="mb-4">
          Get Started Today
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
          Ready to Transform <span className="text-primary">Your Hiring?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of companies and candidates using HireAI to make hiring
          smarter, faster, and more efficient.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            asChild
            className="shadow-lg shadow-primary/25 h-11 px-8"
          >
            <Link href="/sign-up">
              Get Started Free
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-11 px-8">
            <Link href="/jobs">
              <BarChart3 className="mr-1.5 h-4 w-4" />
              Explore Jobs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
