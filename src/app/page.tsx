"use client";

import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AiShowcase } from "@/components/landing/ai-showcase";
import { RecruiterDashboard } from "@/components/landing/recruiter-dashboard";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <AiShowcase />
        <RecruiterDashboard />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
