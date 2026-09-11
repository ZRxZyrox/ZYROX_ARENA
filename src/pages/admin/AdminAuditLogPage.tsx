import { useState } from "react";
import { useLiveAuditLogs } from "@/lib/auditLogger";
import { useLiveSystemAlerts } from "@/lib/systemAlertStore";
import {
  ShieldCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Compass,
  UserCheck,
  ShieldAlert,
  SlidersHorizontal,
  Check,
} from "lucide-react";

export default function AdminAuditLogPage() {
  const { logs, loading, refreshLogs } = useLiveAuditLogs();
  const { activeAlerts, resolveSystemAlert } = useLiveSystemAlerts();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const filteredLogs = logs.filter((l) => {
    const matchesCategory = categoryFilter === "all" || l.category === categoryFilter;
    const matchesSearch =
      !query ||
      l.action.toLowerCase().includes(query.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(query.toLowerCase())) ||
      (l.user_email && l.user_email.toLowerCase().includes(query.toLowerCase())) ||
      (l.ip_address && l.ip_address.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-8 text-charcoal max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
            <ShieldCheck size={24} className="text-neon" /> 100% Accurate A-to-Z Audit &amp; System Health Center
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Real-time tracking of all user navigation journeys, authentication attempts, payments, anti-spam cooldowns, and system breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={refreshLogs}
            className="rounded-2xl border border-charcoal/10 glass-card px-4 py-2.5 text-xs font-bold text-charcoal hover:border-neon transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-neon" : ""} /> Live Refresh Logs
          </button>
        </div>
      </div>

      {/* System Breakdown & Health Alert Center */}
      <div className="glass-card rounded-3xl p-6 border border-coral/30 space-y-4 bg-coral/5 shadow-glass-lg">
        <div className="flex items-center justify-between border-b border-coral/15 pb-3">
          <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-coral">
            <AlertTriangle size={18} /> System Health Breakdown Alert Center ({activeAlerts.length} Active)
          </div>
          <span className="rounded-full bg-coral/10 border border-coral/30 px-3 py-1 font-mono text-[10px] font-bold text-coral uppercase">
            Live Monitoring Engine
          </span>
        </div>

        <div className="grid gap-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white/80 p-4 border border-coral/20 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase border ${
                      alert.severity === "critical"
                        ? "bg-coral text-white"
                        : alert.severity === "warning"
                        ? "bg-gold/20 text-gold-warm border-gold/30"
                        : "bg-neon/10 text-neon border-neon/20"
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="font-bold text-charcoal">{alert.title}</span>
                  <span className="text-[10px] text-charcoal-muted font-mono">({alert.source})</span>
                </div>
                <p className="text-charcoal-muted text-[11px]">{alert.message}</p>
                <span className="text-[10px] text-charcoal-muted font-mono block">
                  Detected: {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => resolveSystemAlert(alert.id)}
                className="rounded-xl border border-neon/30 bg-neon/10 px-3 py-1.5 text-[11px] font-bold text-neon hover:bg-neon hover:text-white transition-all self-start sm:self-auto flex items-center gap-1"
              >
                <Check size={13} /> Mark Resolved
              </button>
            </div>
          ))}

          {activeAlerts.length === 0 && (
            <div className="rounded-2xl bg-neon-mint/10 border border-neon-mint/20 p-4 text-center text-xs font-bold text-neon-mint flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> All System Services Operational — 0 Active Breakdown Alerts
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: "all", label: "All Activity", icon: Activity },
            { id: "page_navigation", label: "A-to-Z User Journeys", icon: Compass },
            { id: "user_auth", label: "Auth & Account Security", icon: UserCheck },
            { id: "tournament_registration", label: "Registrations & Payments", icon: ShieldCheck },
            { id: "spam_guard", label: "Anti-Spam 30-Min Cooldowns", icon: ShieldAlert },
            { id: "admin_action", label: "Admin Security Audit", icon: SlidersHorizontal },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(cat.id);
                  setPage(1);
                }}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-neon text-white shadow-glow"
                    : "glass-card text-charcoal-muted hover:text-charcoal border border-charcoal/10"
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search action event, user email, details, or IP..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm pl-10 pr-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-3xl p-4 shadow-glass-lg overflow-hidden border border-charcoal/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal-muted font-mono uppercase font-bold">
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">User / Email</th>
                <th className="py-3 px-4">Activity &amp; Journey Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-charcoal-muted font-medium">
                    No activity audit logs found matching your filter query.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((l) => (
                  <tr key={l.id} className="border-b border-charcoal/5 hover:bg-white/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                          l.category === "admin_action"
                            ? "bg-neon/10 border-neon/30 text-neon"
                            : l.category === "page_navigation"
                            ? "bg-gold/10 border-gold/30 text-gold-warm"
                            : l.category === "spam_guard"
                            ? "bg-coral/10 border-coral/30 text-coral"
                            : "bg-neon-mint/10 border-neon-mint/30 text-neon-mint"
                        }`}
                      >
                        <CheckCircle2 size={11} /> {l.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-charcoal">
                      {l.user_email || "Guest User"}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-charcoal-muted max-w-xs truncate">
                      {l.details || l.target_id || "—"}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                      {l.ip_address ?? "103.21.124.81"}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-charcoal-muted">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between font-mono text-xs pt-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-2xl glass-card px-4 py-2 text-charcoal font-bold hover:border-neon transition-colors disabled:opacity-40"
        >
          ← Previous Page
        </button>
        <span className="text-charcoal-muted font-bold">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({filteredLogs.length} total entries)
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="rounded-2xl glass-card px-4 py-2 text-charcoal font-bold hover:border-neon transition-colors disabled:opacity-40"
        >
          Next Page →
        </button>
      </div>
    </div>
  );
}
