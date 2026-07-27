import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { handleApiError, ApiError } from "@/lib/api-error";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      throw new ApiError({
        statusCode: 401,
        message: "Authentication required",
        code: "UNAUTHORIZED",
      });
    }

    const { role } = await request.json();

    if (!["CANDIDATE", "RECRUITER"].includes(role)) {
      throw new ApiError({
        statusCode: 400,
        message: "Role must be CANDIDATE or RECRUITER",
        code: "VALIDATION_ERROR",
      });
    }

    const updated = await prisma.user.update({
      where: { id: authUser.id },
      data: { role },
    });

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
