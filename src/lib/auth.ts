import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "ws-admin-auth";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "changeme";
}

export function isValidAdminSession(token: string | undefined): boolean {
  return token === getAdminPassword();
}

/** Only allow same-origin relative paths (avoids open redirects). */
export function safeAdminRedirectPath(from: string, fallback = "/admin"): string {
  if (from.startsWith("/") && !from.startsWith("//") && from !== "/admin/login") {
    return from;
  }
  return fallback;
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
