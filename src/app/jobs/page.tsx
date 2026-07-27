import { prisma } from "@/lib/prisma";
import { JobCard } from "@/features/jobs/components/job-card";
import { JobSearch } from "@/features/jobs/components/job-search";
import { Pagination } from "@/components/pagination";
import { Suspense } from "react";

const PAGE_SIZE = 12;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function JobList({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
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
    prisma.job.findMany({
      where,
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">No jobs found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
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
        basePath="/jobs"
        searchParams={params as Record<string, string>}
      />
    </>
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
