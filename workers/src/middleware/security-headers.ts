import type { Env } from "../index";

// Applied to EVERY response. These cannot be reliably set via HTML meta
// tags (CSP frame-ancestors, X-Frame-Options, HSTS all require real HTTP
// headers), which is why this lives in the Worker rather than index.html.
export function securityHeaders(response: Response, env: Env): Response {
  const headers = new Headers(response.headers);

  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://sdk.cashfree.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://api.cashfree.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://sdk.cashfree.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  headers.set("Access-Control-Allow-Origin", env.ALLOWED_ORIGIN);
  headers.set("Access-Control-Allow-Credentials", "true");

  return new Response(response.body, { status: response.status, headers });
}
