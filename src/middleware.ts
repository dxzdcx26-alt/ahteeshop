import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;

  const protectedPaths = ["/home", "/shop", "/trade", "/usecode", "/pay", "/admin"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  if (isProtected && !isLoggedIn) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  if (path.startsWith("/admin") && token && (token as any).role !== "actor") {
    return NextResponse.redirect(new URL("/home", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/shop/:path*",
    "/trade/:path*",
    "/usecode/:path*",
    "/pay/:path*",
    "/admin/:path*",
  ],
};
