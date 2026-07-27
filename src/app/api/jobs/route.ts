import { getPrisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { createJobSchema } from "@/lib/validations";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const location = searchParams.get("location");

  try {
    const jobs = await getPrisma().job.findMany({
      where: {
        ...(query && {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(location && {
          location: { contains: location, mode: "insensitive" },
        }),
      },
      include: {
        recruiter: {
          select: { id: true, fullName: true, email: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return Response.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("RECRUITER");

    const body = await request.json();
    const data = createJobSchema.parse(body);

    const job = await getPrisma().job.create({
      data: {
        title: data.title,
        description: data.description,
        company: data.company,
        location: data.location,
        locationType: data.locationType,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        currency: data.currency,
        techSkills: data.techSkills,
        visaSponsorship: data.visaSponsorship,
        experienceLevel: data.experienceLevel,
        employmentType: data.employmentType,
        companySize: data.companySize ?? null,
        aboutCompany: data.aboutCompany ?? null,
        benefits: data.benefits ?? null,
        interviewProcess: data.interviewProcess ?? null,
        recruiterId: user.id,
      },
    });

    return Response.json(job, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
