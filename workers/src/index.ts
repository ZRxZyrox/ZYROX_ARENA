import { Router } from "itty-router";
import { securityHeaders } from "./middleware/security-headers";
import { rateLimit } from "./middleware/rate-limit";
import { csrfCheck } from "./middleware/csrf";
import { handleAdminLogin, handleAdminLogout, handleAdminMe, handleAdminRefresh } from "./routes/admin-auth";
import {
  handleListTournaments,
  handleCreateTournament,
  handleUpdateTournament,
} from "./routes/admin-tournaments";
import {
  handleListRegistrations,
  handleApproveTeam,
  handleRejectTeam,
  handleVerifyPayment,
  handleExportRegistrations,
} from "./routes/admin-registrations";
import { handleListAuditLogs } from "./routes/admin-audit-logs";
import { handleCreateRegistration, handleRegistrationStatus } from "./routes/registrations";
import { handleCashfreeWebhook } from "./routes/cashfree-webhook";
import { requireAdmin } from "./middleware/require-admin";

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string; // secret — never sent to the client
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CASHFREE_APP_ID: string;
  CASHFREE_SECRET_KEY: string;      // secret
  CASHFREE_WEBHOOK_SECRET: string;  // secret — used to verify webhook signatures
  ALLOWED_ORIGIN: string;           // the public site's origin, for CORS
  ADMIN_EMAIL?: string;             // Cloudflare variable: master admin email (e.g. admin@zyroxarena.com)
  ADMIN_PASSWORD?: string;          // Cloudflare variable/secret: master admin password (can be changed anytime in Cloudflare!)
}

const router = Router();

// Health check endpoint for API root
router.get("/", () => {
  return new Response(
    JSON.stringify({
      status: "online",
      service: "Zyrox Arena API Worker",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});

// Public API — rate limited, no admin trust implied.
router.post("/api/registrations", rateLimit(20, "1m"), handleCreateRegistration);
router.get("/api/registrations/:orderId/status", handleRegistrationStatus);

// Cashfree webhook — signature-verified inside the handler itself.
router.post("/api/webhooks/cashfree", handleCashfreeWebhook);

// Admin API
router.post("/admin/auth/login", rateLimit(5, "10m"), handleAdminLogin);
router.post("/admin/auth/logout", requireAdmin, handleAdminLogout);
router.get("/admin/auth/me", requireAdmin, handleAdminMe);
router.post("/admin/auth/refresh", rateLimit(20, "10m"), handleAdminRefresh);

// Tournaments
router.get("/admin/tournaments", requireAdmin, handleListTournaments);
router.post("/admin/tournaments", requireAdmin, csrfCheck, handleCreateTournament);
router.patch("/admin/tournaments/:id", requireAdmin, csrfCheck, handleUpdateTournament);

// Registrations / teams / payments
router.get("/admin/tournaments/:id/registrations", requireAdmin, handleListRegistrations);
router.post("/admin/teams/:id/approve", requireAdmin, csrfCheck, handleApproveTeam);
router.post("/admin/teams/:id/reject", requireAdmin, csrfCheck, handleRejectTeam);
router.post("/admin/registrations/:id/verify-payment", requireAdmin, csrfCheck, handleVerifyPayment);
router.post("/admin/tournaments/:id/export", requireAdmin, csrfCheck, handleExportRegistrations);

// Audit log
router.get("/admin/audit-logs", requireAdmin, handleListAuditLogs);

router.all("*", () => new Response("Not found", { status: 404 }));

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === "OPTIONS") {
      const origin = request.headers.get("Origin") || env.ALLOWED_ORIGIN || "*";
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-CSRF-Token",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const response = await router.handle(request, env, ctx).catch((err: Error) => {
      console.error("Unhandled error:", err);
      return new Response(JSON.stringify({ message: "Internal error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    });
    return securityHeaders(response, env, request);
  },
};
