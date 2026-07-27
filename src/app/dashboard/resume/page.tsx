import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ResumeReviewPage } from "@/features/resume/components/resume-review-page";

export default async function ResumePage() {
  const user = await currentUser();

  if (!user || user.role !== "CANDIDATE") {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">AI Resume Review</h1>
      <ResumeReviewPage />
    </div>
  );
}
