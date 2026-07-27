import { getPrisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StatusUpdater } from "@/components/status-updater";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 10;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ApplicantsPage(props: { searchParams: SearchParams }) {
  const user = await currentUser();
  const { page: pageParam } = await props.searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  if (!user || user.role !== "RECRUITER") {
    redirect("/dashboard");
  }

  const where = { job: { recruiterId: user.id } };

  const [applications, total] = await Promise.all([
    getPrisma().application.findMany({
      where,
      include: {
        candidate: {
          select: { id: true, fullName: true, email: true },
        },
        job: {
          select: { id: true, title: true, company: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    getPrisma().application.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Applicants</h1>

      {applications.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No applications yet</p>
          <p className="text-sm mt-1">
            Applications will appear here when candidates apply to your jobs
          </p>
        </div>
      )}

      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{app.candidate.fullName}</h2>
                <p className="text-sm text-muted-foreground">
                  {app.candidate.email}
                </p>
              </div>
              <StatusUpdater
                applicationId={app.id}
                currentStatus={app.status as "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED"}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Applied to <strong>{app.job.title}</strong> at{" "}
              {app.job.company} &middot;{" "}
              {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/dashboard/applicants" />
    </div>
  );
}
