import { getPrisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { JobCard } from "@/features/jobs/components/job-card";
import { GhostJobCard } from "@/features/jobs/components/ghost-job-card";
import { JobSearch } from "@/features/jobs/components/job-search";
import { Pagination } from "@/components/pagination";
import { Suspense } from "react";

const PAGE_SIZE = 12;
const PUBLIC_LIMIT = 3;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function JobList({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = params.query as string | undefined;
  const location = params.location as string | undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const user = await currentUser();
  const isAuthenticated = !!user;

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

  const take = isAuthenticated ? PAGE_SIZE : PUBLIC_LIMIT;
  const skip = isAuthenticated ? (page - 1) * PAGE_SIZE : 0;

  const [jobs, total] = await Promise.all([
    getPrisma().job.findMany({
      where,
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    getPrisma().job.count({ where }),
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
        {!isAuthenticated && jobs.length >= PUBLIC_LIMIT && (
          <>
            <GhostJobCard />
            <GhostJobCard />
            <GhostJobCard />
          </>
        )}
      </div>
      {isAuthenticated && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/jobs"
          searchParams={params as Record<string, string>}
        />
      )}
      {!isAuthenticated && total > PUBLIC_LIMIT && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Showing {PUBLIC_LIMIT} of {total} jobs. Sign in to see all listings and apply.
          </p>
        </div>
      )}
    </>
  );
}

export default async function JobsPage(props: {
  searchParams: SearchParams;
}) {
  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Browse Jobs</h1>
      </div>
      <div className="mb-6">
        <Suspense>
          <JobSearch />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                <div className="flex gap-2 mt-3">
                  <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
                </div>
                <div className="h-5 w-1/3 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        }
      >
        <JobList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
