import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { handleApiError, ApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get("jobId");

    if (user.role === "RECRUITER") {
      const applications = await prisma.application.findMany({
        where: {
          ...(jobId ? { jobId } : {}),
          job: { recruiterId: user.id },
        },
        include: {
          candidate: {
            select: { id: true, fullName: true, email: true },
          },
          job: {
            select: { id: true, title: true, company: true, location: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return Response.json(applications);
    }

    const applications = await prisma.application.findMany({
      where: { candidateId: user.id },
      include: {
        job: {
          select: { id: true, title: true, company: true, location: true },
          include: {
            recruiter: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(applications);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("CANDIDATE");

    const { jobId } = await request.json();

    if (!jobId) {
      throw new ApiError({
        statusCode: 400,
        message: "Job ID is required",
        code: "VALIDATION_ERROR",
      });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      throw new ApiError({
        statusCode: 404,
        message: "Job not found",
        code: "NOT_FOUND",
      });
    }

    const existing = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: user.id,
          jobId,
        },
      },
    });

    if (existing) {
      throw new ApiError({
        statusCode: 409,
        message: "You have already applied to this job",
        code: "ALREADY_APPLIED",
      });
    }

    const application = await prisma.application.create({
      data: {
        candidateId: user.id,
        jobId,
      },
    });

    return Response.json(application, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
