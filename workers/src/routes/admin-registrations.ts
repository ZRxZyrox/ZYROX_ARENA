import { createClient } from "@supabase/supabase-js";
import type { Env } from "../index";
import { getSession, hasPermission } from "../middleware/require-admin";

export async function handleListRegistrations(request: Request, env: Env, ctx: any): Promise<Response> {
  const tournamentId = ctx?.params?.id;
  const url = new URL(request.url);
  const paymentStatus = url.searchParams.get("payment_status");
  const approvalStatus = url.searchParams.get("approval_status");

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  let query = supabase.from("registrations").select("*").eq("tournament_id", tournamentId);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);
  if (approvalStatus) query = query.eq("approval_status", approvalStatus);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return json({ message: "Query failed" }, 500);
  return json({ registrations: data });
}

export async function handleApproveTeam(request: Request, env: Env, ctx: any): Promise<Response> {
  return setTeamStatus(request, env, ctx, "approved");
}
export async function handleRejectTeam(request: Request, env: Env, ctx: any): Promise<Response> {
  return setTeamStatus(request, env, ctx, "rejected");
}

async function setTeamStatus(request: Request, env: Env, ctx: any, status: "approved" | "rejected") {
  if (!hasPermission(request, "registrations.moderate")) return json({ message: "Forbidden" }, 403);

  const teamId = ctx?.params?.id;
  const session = getSession(request);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase.from("teams").update({ status }).eq("id", teamId).select().single();
  if (error) return json({ message: "Update failed" }, 500);

  try {
    await supabase.from("audit_logs").insert({
      admin_id: session?.adminId,
      action: `team.${status}`,
      target_table: "teams",
      target_id: teamId,
      ip_address: request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for"),
    });
  } catch {
    // Non-blocking audit log
  }

  return json({ team: data });
}

/**
 * "Verify payment" does NOT flip payment_status to 'paid' directly based
 * on admin say-so — that would reopen the exact client/admin-trust hole
 * the webhook was built to close. Instead it re-queries Cashfree's order
 * API right now and writes whatever Cashfree actually reports. This
 * exists for the case where the webhook was delayed/missed and an admin
 * needs to manually trigger a re-check, not to let anyone hand-wave a
 * payment through.
 */
export async function handleVerifyPayment(request: Request, env: Env, ctx: any): Promise<Response> {
  if (!hasPermission(request, "payments.verify")) return json({ message: "Forbidden" }, 403);

  const registrationId = ctx?.params?.id;
  const session = getSession(request);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: registration } = await supabase
    .from("registrations")
    .select("cashfree_order_id")
    .eq("id", registrationId)
    .single();

  if (!registration?.cashfree_order_id) return json({ message: "No linked order" }, 404);

  const cfRes = await fetch(`https://api.cashfree.com/pg/orders/${registration.cashfree_order_id}`, {
    headers: {
      "x-api-version": "2023-08-01",
      "x-client-id": env.CASHFREE_APP_ID,
      "x-client-secret": env.CASHFREE_SECRET_KEY,
    },
  });
  const orderDetails = await cfRes.json<{ order_status: string }>();
  const newStatus = orderDetails.order_status === "PAID" ? "paid" : "failed";

  const { data } = await supabase
    .from("registrations")
    .update({ payment_status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", registrationId)
    .select()
    .single();

  try {
    await supabase.from("audit_logs").insert({
      admin_id: session?.adminId,
      action: "payment.manual_verify",
      target_table: "registrations",
      target_id: registrationId,
      metadata: { result: newStatus },
      ip_address: request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for"),
    });
  } catch {
    // Non-blocking audit log
  }

  return json({ registration: data });
}

/**
 * Returns a short-lived signed URL to a CSV rather than streaming the
 * file through this handler — keeps large exports off the Worker's
 * request/response cycle and lets Supabase Storage handle the transfer.
 */
export async function handleExportRegistrations(request: Request, env: Env, ctx: any): Promise<Response> {
  if (!hasPermission(request, "registrations.export")) return json({ message: "Forbidden" }, 403);

  const tournamentId = ctx?.params?.id;
  const session = getSession(request);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: registrations } = await supabase
    .from("registrations")
    .select("player_name, in_game_id, email, phone, mode, amount_paise, payment_status, approval_status, created_at")
    .eq("tournament_id", tournamentId);

  const csv = toCsv(registrations ?? []);
  const path = `exports/${tournamentId}-${Date.now()}.csv`;

  const { error } = await supabase.storage.from("admin-exports").upload(path, csv, { contentType: "text/csv" });
  if (error) return json({ message: "Export failed" }, 500);

  const { data: signed } = await supabase.storage.from("admin-exports").createSignedUrl(path, 300); // 5 min

  try {
    await supabase.from("audit_logs").insert({
      admin_id: session?.adminId,
      action: "registrations.export",
      target_table: "tournaments",
      target_id: tournamentId,
      ip_address: request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for"),
    });
  } catch {
    // Non-blocking audit log
  }

  return json({ downloadUrl: signed?.signedUrl });
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
