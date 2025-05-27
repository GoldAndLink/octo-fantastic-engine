import { supabaseService } from "@/src/utils/supabase/service";
import { NextResponse } from "next/server";

const CLIENT_ID = "a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d";

export async function GET() {
  const { data, error } = await supabaseService().rpc("get_client_overview", {
    p_client: CLIENT_ID,
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data ?? {});
}
