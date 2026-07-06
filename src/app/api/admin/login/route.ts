import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminPassword, safeAdminRedirectPath } from "@/lib/auth";
import { publicRedirect } from "@/lib/request-origin";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = safeAdminRedirectPath(String(formData.get("from") ?? "/admin"));

  if (password !== getAdminPassword()) {
    const loginUrl = publicRedirect(
      request,
      `/admin/login?error=1&from=${encodeURIComponent(from)}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(publicRedirect(request, from));
  response.cookies.set(ADMIN_COOKIE, getAdminPassword(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
