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
  let token = /session=([^;]+)/.exec(cookieHeader)?.[1];

  if (!token) {
    const authHeader = request.headers.get("Authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(env.JWT_SECRET));
    const role = (payload.role as string) || "admin";
    const rawPermissions = (payload.permissions as Record<string, boolean>) ?? {};

    sessionStore.set(request, {
      adminId: payload.sub as string,
      role,
      permissions: rawPermissions,
    });
    return undefined; // continue
  } catch {
    // Expired or tampered token
    return new Response(JSON.stringify({ message: "Session expired" }), { status: 401 });
  }
}

export function getSession(request: Request): AdminSession | undefined {
  return sessionStore.get(request);
}

// Use inside route handlers for role-based permission checks, e.g.:
//   if (!hasPermission(request, "payments.verify")) return forbidden();
export function hasPermission(request: Request, permission: string): boolean {
  const session = sessionStore.get(request);
  if (!session) return false;
  if (session.role === "super_admin" || session.permissions?.["*"] === true) return true;
  return session.permissions?.[permission] === true;
}
