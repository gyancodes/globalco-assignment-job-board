import { getPrisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobForm } from "@/features/jobs/components/job-form";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function EditJobPage(props: { params: Params }) {
  const user = await currentUser();
  if (!user || user.role !== "RECRUITER") redirect("/dashboard");

  const { id } = await props.params;
  const job = await getPrisma().job.findUnique({ where: { id } });
  if (!job || job.recruiterId !== user.id) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Job</h1>
      <JobForm
        jobId={job.id}
        defaultValues={{
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          locationType: job.locationType,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          currency: job.currency,
          techSkills: job.techSkills,
          visaSponsorship: job.visaSponsorship,
          experienceLevel: job.experienceLevel,
          employmentType: job.employmentType,
          companySize: job.companySize,
          aboutCompany: job.aboutCompany,
          benefits: job.benefits,
          interviewProcess: job.interviewProcess,
        }}
      />
    </div>
  );
}
