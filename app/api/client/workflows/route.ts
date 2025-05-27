import { supabaseService } from "@/src/utils/supabase/service";
import { NextResponse } from "next/server";

const CLIENT_ID = "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d";

export async function GET() {
  const { data, error } = await supabaseService().rpc(
    "get_client_workflows",
    { p_client: CLIENT_ID }
  );

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (
    !body.name ||
    !body.departmentId ||
    !Array.isArray(body.nodes) ||
    body.nodes.length === 0
  ) {
    return NextResponse.json(
      { error: "name, departmentId and at least one node are required" },
      { status: 400 }
    );
  }

  const sb = supabaseService();

  const { data: dept } = await sb
    .from("departments")
    .select("id")
    .eq("id", body.departmentId)
    .single();

  if (!dept) {
    const { error: depErr } = await sb.from("departments").insert({
      id: body.departmentId,
      client_id: CLIENT_ID,
      name: body.departmentName ?? "Unnamed",
    });
    if (depErr) return NextResponse.json({ error: depErr }, { status: 500 });
  }

  const { error, data } = await sb.rpc("admin_create_workflow", {
    p_client_id: CLIENT_ID,
    p_department_id: body.departmentId,
    p_name: body.name,
    p_description: body.description ?? null,
    p_nodes: body.nodes,
    p_time_saved_exec: body.timeSaved ?? 0,
    p_money_saved_exec: body.moneySaved ?? 0,
    p_is_active: true,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ workflowId: data });
}
