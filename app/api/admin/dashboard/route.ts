import { supabaseService } from "@/src/utils/supabase/service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const range = new URL(req.url).searchParams.get("range") ?? "itd";
  const sb = supabaseService();

  const { data, error } = await sb.rpc("get_admin_dashboard_kpis", {
    p_filter: range,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  const current = data.find((d: any) => d.label === "current");
  const previous = data.find((d: any) => d.label === "previous");

  return NextResponse.json({ current, previous });
}
