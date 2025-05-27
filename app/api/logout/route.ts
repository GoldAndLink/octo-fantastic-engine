import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/auth/signin", req.url));

  for (const cookie of req.headers.get("cookie")?.split(";") || []) {
    const [name] = cookie.trim().split("=");
    if (name.startsWith("sb-")) {
      res.cookies.set(name, "", { maxAge: 0, path: "/" });
    }
  }
  return res;
}
