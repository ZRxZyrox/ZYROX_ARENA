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

  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = password.trim();

  let adminId: string | null = null;
  let roleName = "admin";
  let permissions: Record<string, boolean> = { "*": true };
  let isCfAdmin = false;

  // 1. Check Cloudflare Environment Variables (ADMIN_EMAIL & ADMIN_PASSWORD)
  // This allows changing the admin password anytime directly in Cloudflare Variables & Secrets!
  const cfAdminEmail = env.ADMIN_EMAIL?.toLowerCase().trim();
  const cfAdminPassword = env.ADMIN_PASSWORD?.trim();

  if (cfAdminEmail && cfAdminPassword && cleanEmail === cfAdminEmail) {
    const isPassMatch =
      cleanPass === cfAdminPassword || (await verifyPassword(cleanPass, cfAdminPassword).catch(() => false));

    if (isPassMatch) {
      isCfAdmin = true;
      roleName = "super_admin";
      permissions = {
        "*": true,
        "tournaments.write": true,
        "registrations.moderate": true,
        "payments.verify": true,
        "registrations.export": true,
        "audit_logs.read": true,
      };
    }
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  if (isCfAdmin) {
    // Cloudflare environment admin matched! Link with Supabase admin_users if available
    try {
      const { data: existingAdmin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (existingAdmin?.id) {
        adminId = existingAdmin.id;
        await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", adminId);
      } else {
        const masterId = "00000000-0000-4000-8000-000000000001";
        await supabase
          .from("admin_users")
          .upsert(
            {
              id: masterId,
              email: cleanEmail,
              password_hash: "CLOUDFLARE_ENV_MANAGED",
              is_active: true,
              last_login_at: new Date().toISOString(),
            },
            { onConflict: "email" }
          )
          .catch(() => {});
        adminId = masterId;
      }
    } catch {
      adminId = "00000000-0000-4000-8000-000000000001";
    }
  } else {
    // 2. Fallback: Check Supabase database table `admin_users`
    try {
      const { data: admin } = await supabase
        .from("admin_users")
        .select("id, password_hash, role_id, is_active, admin_roles(name, permissions)")
        .eq("email", cleanEmail)
        .maybeSingle();

      const passwordOk = admin ? await verifyPassword(cleanPass, admin.password_hash) : false;
      if (!admin || !admin.is_active || !passwordOk) {
        return json({ message: "Invalid credentials" }, 401);
      }

      adminId = admin.id;
      const role = (admin as any).admin_roles;
      roleName = role?.name || "admin";
      permissions = role?.permissions || { "*": true };

      await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", admin.id);
    } catch {
      return json({ message: "Invalid credentials" }, 401);
    }
  }

  if (!adminId) {
    return json({ message: "Invalid credentials" }, 401);
  }

  const accessToken = await new SignJWT({ role: roleName, permissions })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setExpirationTime(ACCESS_TTL)
    .sign(new TextEncoder().encode(env.JWT_SECRET));

  const refreshToken = await new SignJWT({ type: "refresh", role: roleName, isCfAdmin })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setExpirationTime(`${REFRESH_TTL_SECONDS}s`)
    .sign(new TextEncoder().encode(env.JWT_REFRESH_SECRET));

  const csrfToken = crypto.randomUUID();

  try {
    await supabase.from("audit_logs").insert({
      admin_id: adminId,
      action: "admin.login",
      ip_address: request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for"),
    });
  } catch {
    // Audit log failure is non-blocking
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", `session=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`);
  headers.append(
    "Set-Cookie",
    `refresh=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/admin/auth/refresh; Max-Age=${REFRESH_TTL_SECONDS}`
  );
  headers.append("Set-Cookie", `csrf_token=${csrfToken}; Secure; SameSite=Strict; Path=/; Max-Age=900`);

  return new Response(
    JSON.stringify({
      ok: true,
      token: accessToken,
      adminId,
      role: roleName,
      source: isCfAdmin ? "cloudflare_env" : "database",
    }),
    { headers }
  );
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
  let isCfAdmin = false;
  let roleName = "super_admin";
  let permissions: Record<string, boolean> = { "*": true };

  try {
    const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(env.JWT_REFRESH_SECRET));
    if (payload.type !== "refresh") throw new Error("wrong token type");
    adminId = payload.sub as string;
    isCfAdmin = payload.isCfAdmin === true || adminId === "00000000-0000-4000-8000-000000000001";
    if (payload.role) roleName = payload.role as string;
  } catch {
    const headers = new Headers({ "Content-Type": "application/json" });
    headers.append("Set-Cookie", "session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
    headers.append("Set-Cookie", "refresh=; HttpOnly; Secure; SameSite=Strict; Path=/admin/auth/refresh; Max-Age=0");
    return new Response(JSON.stringify({ message: "Refresh token invalid" }), { status: 401, headers });
  }

  if (isCfAdmin) {
    permissions = {
      "*": true,
      "tournaments.write": true,
      "registrations.moderate": true,
      "payments.verify": true,
      "registrations.export": true,
      "audit_logs.read": true,
    };
  } else {
    try {
      const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
      const { data: admin } = await supabase
        .from("admin_users")
        .select("id, is_active, admin_roles(name, permissions)")
        .eq("id", adminId)
        .single();

      if (!admin || !admin.is_active) return json({ message: "Account disabled" }, 401);
      const role = (admin as any).admin_roles;
      roleName = role?.name || roleName;
      permissions = role?.permissions || permissions;
    } catch {
      // Fallback
    }
  }

  const accessToken = await new SignJWT({ role: roleName, permissions })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setExpirationTime(ACCESS_TTL)
    .sign(new TextEncoder().encode(env.JWT_SECRET));

  const csrfToken = crypto.randomUUID();
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", `session=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`);
  headers.append("Set-Cookie", `csrf_token=${csrfToken}; Secure; SameSite=Strict; Path=/; Max-Age=900`);
  return new Response(JSON.stringify({ ok: true, token: accessToken }), { headers });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
