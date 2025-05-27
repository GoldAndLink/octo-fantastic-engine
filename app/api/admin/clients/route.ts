import { supabaseService } from "@/src/utils/supabase/service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = url.searchParams.get("range") ?? "itd";
  const sort = url.searchParams.get("sort") ?? "name";
  const dir = url.searchParams.get("dir") ?? "asc";

  const sb = supabaseService();
  const { data, error } = await sb.rpc("get_admin_clients", {
    p_filter: range,
    p_sort: sort,
    p_dir: dir,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data || []);
}
