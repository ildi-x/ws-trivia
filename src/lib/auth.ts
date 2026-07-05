import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "ws-admin-auth";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "changeme";
}

export function isValidAdminSession(token: string | undefined): boolean {
  return token === getAdminPassword();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return isValidAdminSession(token);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}
