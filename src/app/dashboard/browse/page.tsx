import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { JobCard } from "@/features/jobs/components/job-card";
import { Pagination } from "@/components/pagination";
import { DashboardJobSearch } from "@/features/jobs/components/dashboard-job-search";
import { Suspense } from "react";
import { Briefcase } from "lucide-react";

const PAGE_SIZE = 9;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function BrowseJobsPage(props: { searchParams: SearchParams }) {
  const user = await currentUser();
  if (!user || user.role !== "CANDIDATE") redirect("/dashboard");

  const params = await props.searchParams;
  const query = params.query as string | undefined;
  const location = params.location as string | undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const where = {
    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
        { company: { contains: query, mode: "insensitive" as const } },
      ],
    }),
    ...(location && {
      location: { contains: location, mode: "insensitive" as const },
    }),
  };

  const [jobs, total] = await Promise.all([
    getPrisma().job.findMany({
      where,
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    getPrisma().job.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Browse Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total} position{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <Suspense>
        <DashboardJobSearch />
      </Suspense>

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground rounded-xl border border-dashed">
          <Briefcase className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm font-medium">No jobs found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                locationType={job.locationType}
                salaryMin={job.salaryMin}
                salaryMax={job.salaryMax}
                currency={job.currency}
                techSkills={job.techSkills}
                experienceLevel={job.experienceLevel}
                employmentType={job.employmentType}
                createdAt={job.createdAt}
                applicationCount={job._count.applications}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/dashboard/browse"
            searchParams={params as Record<string, string>}
          />
        </>
      )}
    </div>
  );
}
