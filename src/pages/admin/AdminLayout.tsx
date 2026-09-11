import { NavLink, Outlet, Link } from "react-router-dom";
import { Suspense } from "react";
import PageLoader from "@/components/ui/PageLoader";
import { adminApi } from "@/lib/admin-api";
import { LayoutDashboard, Swords, Users, MessageSquare, Sliders, ShieldAlert, LogOut, ExternalLink, ShieldCheck, Layers, Mail, UserCheck, Award, Ticket } from "lucide-react";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "control-panel-dev";

const NAV = [
  { label: "Dashboard", to: `/${ADMIN_PATH}`, icon: LayoutDashboard, exact: true },
  { label: "Hero Box & Banner", to: `/${ADMIN_PATH}/hero-box`, icon: Layers, exact: false },
  { label: "Tournaments & Games", to: `/${ADMIN_PATH}/tournaments`, icon: Swords, exact: false },
  { label: "Team Registrations", to: `/${ADMIN_PATH}/registrations`, icon: Users, exact: false },
  { label: "Registered Users & Bans", to: `/${ADMIN_PATH}/users`, icon: UserCheck, exact: false },
  { label: "Coupons & Vouchers", to: `/${ADMIN_PATH}/coupons`, icon: Ticket, exact: false },
  { label: "Notify Users", to: `/${ADMIN_PATH}/notify-users`, icon: Mail, exact: false },
  { label: "Leaderboard Manager", to: `/${ADMIN_PATH}/leaderboard`, icon: Award, exact: false },
  { label: "Website Reviews", to: `/${ADMIN_PATH}/reviews`, icon: MessageSquare, exact: false },
  { label: "Site Settings & Ticker", to: `/${ADMIN_PATH}/settings`, icon: Sliders, exact: false },
  { label: "Security Audit Log", to: `/${ADMIN_PATH}/audit-log`, icon: ShieldAlert, exact: false },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-ivory text-charcoal">
      {/* Sidebar */}
      <aside className="w-64 border-r border-charcoal/10 bg-ivory-warm/80 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-neon via-gold to-coral shadow-warm">
              <ShieldCheck size={18} className="text-white" />
            </span>
            <div>
              <div className="font-display text-base tracking-wide text-charcoal uppercase font-bold">ZYROX <span className="text-gradient-warm">HQ</span></div>
              <div className="text-[10px] font-mono text-neon font-bold uppercase">Admin Control Panel</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-neon text-white shadow-glow"
                        : "text-charcoal-muted hover:bg-white/10 hover:text-charcoal border border-transparent"
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-charcoal/10">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between rounded-2xl border border-charcoal/10 glass-card px-3.5 py-2.5 text-xs font-bold text-charcoal hover:border-neon transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={() => adminApi.logout().then(() => (window.location.href = `/${ADMIN_PATH}/login`))}
            className="w-full flex items-center gap-2 rounded-2xl border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-xs font-bold text-coral hover:bg-coral/20 transition-colors text-left"
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
