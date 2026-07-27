"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import {
  LayoutDashboard, Briefcase, FileText, Search,
  Users, PlusCircle, Sparkles, BarChart3, User,
  Menu, X
} from "lucide-react";

const candidateLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/applications", label: "My Applications", icon: FileText },
  { href: "/dashboard/resume", label: "Resume Review", icon: Sparkles },
  { href: "/jobs", label: "Browse Jobs", icon: Search },
];

const recruiterLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/dashboard/jobs/create", label: "Create Job", icon: PlusCircle },
  {
    href: "/dashboard/jobs/create/ai",
    label: "AI Job Description",
    icon: Sparkles,
  },
  { href: "/dashboard/applicants", label: "Applicants", icon: Users },
];

export function DashboardNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = role === "RECRUITER" ? recruiterLinks : candidateLinks;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-11 h-11 rounded-xl bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <nav className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-60 border-r bg-background lg:bg-muted/30 p-3 space-y-1 shrink-0 flex flex-col transition-transform duration-300 lg:transform-none",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="px-3 pb-2 pt-1 flex items-center justify-between lg:justify-start">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Menu
          </p>
          <button onClick={() => setOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="pt-3 border-t border-border/50 px-3 hidden lg:block">
          <p className="text-[10px] text-muted-foreground">
            {role === "RECRUITER" ? "Recruiter Panel" : "Candidate Panel"}
          </p>
        </div>
      </nav>
    </>
  );
}
