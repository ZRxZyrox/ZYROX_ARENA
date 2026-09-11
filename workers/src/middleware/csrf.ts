/**
 * Double-submit cookie CSRF protection.
 *
 * On login, the Worker sets TWO cookies:
 *   - `session` (HttpOnly, Secure, SameSite=Strict) — the actual JWT
 *   - `csrf_token` (Secure, SameSite=Strict, NOT HttpOnly) — a random value
 *
 * The admin frontend reads `csrf_token` from document.cookie and sends it
 * back as the `X-CSRF-Token` header on every mutating request. A page on
 * another origin can trigger a cross-site request that carries the
 * cookies automatically, but it CANNOT read `csrf_token` to put it in the
 * header (same-origin policy) — so the two values only match on genuine
 * same-origin requests.
 */
export async function csrfCheck(request: Request): Promise<Response | undefined> {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return undefined;

  // Requests authenticated via explicit Authorization Bearer header are immune to browser cross-site CSRF
  if (request.headers.get("Authorization")?.startsWith("Bearer ")) {
    return undefined;
  }

  const cookieHeader = request.headers.get("Cookie") || "";
  const cookieToken = /csrf_token=([^;]+)/.exec(cookieHeader)?.[1];
  const headerToken = request.headers.get("X-CSRF-Token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return new Response(JSON.stringify({ message: "CSRF validation failed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return undefined; // continue to next handler
}
