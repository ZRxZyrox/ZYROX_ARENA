import { jwtVerify } from "jose";
import type { Env } from "../index";

export interface AdminSession {
  adminId: string;
  role: string;
  permissions: Record<string, boolean>;
}

// Verifies the `session` HttpOnly cookie as a JWT. Attaches the decoded
// session to request context for downstream handlers via a WeakMap
// (Workers-safe way to pass per-request data without mutating globals).
const sessionStore = new WeakMap<Request, AdminSession>();

export async function requireAdmin(request: Request, env: Env): Promise<Response | undefined> {
  const cookieHeader = request.headers.get("Cookie") || "";
  const token = /session=([^;]+)/.exec(cookieHeader)?.[1];

  if (!token) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(env.JWT_SECRET));
    sessionStore.set(request, {
      adminId: payload.sub as string,
      role: payload.role as string,
      permissions: (payload.permissions as Record<string, boolean>) ?? {},
    });
    return undefined; // continue
  } catch {
    // Expired or tampered token — short-lived access tokens mean this is
    // expected fairly often; the frontend should call the refresh
    // endpoint and retry rather than treating this as fatal.
    return new Response(JSON.stringify({ message: "Session expired" }), { status: 401 });
  }
}

export function getSession(request: Request): AdminSession | undefined {
  return sessionStore.get(request);
}

// Use inside route handlers for role-based permission checks, e.g.:
//   if (!hasPermission(request, "payments.verify")) return forbidden();
export function hasPermission(request: Request, permission: string): boolean {
  return sessionStore.get(request)?.permissions?.[permission] === true;
}
