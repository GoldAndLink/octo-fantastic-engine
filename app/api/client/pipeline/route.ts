import { supabaseService } from "@/src/utils/supabase/service";
import { NextResponse } from "next/server";

const CLIENT_ID = "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d";

export async function POST(req: Request) {
  const { phase } = await req.json();
  const { error } = await supabaseService().rpc("mark_pipeline_phase", {
    p_client: CLIENT_ID,
    p_phase: phase,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
