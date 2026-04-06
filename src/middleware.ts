import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase-middleware";

const PUBLIC_ROUTES = new Set([
  "/",
  "/contacto",
  "/funcionalidades",
  "/pricing",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
]);

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.has(pathname) || pathname.startsWith("/auth/");
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const { pathname } = request.nextUrl;

  // Refresh the session (keeps cookies alive)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authenticated user visiting auth pages → redirect to dashboard
  // Exception: /auth/sign-up is allowed through — the user may be mid-registration
  // (OTP confirmed but password not yet set). The sign-up page handles this itself.
  if (user && pathname.startsWith("/auth/") && pathname !== "/auth/sign-up") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user visiting a protected route → redirect to sign-in
  if (!user && !isPublic(pathname)) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.webp$|sitemap.xml|robots.txt|afip/|plantilla-).*)",
  ],
};
