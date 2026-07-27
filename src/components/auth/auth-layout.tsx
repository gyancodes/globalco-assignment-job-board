import Link from "next/link";
import { Briefcase, Sparkles, Users, CheckCircle, ArrowRight } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="lg:hidden mb-6">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">HireAI</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative order-1 lg:order-2 min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-4/5 to-chart-2/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.06] via-transparent to-transparent" />

        <div className="relative flex flex-col w-full p-10 xl:p-14">
          <Link href="/" className="flex items-center gap-2.5 group mb-16">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">HireAI</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto">
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight mb-6 leading-tight">
              Intelligent hiring,<br />
              <span className="text-primary">powered by AI</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 text-base">
              Join thousands of professionals and companies using HireAI to transform the way they hire and get hired.
            </p>

            <div className="space-y-5">
              {[
                { icon: Sparkles, text: "AI-powered resume reviews and job matching" },
                { icon: CheckCircle, text: "Smart recommendations based on your profile" },
                { icon: Users, text: "Connect with top companies and talent" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-border/50">
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                Learn more about HireAI
              </Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} HireAI</p>
        </div>
      </div>
    </div>
  );
}
