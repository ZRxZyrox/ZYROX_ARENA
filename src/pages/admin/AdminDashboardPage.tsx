import { Link } from "react-router-dom";
import { Trophy, Users, IndianRupee, ShieldCheck, Plus, ArrowUpRight, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { useLiveSystemAlerts } from "@/lib/systemAlertStore";

export default function AdminDashboardPage() {
  const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "control-panel-dev";
  const { activeAlerts, resolveSystemAlert } = useLiveSystemAlerts();

  const stats = [
    { label: "Total Registered Teams", value: "3,214", icon: Users, change: "+14.2% this week", color: "text-neon" },
    { label: "Revenue Verified", value: "₹41,20,000", icon: IndianRupee, change: "100% Razorpay Verified", color: "text-gold" },
    { label: "Live Tournaments", value: "6 Active", icon: Trophy, change: "BGMI, Valorant, Free Fire", color: "text-charcoal" },
    { label: "Pending Verification", value: "18 Teams", icon: Clock, change: "Requires manual check", color: "text-coral" },
  ];

  const recentActivities = [
    { type: "registration", text: "Team 'Soul Esports' registered for Winter Circuit Finals", time: "5 mins ago", status: "Paid" },
    { type: "approval", text: "Team 'GodLike' approved for BGMI Showdown Season 4", time: "18 mins ago", status: "Approved" },
    { type: "tournament", text: "Created new tournament 'Free Fire Clash Cup'", time: "1 hour ago", status: "Published" },
    { type: "payment", text: "Razorpay Webhook verified payment ₹500 for Order #ORD-9821", time: "2 hours ago", status: "Verified" },
  ];

  return (
    <div className="space-y-8 text-charcoal">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-tight text-charcoal font-bold">Admin Control Overview</h1>
          <p className="text-xs text-charcoal-muted mt-1">Real-time tournament stats, team rosters, payment verifications, and platform security.</p>
        </div>
        <Link
          to={`/${ADMIN_PATH}/tournaments`}
          className="flex items-center gap-2 shimmer-btn rounded-2xl px-5 py-3 text-xs font-bold text-white shadow-glow hover:scale-105 transition-transform"
        >
          <Plus size={15} /> Create Tournament
        </Link>
      </div>

      {/* System Breakdown Alert Center Banner */}
      {activeAlerts.length > 0 && (
        <div className="glass-card rounded-3xl p-5 border border-coral/30 bg-coral/5 shadow-glass-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-coral">
              <ShieldAlert size={18} /> System Breakdown &amp; Spam Alert ({activeAlerts.length} Active Notice)
            </div>
            <Link to={`/${ADMIN_PATH}/audit-log`} className="text-xs font-bold text-coral underline hover:text-charcoal">
              View Audit Log →
            </Link>
          </div>

          <div className="space-y-2">
            {activeAlerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-2xl bg-white/80 p-3 text-xs border border-coral/20">
                <div>
                  <span className="font-bold text-charcoal">{alert.title}</span> — <span className="text-charcoal-muted">{alert.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => resolveSystemAlert(alert.id)}
                  className="rounded-xl border border-neon/30 bg-neon/10 px-2.5 py-1 text-[10px] font-bold text-neon hover:bg-neon hover:text-white transition-all flex-shrink-0"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-3xl p-6 shadow-glass space-y-2">
              <div className="flex items-center justify-between text-charcoal-muted">
                <span className="text-xs font-mono font-bold">{s.label}</span>
                <Icon size={18} className={s.color} />
              </div>
              <div className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-charcoal-muted font-mono flex items-center gap-1">
                <ShieldCheck size={12} className="text-neon" /> {s.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to={`/${ADMIN_PATH}/tournaments`}
          className="group glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-lg hover:border-gold/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <Trophy className="text-gold group-hover:scale-110 transition-transform" size={24} />
            <ArrowUpRight className="text-charcoal-muted group-hover:text-gold" size={18} />
          </div>
          <h3 className="font-display text-lg uppercase font-bold text-charcoal">Manage Brackets</h3>
          <p className="text-xs text-charcoal-muted mt-1">Create, edit, pause or publish tournament brackets and slot limits.</p>
        </Link>

        <Link
          to={`/${ADMIN_PATH}/registrations`}
          className="group glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-lg hover:border-neon/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <Users className="text-neon group-hover:scale-110 transition-transform" size={24} />
            <ArrowUpRight className="text-charcoal-muted group-hover:text-neon" size={18} />
          </div>
          <h3 className="font-display text-lg uppercase font-bold text-charcoal">Team Rosters &amp; CSV</h3>
          <p className="text-xs text-charcoal-muted mt-1">View captain details, teammate IGNs, verify payments and export CSVs.</p>
        </Link>

        <Link
          to={`/${ADMIN_PATH}/audit-log`}
          className="group glass-card rounded-3xl p-6 shadow-glass hover:shadow-glass-lg hover:border-coral/50 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <ShieldCheck className="text-coral group-hover:scale-110 transition-transform" size={24} />
            <ArrowUpRight className="text-charcoal-muted group-hover:text-coral" size={18} />
          </div>
          <h3 className="font-display text-lg uppercase font-bold text-charcoal">Security Audit Log</h3>
          <p className="text-xs text-charcoal-muted mt-1">Review admin action logs, IP history, 2FA logins and security events.</p>
        </Link>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card rounded-3xl p-6 shadow-glass space-y-4">
        <div className="flex items-center justify-between border-b border-charcoal/8 pb-3">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-charcoal">Recent System Activity</h3>
          <span className="text-xs font-mono text-neon font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> Real-time Sync Active
          </span>
        </div>

        <div className="space-y-2.5">
          {recentActivities.map((act, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-2xl bg-ivory-warm/70 p-3.5 text-xs border border-charcoal/5">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-neon animate-pulse" />
                <span className="text-charcoal font-medium">{act.text}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-charcoal-muted">{act.time}</span>
                <span className="rounded-full bg-gold/15 border border-gold/30 px-3 py-0.5 text-[10px] font-bold text-gold-warm">
                  {act.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
