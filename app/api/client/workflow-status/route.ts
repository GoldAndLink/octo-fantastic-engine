import { supabaseService } from "@/src/utils/supabase/service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { workflowId, active } = await req.json();
  const { error } = await supabaseService().rpc("set_workflow_status", {
    p_workflow: workflowId,
    p_active: active,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
