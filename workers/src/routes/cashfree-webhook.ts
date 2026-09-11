import { createClient } from "@supabase/supabase-js";
import type { Env } from "../index";

/**
 * Cashfree Webhook Handler
 * Verified via HMAC-SHA256 signature against CASHFREE_WEBHOOK_SECRET.
 * Responds 200 OK to Cashfree dashboard test pings and URL verifications.
 */
export async function handleCashfreeWebhook(request: Request, env: Env): Promise<Response> {
  // Respond 200 OK to browser GET requests or test pings
  if (request.method === "GET") {
    return new Response("Cashfree Webhook Endpoint Active", { status: 200 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");

  // Accept test pings from Cashfree dashboard during webhook URL registration
  if (!signature || !timestamp || rawBody.includes("TEST_WEBHOOK") || !rawBody) {
    return new Response(JSON.stringify({ status: "OK", message: "Webhook endpoint active" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If CASHFREE_WEBHOOK_SECRET is set, verify HMAC signature
  if (env.CASHFREE_WEBHOOK_SECRET) {
    try {
      const expectedSignature = await computeSignature(timestamp + rawBody, env.CASHFREE_WEBHOOK_SECRET);
      if (!timingSafeEqual(signature, expectedSignature)) {
        console.warn("Cashfree webhook signature mismatch — rejecting");
        return new Response("Invalid signature", { status: 401 });
      }
    } catch (e) {
      console.warn("Signature verification error:", e);
    }
  }

  try {
    const payload = JSON.parse(rawBody) as {
      type?: string;
      data?: { order?: { order_id?: string }; payment?: { payment_status?: string } };
    };

    const orderId = payload.data?.order?.order_id;
    const paymentStatus = payload.data?.payment?.payment_status;

    if (!orderId) {
      return new Response("OK", { status: 200 });
    }

    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    // Verify order status directly with Cashfree PG API if credentials are present
    let isReallyPaid = paymentStatus === "SUCCESS";
    if (env.CASHFREE_APP_ID && env.CASHFREE_SECRET_KEY) {
      const mode = env.CASHFREE_MODE === "PROD" ? "api.cashfree.com" : "sandbox.cashfree.com";
      const verifyRes = await fetch(`https://${mode}/pg/orders/${orderId}`, {
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": env.CASHFREE_APP_ID,
          "x-client-secret": env.CASHFREE_SECRET_KEY,
        },
      });
      if (verifyRes.ok) {
        const orderDetails = await verifyRes.json<{ order_status: string }>();
        isReallyPaid = orderDetails.order_status === "PAID" && paymentStatus === "SUCCESS";
      }
    }

    await supabase
      .from("registrations")
      .update({
        payment_status: isReallyPaid ? "paid" : "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    await supabase.from("audit_logs").insert({
      action: "payment.webhook_processed",
      target_table: "registrations",
      target_id: orderId,
      metadata: { payment_status: paymentStatus },
    });
  } catch (err) {
    console.error("Error processing webhook payload:", err);
  }

  return new Response("OK", { status: 200 });
}

async function computeSignature(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}
