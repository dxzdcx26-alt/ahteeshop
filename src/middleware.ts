import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  const protectedPaths = ["/home", "/shop", "/trade", "/usecode", "/pay", "/admin"];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  if (isProtected && !isLoggedIn) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  if (path.startsWith("/admin") && req.auth?.user && (req.auth.user as any).role !== "actor") {
    return NextResponse.redirect(new URL("/home", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/home/:path*", "/shop/:path*", "/trade/:path*", "/usecode/:path*", "/pay/:path*", "/admin/:path*"],
};
