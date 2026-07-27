import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 10;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-700 border-blue-200",
  accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ApplicationsPage(props: { searchParams: SearchParams }) {
  const user = await currentUser();
  const { page: pageParam } = await props.searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  if (!user || user.role !== "CANDIDATE") {
    redirect("/dashboard");
  }

  const where = { candidateId: user.id };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: {
        job: {
          select: { id: true, title: true, company: true, location: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.application.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">My Applications</h1>

      {applications.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No applications yet</p>
          <p className="text-sm mt-1">Browse jobs and apply to get started</p>
        </div>
      )}

      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{app.job.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {app.job.company} &middot; {app.job.location}
                </p>
              </div>
              <Badge className={statusColors[app.status.toLowerCase()] ?? ""}>
                {app.status.toLowerCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Applied {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/dashboard/applications" />
    </div>
  );
}
