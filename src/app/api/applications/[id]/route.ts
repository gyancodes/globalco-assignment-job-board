import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { handleApiError, ApiError } from "@/lib/api-error";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole("RECRUITER");
    const { id } = await params;
    const { status } = await request.json();

    if (!["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"].includes(status)) {
      throw new ApiError({
        statusCode: 400,
        message: "Invalid status value",
        code: "VALIDATION_ERROR",
      });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: { select: { recruiterId: true } } },
    });

    if (!application) {
      throw new ApiError({
        statusCode: 404,
        message: "Application not found",
        code: "NOT_FOUND",
      });
    }

    if (application.job.recruiterId !== user.id) {
      throw new ApiError({
        statusCode: 403,
        message: "Not your job listing",
        code: "FORBIDDEN",
      });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
