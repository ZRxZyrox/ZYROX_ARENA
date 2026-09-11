/**
 * Rate limiting. In production this should bind to Cloudflare's native
 * Rate Limiting rules (dashboard-configured, or the `RATE_LIMITER`
 * binding) rather than hand-rolled counting, since Workers are stateless
 * and a manual in-memory counter resets on every cold start.
 *
 * This helper is written against that binding's shape so swapping in the
 * real binding is a one-line change once it's provisioned in
 * wrangler.toml. For local dev / before the binding exists, it degrades
 * to a no-op (logged) rather than silently pretending to protect anything.
 */
export function rateLimit(limit: number, window: string) {
  return async (request: Request, env: any): Promise<Response | undefined> => {
    if (!env.RATE_LIMITER) {
      console.warn(`[rate-limit] RATE_LIMITER binding not configured — skipping (limit ${limit}/${window})`);
      return undefined;
    }
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return new Response(JSON.stringify({ message: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": "60" },
      });
    }
    return undefined;
  };
}
