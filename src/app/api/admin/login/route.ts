import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (password !== getAdminPassword()) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "1");
    loginUrl.searchParams.set("from", from);
    return NextResponse.redirect(loginUrl);
  }

  const destination = from && from !== "/admin/login" ? from : "/admin";
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.cookies.set(ADMIN_COOKIE, getAdminPassword(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
