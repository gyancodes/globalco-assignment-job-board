import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobDescriptionGenerator } from "@/features/jobs/components/job-description-generator";

export default async function GenerateJobDescriptionPage() {
  const user = await currentUser();

  if (!user || user.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">AI Job Description Generator</h1>
      <JobDescriptionGenerator />
    </div>
  );
}
