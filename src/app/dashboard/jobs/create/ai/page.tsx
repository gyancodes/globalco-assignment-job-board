import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobDescriptionGenerator } from "@/features/jobs/components/job-description-generator";

export default async function GenerateJobDescriptionPage() {
  const user = await currentUser();

  if (!user || user.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">AI Job Description Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">Let AI craft a complete, professional job posting from just a few inputs.</p>
      </div>
      <JobDescriptionGenerator />
    </div>
  );
}
