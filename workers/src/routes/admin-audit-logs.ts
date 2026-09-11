import { createClient } from "@supabase/supabase-js";
import type { Env } from "../index";
import { hasPermission } from "../middleware/require-admin";

export async function handleListAuditLogs(request: Request, env: Env): Promise<Response> {
  // Audit log visibility is itself a sensitive permission — a
  // tournament_manager shouldn't necessarily see every finance/payment
  // action across the platform.
  if (!hasPermission(request, "audit_logs.read")) return json({ message: "Forbidden" }, 403);

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const pageSize = 50;

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, count } = await supabase
    .from("audit_logs")
    .select("id, admin_id, action, target_table, target_id, metadata, ip_address, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  return json({ logs: data, page, pageSize, total: count });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
