import { createClient } from "@supabase/supabase-js";
import type { Env } from "../index";
import { getSession, hasPermission } from "../middleware/require-admin";

export async function handleListTournaments(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("q");

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  let query = supabase.from("tournaments").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error } = await query;
  if (error) return json({ message: "Query failed" }, 500);
  return json({ tournaments: data });
}

interface TournamentInput {
  slug: string;
  title: string;
  game_id: string;
  game: string;
  game_slug: string;
  mode: "solo" | "squad";
  entry_fee_paise: number;
  prize_pool_paise: number;
  prize_pool_display: string;
  registration_opens_at?: string;
  registration_closes_at?: string;
  starts_at?: string;
}

export async function handleCreateTournament(request: Request, env: Env): Promise<Response> {
  if (!hasPermission(request, "tournaments.write")) return json({ message: "Forbidden" }, 403);

  const input = await request.json<TournamentInput>();

  // Server-side validation — never trust the admin panel's own client
  // validation as the final gate, since the endpoint itself is what's
  // authoritative for what ends up chargeable to players.
  if (!input.slug || !input.title || input.entry_fee_paise < 0 || input.prize_pool_paise < 0) {
    return json({ message: "Invalid tournament data" }, 400);
  }
  if (!/^[a-z0-9-]+$/.test(input.slug)) {
    return json({ message: "Slug must be lowercase letters, numbers, and hyphens only" }, 400);
  }

  const session = getSession(request);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("tournaments")
    .insert({ ...input, created_by: session?.adminId, status: "draft", published: false })
    .select()
    .single();

  if (error) return json({ message: "Could not create tournament" }, 500);

  await supabase.from("audit_logs").insert({
    admin_id: session?.adminId,
    action: "tournament.create",
    target_table: "tournaments",
    target_id: data.id,
    ip_address: request.headers.get("CF-Connecting-IP"),
  });

  return json({ tournament: data }, 201);
}

export async function handleUpdateTournament(request: Request, env: Env, ctx: any): Promise<Response> {
  if (!hasPermission(request, "tournaments.write")) return json({ message: "Forbidden" }, 403);

  const id = ctx?.params?.id;
  const updates = await request.json<Partial<TournamentInput> & { status?: string; published?: boolean }>();

  // Publishing is the moment a tournament becomes visible + registrable to
  // the public (RLS gates on `published = true`) — worth its own explicit
  // audit entry distinct from a generic field edit.
  const isPublishAction = "published" in updates;

  const session = getSession(request);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from("tournaments")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return json({ message: "Update failed" }, 500);

  await supabase.from("audit_logs").insert({
    admin_id: session?.adminId,
    action: isPublishAction ? "tournament.publish_toggle" : "tournament.update",
    target_table: "tournaments",
    target_id: id,
    metadata: updates,
    ip_address: request.headers.get("CF-Connecting-IP"),
  });

  return json({ tournament: data });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
