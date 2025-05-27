import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser-side operations.
 * Use this helper when you need to interact with Supabase from client-side code.
 */

export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
