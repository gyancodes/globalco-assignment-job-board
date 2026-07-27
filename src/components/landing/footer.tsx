import Link from "next/link";
import { Briefcase } from "lucide-react";

const footerLinks = [
  {
    title: "For Candidates",
    links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Create Account", href: "/sign-up" },
      { label: "Resume Review", href: "/dashboard/resume" },
    ],
  },
  {
    title: "For Recruiters",
    links: [
      { label: "Post a Job", href: "/sign-up" },
      { label: "AI Tools", href: "/sign-up" },
      { label: "Applicant Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Briefcase className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
              <span className="font-bold">HireAI</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered hiring platform connecting top candidates with forward-thinking companies.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HireAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
