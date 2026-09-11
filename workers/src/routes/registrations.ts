import { createClient } from "@supabase/supabase-js";
import type { Env } from "../index";

interface RegistrationInput {
  tournamentSlug: string;
  mode: "solo" | "squad";
  playerName: string;
  inGameId: string;
  email: string;
  phone: string;
  teamName?: string;
  teammates?: { name: string; inGameId: string }[];
  couponCode?: string;
}

export async function handleCreateRegistration(request: Request, env: Env): Promise<Response> {
  const input = await request.json<RegistrationInput>();

  // Basic input sanitization / validation — reject anything that doesn't
  // look right before it touches the database. (In production, run this
  // through a zod schema shared with the frontend form schema.)
  if (!input.tournamentSlug || !input.playerName || !input.email || !input.phone) {
    return json({ message: "Missing required fields" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return json({ message: "Invalid email" }, 400);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // Entry fee comes from the DB — the ONLY source of truth for price.
  // The client never sends an amount, and even if it did, it's ignored.
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("id, entry_fee_paise, status, registration_closes_at, max_participants")
    .eq("slug", input.tournamentSlug)
    .eq("published", true)
    .single();

  if (!tournament) return json({ message: "Tournament not found" }, 404);
  if (tournament.status !== "reg_open") return json({ message: "Registration is not open" }, 400);
  if (tournament.registration_closes_at && new Date(tournament.registration_closes_at) < new Date()) {
    return json({ message: "Registration has closed" }, 400);
  }

  let amountPaise = tournament.entry_fee_paise;

  if (input.couponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("discount_percent, max_uses, used_count, valid_from, valid_until, is_active")
      .eq("code", input.couponCode.toUpperCase())
      .single();

    const now = new Date();
    const valid =
      coupon?.is_active &&
      (!coupon.max_uses || coupon.used_count < coupon.max_uses) &&
      (!coupon.valid_from || new Date(coupon.valid_from) <= now) &&
      (!coupon.valid_until || new Date(coupon.valid_until) >= now);

    if (valid && coupon) {
      amountPaise = Math.round(amountPaise * (1 - coupon.discount_percent / 100));
    }
  }

  const { data: registration, error } = await supabase
    .from("registrations")
    .insert({
      tournament_id: tournament.id,
      player_name: input.playerName,
      in_game_id: input.inGameId,
      email: input.email,
      phone: input.phone,
      mode: input.mode,
      amount_paise: amountPaise,
      payment_status: amountPaise === 0 ? "paid" : "pending",
    })
    .select("id")
    .single();

  if (error || !registration) {
    console.error("Registration insert failed:", error);
    return json({ message: "Could not create registration" }, 500);
  }

  // Free entry — no payment step needed.
  if (amountPaise === 0) {
    return json({ orderId: registration.id, cashfreeSessionId: null, free: true });
  }

  // Create the Cashfree order SERVER-SIDE using the secret key. The
  // browser only ever receives the resulting payment_session_id.
  const cfRes = await fetch("https://api.cashfree.com/pg/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": env.CASHFREE_APP_ID,
      "x-client-secret": env.CASHFREE_SECRET_KEY,
    },
    body: JSON.stringify({
      order_id: registration.id,
      order_amount: amountPaise / 100,
      order_currency: "INR",
      customer_details: {
        customer_id: registration.id,
        customer_email: input.email,
        customer_phone: input.phone,
      },
      order_meta: {
        return_url: `${env.ALLOWED_ORIGIN}/payment/${registration.id}/status`,
        notify_url: `${new URL(request.url).origin}/api/webhooks/cashfree`,
      },
    }),
  });

  if (!cfRes.ok) {
    console.error("Cashfree order creation failed:", await cfRes.text());
    return json({ message: "Payment provider error" }, 502);
  }

  const cfOrder = await cfRes.json<{ payment_session_id: string }>();

  await supabase
    .from("registrations")
    .update({ cashfree_order_id: registration.id })
    .eq("id", registration.id);

  return json({ orderId: registration.id, cashfreeSessionId: cfOrder.payment_session_id });
}

export async function handleRegistrationStatus(request: Request, env: Env, ctx: any): Promise<Response> {
  const orderId = ctx?.params?.orderId;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await supabase
    .from("registrations")
    .select("payment_status")
    .eq("id", orderId)
    .single();

  // Deliberately returns ONLY the status — never the full row (email,
  // phone, amount) to an unauthenticated status-poll endpoint.
  return json({ status: data?.payment_status ?? "unknown" });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
