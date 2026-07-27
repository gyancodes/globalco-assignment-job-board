"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Briefcase, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/sign-in", label: "Sign In" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex h-14 items-center justify-between px-5 rounded-2xl border border-border/50 bg-background/70 backdrop-blur-xl shadow-lg shadow-black/[0.03]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Briefcase className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tight">HireAI</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-border mx-2" />
            <ThemeToggle />
            <Button asChild className="ml-2 h-8">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>

          <div className="sm:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-border/50 bg-background/70 backdrop-blur-xl shadow-lg p-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-1">
              <Button className="w-full h-9" asChild>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
