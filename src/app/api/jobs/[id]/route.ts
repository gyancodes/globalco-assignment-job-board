import { getPrisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { createJobSchema } from "@/lib/validations";
import { handleApiError, ApiError } from "@/lib/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const job = await getPrisma().job.findUnique({
      where: { id },
      include: {
        recruiter: {
          select: { id: true, fullName: true, email: true },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    return Response.json(job);
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return Response.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole("RECRUITER");
    const { id } = await params;

    const job = await getPrisma().job.findUnique({ where: { id } });

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.recruiterId !== user.id) {
      throw new ApiError({
        statusCode: 403,
        message: "You can only edit your own jobs",
        code: "FORBIDDEN",
      });
    }

    const body = await request.json();
    const data = createJobSchema.parse(body);

    const updated = await getPrisma().job.update({
      where: { id },
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
      },
    });

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole("RECRUITER");
    const { id } = await params;

    const job = await getPrisma().job.findUnique({ where: { id } });

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.recruiterId !== user.id) {
      throw new ApiError({
        statusCode: 403,
        message: "You can only delete your own jobs",
        code: "FORBIDDEN",
      });
    }

    await getPrisma().job.delete({ where: { id } });

    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
