import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { updateProfileSchema } from "@/lib/validations";

export async function GET() {
  try {
    const user = await requireAuth();
    return Response.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    const updated = await getPrisma().user.update({
      where: { id: user.id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.headline !== undefined && { headline: data.headline }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.skills !== undefined && { skills: data.skills }),
        ...(data.experience !== undefined && { experience: data.experience }),
        ...(data.education !== undefined && { education: data.education }),
        ...(data.linkedInUrl !== undefined && { linkedInUrl: data.linkedInUrl || null }),
        ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl || null }),
        ...(data.website !== undefined && { website: data.website || null }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
    });

    return Response.json({ user: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
