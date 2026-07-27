import { prisma } from "@/lib/prisma";
import { JobCard } from "@/features/jobs/components/job-card";
import { JobSearch } from "@/features/jobs/components/job-search";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function JobList({ searchParams }: { searchParams: SearchParams }) {
  const { query, location } = await searchParams;

  const jobs = await prisma.job.findMany({
    where: {
      ...(query && {
        OR: [
          { title: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
          { company: { contains: query as string, mode: "insensitive" } },
        ],
      }),
      ...(location && {
        location: { contains: location as string, mode: "insensitive" },
      }),
    },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">No jobs found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
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
  );
}

export default async function JobsPage(props: {
  searchParams: SearchParams;
}) {
  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Browse Jobs</h1>
      <div className="mb-6">
        <Suspense>
          <JobSearch />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="text-center py-16 text-muted-foreground">
            Loading jobs...
          </div>
        }
      >
        <JobList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
