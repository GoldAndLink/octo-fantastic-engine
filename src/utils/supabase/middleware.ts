import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(
  request: NextRequest
): Promise<NextResponse> {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );


  await supabase.auth.getUser();
  return response;
}
