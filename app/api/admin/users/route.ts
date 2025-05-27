import { supabaseService } from "@/src/utils/supabase/service";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseService().rpc("admin_users");
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const sb = supabaseService();

  let uid = body.p_id as string | undefined;

  if (!uid) {
    const { data, error: authErr } = await sb.auth.admin.createUser({
      email: body.p_email,
      password: body.p_password || "password",
      email_confirm: true,
      user_metadata: { role: body.p_role },
    });
    if (authErr) return NextResponse.json({ error: authErr }, { status: 500 });

    uid = data.user.id; // use GoTrue-generated id
  } else {
    const { error: authErr } = await sb.auth.admin.updateUserById(uid, {
      email: body.p_email,
      user_metadata: { role: body.p_role },
    });
    if (authErr) return NextResponse.json({ error: authErr }, { status: 500 });
  }

  const { error } = await sb.rpc("admin_upsert_user", {
    p_role: body.p_role,
    p_name: body.p_name,
    p_email: body.p_email,
    p_phone: body.p_phone,
    p_cost_rate: body.p_cost_rate,
    p_bill_rate: body.p_bill_rate,
    p_id: uid, // always supply id now
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await supabaseService().auth.admin.deleteUser(id);

  const { error } = await supabaseService().rpc("admin_delete_user", {
    p_id: id,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
