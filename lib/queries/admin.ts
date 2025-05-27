import { supabaseServer } from "@/src/utils/supabase/server";

export async function fetchAdminKpis() {
  const sb = await supabaseServer();

  const [
    { count: workflowCount },
    { count: exceptionCount },
    { count: revenueCount },
    { count: clientCount },
  ] = await Promise.all([
    sb.from("workflows").select("id", { count: "exact", head: true }),
    sb.from("exceptions").select("id", { count: "exact", head: true }),
    sb.from("invoices").select("amount", { head: true, count: "exact" }),
    sb.from("clients").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalWorkflows: workflowCount ?? 0,
    totalExceptions: exceptionCount ?? 0,
    revenue: revenueCount ?? 0,
    activeClients: clientCount ?? 0,
    timeSaved: 0,
  };
}
