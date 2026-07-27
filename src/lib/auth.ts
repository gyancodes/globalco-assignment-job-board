import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import type { Role } from "@/types";
import { ApiError } from "@/lib/api-error";

export async function currentUser() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  let user = await getPrisma().user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) {
    const email = authUser.email ?? "";
    const fullName =
      authUser.user_metadata?.full_name ??
      authUser.user_metadata?.name ??
      email.split("@")[0] ??
      "User";

    const role = (authUser.user_metadata?.role as Role) ?? "CANDIDATE";

    user = await getPrisma().user.create({
      data: {
        id: authUser.id,
        email,
        fullName,
        role,
      },
    });
  }

  return user;
}

export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    throw new ApiError({
      statusCode: 401,
      message: "Authentication required",
      code: "UNAUTHORIZED",
    });
  }

  let user = await getPrisma().user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) {
    const email = authUser.email ?? "";
    const fullName =
      authUser.user_metadata?.full_name ??
      authUser.user_metadata?.name ??
      email.split("@")[0] ??
      "User";
    const role = (authUser.user_metadata?.role as Role) ?? "CANDIDATE";

    user = await getPrisma().user.create({
      data: {
        id: authUser.id,
        email,
        fullName,
        role,
      },
    });
  }

  return user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireAuth();

  if (!roles.includes(user.role)) {
    throw new ApiError({
      statusCode: 403,
      message: `Access denied. Required role: ${roles.join(" or ")}`,
      code: "FORBIDDEN",
    });
  }

  return user;
}
