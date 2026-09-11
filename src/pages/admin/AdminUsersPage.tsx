import { useState } from "react";
import {
  useLiveUserManagement,
  banUserAndIp,
  revokeBanUser,
  approveChangeRequestWithTimeline,
  rejectChangeRequest,
  type UserRecord,
} from "@/lib/userManagementStore";
import { logAdminAction } from "@/lib/auditLogger";
import { Users, ShieldAlert, Check, X, Search, ShieldCheck, UserX, AlertTriangle, Key } from "lucide-react";

export default function AdminUsersPage() {
  const { users, requests, bannedIps } = useLiveUserManagement();
  const [activeTab, setActiveTab] = useState<"users" | "requests" | "banned_ips">("users");

  const [query, setQuery] = useState("");
  const [banModalUser, setBanModalUser] = useState<UserRecord | null>(null);
  const [banReason, setBanReason] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.inGameId.toLowerCase().includes(query.toLowerCase()) ||
      (u.ipAddress && u.ipAddress.includes(query))
  );

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banModalUser) return;

    banUserAndIp(banModalUser.id, banReason);
    logAdminAction("user.ban", "user_bans", `${banModalUser.email} (IP: ${banModalUser.ipAddress || "Unknown"})`);
    setBanModalUser(null);
    setBanReason("");
  };

  const handleRevokeBan = (u: UserRecord) => {
    if (confirm(`Revoke ban for user "${u.fullName}" (${u.email})?`)) {
      revokeBanUser(u.id);
      logAdminAction("user.unban", "user_bans", u.email);
    }
  };

  const handleApproveReq = (reqId: string, email: string, field: string, durationMinutes: number = 60) => {
    approveChangeRequestWithTimeline(reqId, durationMinutes);
    logAdminAction("permission_request.approve", "profile_change_requests", `${email} - Field: ${field} (Edit Window: ${durationMinutes} mins)`);
  };

  const handleRejectReq = (reqId: string, email: string) => {
    rejectChangeRequest(reqId);
    logAdminAction("permission_request.reject", "profile_change_requests", email);
  };

  return (
    <div className="space-y-6 max-w-6xl text-charcoal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
            <Users size={24} className="text-neon" /> Registered Users &amp; Permanent Ban Manager
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Manage player profiles, enforce permanent ID/IP bans, and approve sensitive field change permission requests.
          </p>
        </div>

        {/* Sub-tab Navigation Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "users" ? "bg-neon text-white shadow-glow" : "glass-card text-charcoal-muted hover:text-charcoal"
            }`}
          >
            Registered Users ({users.length})
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`relative rounded-2xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "requests" ? "bg-neon text-white shadow-glow" : "glass-card text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Key size={13} /> Permission Requests
            {pendingRequests.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-white font-mono text-[10px] font-black animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("banned_ips")}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "banned_ips" ? "bg-coral text-white shadow-glow" : "glass-card text-charcoal-muted hover:text-charcoal"
            }`}
          >
            Banned IPs ({bannedIps.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Registered Users */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="text"
                placeholder="Search name, email, IGN, or IP address..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm pl-10 pr-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
              />
            </div>
          </div>

          <div className="glass-card rounded-3xl p-4 shadow-glass-lg overflow-hidden border border-charcoal/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal/10 text-charcoal-muted font-mono uppercase font-bold">
                    <th className="py-3 px-4">Player / Gamer Name</th>
                    <th className="py-3 px-4">In-Game ID / Character UID</th>
                    <th className="py-3 px-4">Email &amp; Contact</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Ban / Revoke Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-charcoal/5 hover:bg-white/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-charcoal">
                        <div>{u.fullName}</div>
                        <div className="text-[10px] text-charcoal-muted font-mono">ID: {u.id}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-gold-warm">
                        {u.inGameId}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-charcoal">{u.email}</div>
                        <div className="text-[10px] text-charcoal-muted font-mono">{u.phone}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                        {u.ipAddress || "103.21.124.81"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                            u.status === "active"
                              ? "bg-neon-mint/10 border-neon-mint/30 text-neon-mint"
                              : "bg-coral/10 border-coral/30 text-coral"
                          }`}
                        >
                          {u.status === "active" ? "Active" : "Banned"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {u.status === "active" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setBanModalUser(u);
                              setBanReason("");
                            }}
                            className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-1 text-[11px] font-bold text-coral hover:bg-coral hover:text-white transition-all inline-flex items-center gap-1"
                          >
                            <UserX size={13} /> Permanent Ban
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRevokeBan(u)}
                            className="rounded-xl border border-neon/30 bg-neon/10 px-3 py-1 text-[11px] font-bold text-neon hover:bg-neon hover:text-white transition-all inline-flex items-center gap-1"
                          >
                            <ShieldCheck size={13} /> Revoke Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-charcoal-muted font-medium">
                        No registered users match your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Permission Change Requests */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-neon/30 bg-neon/5">
            <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-neon">
              <Key size={16} /> User Sensitive Profile Field Change Inbox
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              Users cannot edit sensitive fields (Email, In-Game Character UID, or Contact Number) directly without admin verification. Below are pending requests submitted by gamers.
            </p>
          </div>

          <div className="grid gap-4">
            {requests.map((r) => (
              <div key={r.id} className="glass-card rounded-3xl p-6 border border-charcoal/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal text-sm">{r.userName}</span>
                    <span className="text-xs text-charcoal-muted">({r.userEmail})</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                        r.status === "pending"
                          ? "bg-gold/10 border-gold/30 text-gold-warm"
                          : r.status === "approved"
                          ? "bg-neon-mint/10 border-neon-mint/30 text-neon-mint"
                          : "bg-coral/10 border-coral/30 text-coral"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <span className="text-charcoal-muted">Field: <strong>{r.fieldLabel}</strong></span>
                    <span className="text-coral">Current: <span className="line-through">{r.currentValue}</span></span>
                    <span className="text-neon font-bold">New Requested: {r.requestedValue}</span>
                  </div>

                  <p className="text-xs text-charcoal italic bg-ivory-warm p-2.5 rounded-xl border border-charcoal/5">
                    "Reason: {r.reason}"
                  </p>
                </div>

                {r.status === "pending" && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start md:self-auto">
                    <button
                      type="button"
                      onClick={() => handleApproveReq(r.id, r.userEmail, r.fieldLabel, 60)}
                      className="rounded-2xl bg-neon px-3.5 py-2 text-xs font-bold text-white shadow-glow hover:scale-105 transition-transform flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} /> Approve (1 Hour Edit Window)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveReq(r.id, r.userEmail, r.fieldLabel, 15)}
                      className="rounded-2xl border border-neon/30 bg-neon/10 px-3 py-2 text-xs font-bold text-neon hover:bg-neon hover:text-white transition-colors"
                      title="Grant 15 Mins Edit Window"
                    >
                      15 Mins Window
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectReq(r.id, r.userEmail)}
                      className="rounded-2xl border border-coral/30 bg-coral/10 px-3.5 py-2 text-xs font-bold text-coral hover:bg-coral hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {requests.length === 0 && (
              <div className="glass-card rounded-3xl p-12 text-center text-charcoal-muted text-xs">
                No user profile change requests currently in inbox.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Banned IPs List */}
      {activeTab === "banned_ips" && (
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-4 shadow-glass-lg border border-coral/20">
            <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-coral mb-3">
              <ShieldAlert size={16} /> Permanently Blacklisted IP Addresses
            </div>
            <div className="space-y-2">
              {bannedIps.map((b, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl bg-white/60 p-3 text-xs border border-charcoal/5">
                  <div>
                    <span className="font-mono font-bold text-coral block text-sm">{b.ip}</span>
                    <span className="text-charcoal-muted text-[11px]">{b.reason}</span>
                  </div>
                  <span className="text-[10px] font-mono text-charcoal-muted">
                    Banned: {new Date(b.bannedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Permanent Ban Confirmation Modal */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl glass-card p-6 text-charcoal space-y-4 shadow-glass-xl border border-coral/30">
            <div className="flex items-center gap-2 text-coral font-bold font-display uppercase">
              <AlertTriangle size={20} /> Permanent Account &amp; IP Ban
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed">
              Are you sure you want to permanently ban <strong>{banModalUser.fullName}</strong> ({banModalUser.email})?
              This will block their User ID and IP Address (<strong>{banModalUser.ipAddress || "103.21.124.81"}</strong>) from accessing the platform.
            </p>

            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Reason for Ban *</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Violation of Anti-Cheat rules / unauthorized emulator match entry"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2.5 text-xs text-charcoal outline-none focus:border-coral font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-charcoal/10">
              <button
                type="button"
                onClick={() => setBanModalUser(null)}
                className="rounded-2xl border border-charcoal/10 px-4 py-2 text-xs font-bold text-charcoal-muted hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                className="rounded-2xl bg-coral px-5 py-2 text-xs font-bold text-white shadow-glow hover:bg-coral/90"
              >
                Confirm Ban User &amp; IP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
