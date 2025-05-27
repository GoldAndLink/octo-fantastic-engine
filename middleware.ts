/**
 * @fileoverview Next.js Middleware
 * Handles authentication and role-based access control for the application.
 * Integrates with Supabase for session management and user roles.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { updateSession } from "./src/utils/supabase/middleware";

/**
 * Middleware function that runs before page requests
 * Handles:
 * - Session management with Supabase
 * - Role-based access control
 * - Route protection based on authentication status
 * 
 * @param req - The incoming request object
 * @returns NextResponse with appropriate redirects or the original response
 */
export async function middleware(req: any) {
  // Update the session state
  const res = await updateSession(req);

  // Initialize Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies
            .getAll()
            .map((cookie: { name: string; value: string }) => ({
              name: cookie.name,
              value: cookie.value,
            }));
        },
        setAll(cookies: { name: string; value: string; options?: any }[]) {
          cookies.forEach(
            (cookie: { name: string; value: string; options?: any }) =>
              res.cookies.set(cookie.name, cookie.value, cookie.options)
          );
        },
      },
    }
  );

  // Get the user's role from Supabase
  const { data, error } = await supabase.rpc("get_current_role");

  if (error) console.error("get_current_role error", error);

  const role = data as "ADMIN" | "SE" | "CLIENT" | "GUEST" | null;

  console.log("Role: ", role);

  const path = req.nextUrl.pathname;

  // Protect routes that require authentication
  const needsAuth = path.startsWith("/admin") || path.startsWith("/client");
  if (needsAuth && (!role || role === "GUEST"))
    return NextResponse.redirect(new URL("/auth/signin", req.url));

  // Redirect non-admin users away from admin routes
  if (path.startsWith("/admin") && role !== "ADMIN" && role !== "SE")
    return NextResponse.redirect(new URL("/client", req.url));

  // Redirect admin users away from client routes
  if (path.startsWith("/client") && (role === "ADMIN" || role === "SE"))
    return NextResponse.redirect(new URL("/admin", req.url));

  return res;
}

/**
 * Middleware configuration
 * Specifies which routes the middleware should run on
 * Excludes static files, images, and authentication routes
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
