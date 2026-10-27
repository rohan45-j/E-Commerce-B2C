import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export interface SessionUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: Role;
  phone?: string | null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.email) return null;

  return {
    id: session.user.id as string,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: ((session.user as { role?: Role }).role as Role) || Role.CUSTOMER,
    phone: (session.user as { phone?: string }).phone,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]): Promise<SessionUser> {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect("/account");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  return requireRole([Role.ADMIN]);
}

export async function requireStaffOrAdmin(): Promise<SessionUser> {
  return requireRole([Role.ADMIN, Role.STAFF]);
}
