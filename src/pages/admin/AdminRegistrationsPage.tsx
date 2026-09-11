import { useState } from "react";
import { useLiveTeams, type TeamRegistration } from "@/lib/registrationStore";
import { logAdminAction } from "@/lib/auditLogger";
import { Download, Users, Search, X, Check, Edit3, Trash2, Plus, ShieldCheck } from "lucide-react";

export default function AdminRegistrationsPage() {
  const { registrations, addTeam, updateTeam, deleteTeam } = useLiveTeams();
  const [query, setQuery] = useState("");
  const [filterGame, setFilterGame] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [teamName, setTeamName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [game, setGame] = useState("BGMI");
  const [inGameId, setInGameId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"squad" | "solo" | "duo">("squad");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending_payment" | "failed">("paid");
  const [approvalStatus, setApprovalStatus] = useState<"approved" | "pending" | "rejected">("approved");

  const openNewModal = () => {
    setEditingId(null);
    setTeamName("");
    setPlayerName("");
    setGame("BGMI");
    setInGameId("");
    setEmail("");
    setPhone("");
    setMode("squad");
    setPaymentStatus("paid");
    setApprovalStatus("approved");
    setModalOpen(true);
  };

  const openEditModal = (r: TeamRegistration) => {
    setEditingId(r.id);
    setTeamName(r.team_name);
    setPlayerName(r.player_name);
    setGame(r.game || "BGMI");
    setInGameId(r.in_game_id);
    setEmail(r.email);
    setPhone(r.phone);
    setMode(r.mode || "squad");
    setPaymentStatus(r.payment_status);
    setApprovalStatus(r.approval_status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const teamTitle = teamName.trim() || "Team " + playerName;

    if (editingId) {
      updateTeam(editingId, {
        team_name: teamTitle,
        player_name: playerName,
        game,
        in_game_id: inGameId,
        email,
        phone,
        mode,
        payment_status: paymentStatus,
        approval_status: approvalStatus,
      });
      logAdminAction("team.update", "registrations", editingId);
    } else {
      addTeam({
        team_name: teamTitle,
        player_name: playerName,
        game,
        in_game_id: inGameId,
        email,
        phone,
        mode,
        payment_status: paymentStatus,
        approval_status: approvalStatus,
        amount_paise: 50000,
      });
      logAdminAction("team.create", "registrations", teamTitle);
    }
    setModalOpen(false);
  };

  const filtered = registrations.filter((r) => {
    const matchesGame = filterGame === "all" || r.game?.toLowerCase() === filterGame.toLowerCase();
    const matchesStatus = filterStatus === "all" || r.approval_status === filterStatus;
    const matchesSearch =
      !query ||
      r.player_name.toLowerCase().includes(query.toLowerCase()) ||
      r.team_name.toLowerCase().includes(query.toLowerCase()) ||
      r.in_game_id.toLowerCase().includes(query.toLowerCase());
    return matchesGame && matchesStatus && matchesSearch;
  });

  const exportCsv = () => {
    const headers = "ID,Team Name,Captain Name,Game,In Game ID,Email,Phone,Payment Status,Approval Status\n";
    const rows = registrations
      .map(
        (r) =>
          `"${r.id}","${r.team_name}","${r.player_name}","${r.game}","${r.in_game_id}","${r.email}","${r.phone}","${r.payment_status}","${r.approval_status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
            <Users size={22} className="text-neon" /> Team Registrations &amp; Approvals
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Approve, edit, or create team registrations. Approved teams appear automatically on the public website.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={openNewModal}
            className="shimmer-btn rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-glow flex items-center gap-1.5"
          >
            <Plus size={15} /> Add Manual Team
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-2xl border border-charcoal/10 glass-card px-4 py-2.5 text-xs font-bold text-charcoal hover:border-gold transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value)}
            className="rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2 text-xs font-bold text-charcoal outline-none focus:border-neon"
          >
            <option value="all">All Games</option>
            <option value="bgmi">BGMI</option>
            <option value="freefire">Free Fire</option>
            <option value="valorant">Valorant</option>
            <option value="fc">FC</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2 text-xs font-bold text-charcoal outline-none focus:border-neon"
          >
            <option value="all">All Approval Status</option>
            <option value="approved">Approved Only</option>
            <option value="pending">Pending Approval</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            placeholder="Search team, captain, or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm pl-10 pr-4 py-2 text-xs text-charcoal outline-none focus:border-neon font-medium"
          />
        </div>
      </div>

      {/* Registrations Table */}
      <div className="glass-card rounded-3xl p-4 shadow-glass-lg overflow-hidden border border-charcoal/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal-muted font-mono uppercase font-bold">
                <th className="py-3 px-4">Team Name</th>
                <th className="py-3 px-4">Captain &amp; In-Game ID</th>
                <th className="py-3 px-4">Game</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Approval</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal-muted font-medium">
                    No registrations match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-charcoal/5 hover:bg-white/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-charcoal">
                      <div>{r.team_name}</div>
                      <div className="text-[10px] text-charcoal-muted font-mono">{r.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-charcoal">{r.player_name}</div>
                      <div className="text-[10px] font-mono text-gold-warm font-bold">{r.in_game_id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="rounded-full bg-neon/10 border border-neon/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-neon uppercase">
                        {r.game}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                          r.payment_status === "paid"
                            ? "bg-neon-mint/10 border-neon-mint/30 text-neon-mint"
                            : "bg-gold/10 border-gold/30 text-gold-warm"
                        }`}
                      >
                        {r.payment_status === "paid" ? "Paid" : "Pending Payment"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                          r.approval_status === "approved"
                            ? "bg-neon-mint/10 border-neon-mint/30 text-neon-mint"
                            : r.approval_status === "rejected"
                            ? "bg-coral/10 border-coral/30 text-coral"
                            : "bg-gold/10 border-gold/30 text-gold-warm"
                        }`}
                      >
                        {r.approval_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.approval_status !== "approved" && (
                          <button
                            type="button"
                            onClick={() => {
                              updateTeam(r.id, { approval_status: "approved", payment_status: "paid" });
                              logAdminAction("team.approve", "registrations", r.id);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-neon text-white text-[10px] font-bold hover:scale-105 transition-transform"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openEditModal(r)}
                          className="p-1.5 rounded-xl border border-charcoal/10 bg-ivory-warm hover:bg-white text-charcoal"
                          title="Edit Team"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete team "${r.team_name}"?`)) {
                              deleteTeam(r.id);
                              logAdminAction("team.delete", "registrations", r.id);
                            }
                          }}
                          className="p-1.5 rounded-xl border border-coral/20 bg-coral/10 hover:bg-coral text-coral hover:text-white"
                          title="Delete Team"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl glass-card p-7 shadow-glass-xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <h2 className="font-display text-lg font-bold uppercase text-charcoal flex items-center gap-2">
                <ShieldCheck size={18} className="text-neon" /> {editingId ? "Edit Team Registration" : "Add Manual Team"}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-charcoal-muted hover:text-charcoal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Team Name *</label>
                  <input
                    type="text" required placeholder="GodLike Esports" value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Captain Name *</label>
                  <input
                    type="text" required placeholder="Vikramaditya" value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Game *</label>
                  <select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
                  >
                    <option value="BGMI">BGMI</option>
                    <option value="Free Fire">Free Fire</option>
                    <option value="Valorant">Valorant</option>
                    <option value="FC">FC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">In-Game Character ID *</label>
                  <input
                    type="text" required placeholder="5182940291 (Viper)" value={inGameId}
                    onChange={(e) => setInGameId(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Phone Number</label>
                  <input
                    type="text" placeholder="+91 9876543210" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Email Address</label>
                  <input
                    type="email" placeholder="captain@team.gg" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Approval Status</label>
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value as any)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
                  >
                    <option value="approved">Approved (Live on Web)</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-charcoal/10">
                <button
                  type="button" onClick={() => setModalOpen(false)}
                  className="rounded-2xl px-5 py-2.5 text-xs font-bold text-charcoal-muted hover:bg-charcoal/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shimmer-btn rounded-2xl px-6 py-2.5 text-xs font-bold text-white shadow-glow flex items-center gap-1.5"
                >
                  <Check size={14} /> {editingId ? "Save Team Changes" : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
