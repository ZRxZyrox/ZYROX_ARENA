import { SignJWT, jwtVerify } from "jose";
import { compare } from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import type { Env } from "../index";
import { getSession } from "../middleware/require-admin";

// Access token: short-lived (15 min), drives request auth.
// Refresh token: long-lived (7 days), HttpOnly + Secure + Path-scoped to
// the refresh endpoint only, used solely to mint new access tokens —
// this split limits how long a stolen access token stays useful.
const ACCESS_TTL = "15m";
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function handleAdminLogin(request: Request, env: Env): Promise<Response> {
  const { email, password } = await request.json<{ email: string; password: string }>();
  if (!email || !password) {
    return json({ message: "Email and password required" }, 400);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, password_hash, role_id, is_active, admin_roles(name, permissions)")
    .eq("email", email.toLowerCase().trim())
    .single();

  // Constant-shape response whether the email exists or not, and whether
  // the password matched or not — never leak which one was wrong.
  const passwordOk = admin ? await verifyPassword(password, admin.password_hash) : false;
  if (!admin || !admin.is_active || !passwordOk) {
    return json({ message: "Invalid credentials" }, 401);
  }

  const role = (admin as any).admin_roles;
  const accessToken = await new SignJWT({ role: role.name, permissions: role.permissions })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setExpirationTime(ACCESS_TTL)
    .sign(new TextEncoder().encode(env.JWT_SECRET));

  const refreshToken = await new SignJWT({ type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setExpirationTime(`${REFRESH_TTL_SECONDS}s`)
    .sign(new TextEncoder().encode(env.JWT_REFRESH_SECRET));

  const csrfToken = crypto.randomUUID();

  await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", admin.id);
  await supabase.from("audit_logs").insert({
    admin_id: admin.id,
    action: "admin.login",
    ip_address: request.headers.get("CF-Connecting-IP"),
  });

  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", `session=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`);
  headers.append(
    "Set-Cookie",
    `refresh=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/admin/auth/refresh; Max-Age=${REFRESH_TTL_SECONDS}`
  );
  headers.append("Set-Cookie", `csrf_token=${csrfToken}; Secure; SameSite=Strict; Path=/; Max-Age=900`);

  return new Response(JSON.stringify({ ok: true }), { headers });
}

export async function handleAdminLogout(request: Request): Promise<Response> {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", "session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
  headers.append("Set-Cookie", "csrf_token=; Secure; SameSite=Strict; Path=/; Max-Age=0");
  return new Response(JSON.stringify({ ok: true }), { headers });
}

export async function handleAdminMe(request: Request): Promise<Response> {
  const session = getSession(request);
  return json({ adminId: session?.adminId, role: session?.role });
}

async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  // bcryptjs is pure JS (no native bindings), which is what makes it
  // Workers-compatible — native bcrypt libs (@node-rs/bcrypt etc.) are not.
  return compare(plain, hash);
}

/**
 * Exchanges a valid refresh token (HttpOnly, path-scoped cookie) for a
 * fresh access token. Lets a 15-minute access token feel invisible to the
 * admin without extending its own blast radius — the refresh token is
 * never sent to any endpoint except this one (Path=/admin/auth/refresh).
 */
export async function handleAdminRefresh(request: Request, env: Env): Promise<Response> {
  const cookieHeader = request.headers.get("Cookie") || "";
  const refreshToken = /refresh=([^;]+)/.exec(cookieHeader)?.[1];
  if (!refreshToken) return json({ message: "No refresh token" }, 401);

  let adminId: string;
  try {
    const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(env.JWT_REFRESH_SECRET));
    if (payload.type !== "refresh") throw new Error("wrong token type");
    adminId = payload.sub as string;
  } catch {
    // Expired/tampered refresh token — force full re-login rather than
    // silently failing, so a stolen/replayed token can't linger.
    const headers = new Headers({ "Content-Type": "application/json" });
    headers.append("Set-Cookie", "session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
    headers.append("Set-Cookie", "refresh=; HttpOnly; Secure; SameSite=Strict; Path=/admin/auth/refresh; Max-Age=0");
    return new Response(JSON.stringify({ message: "Refresh token invalid" }), { status: 401, headers });
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, is_active, admin_roles(name, permissions)")
    .eq("id", adminId)
    .single();

  if (!admin || !admin.is_active) return json({ message: "Account disabled" }, 401);

  const role = (admin as any).admin_roles;
  const accessToken = await new SignJWT({ role: role.name, permissions: role.permissions })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setExpirationTime(ACCESS_TTL)
    .sign(new TextEncoder().encode(env.JWT_SECRET));

  const csrfToken = crypto.randomUUID();
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", `session=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`);
  headers.append("Set-Cookie", `csrf_token=${csrfToken}; Secure; SameSite=Strict; Path=/; Max-Age=900`);
  return new Response(JSON.stringify({ ok: true }), { headers });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
