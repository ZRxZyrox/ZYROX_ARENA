import { useState, useMemo } from "react";
import { adminApi } from "@/lib/admin-api";
import { supabase } from "@/lib/supabase";
import { logAdminAction } from "@/lib/auditLogger";
import TournamentModal, { type TournamentFormData } from "@/components/admin/TournamentModal";
import { useLiveTournaments, saveTournamentsToStore, type TournamentRecord } from "@/lib/tournamentStore";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search, Filter, AlertTriangle } from "lucide-react";

export default function AdminTournamentsPage() {
  const { tournaments, loading, setTournaments } = useLiveTournaments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<TournamentRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                            t.slug.toLowerCase().includes(search.toLowerCase()) ||
                            t.game.toLowerCase().includes(search.toLowerCase());
      const matchesGame = selectedGame === "all" || t.game.toLowerCase() === selectedGame.toLowerCase() || t.game_slug.toLowerCase() === selectedGame.toLowerCase();
      const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
      return matchesSearch && matchesGame && matchesStatus;
    });
  }, [tournaments, search, selectedGame, selectedStatus]);

  async function togglePublish(t: TournamentRecord) {
    const updated = tournaments.map((x) => (x.id === t.id ? { ...x, published: !x.published } : x));
    setTournaments(updated);
    saveTournamentsToStore(updated);
    logAdminAction("tournament.toggle_publish", "tournaments", t.id);

    try {
      await (supabase.from("tournaments" as any) as any).update({ published: !t.published }).eq("id", t.id);
      await adminApi.updateTournament(t.id, { published: !t.published });
    } catch {
      // Keep local sync active
    }
  }

  async function handleDelete(id: string) {
    const updated = tournaments.filter((x) => x.id !== id);
    setTournaments(updated);
    saveTournamentsToStore(updated);
    setDeletingId(null);
    logAdminAction("tournament.delete", "tournaments", id);

    try {
      await (supabase.from("tournaments" as any) as any).delete().eq("id", id);
      await adminApi.updateTournament(id, { published: false });
    } catch {
      // Keep local sync active
    }
  }

  const handleSaveTournament = async (data: TournamentFormData) => {
    if (editingTournament) {
      const updatedRecord: TournamentRecord = { ...editingTournament, ...data };
      const updated = tournaments.map((item) => (item.id === editingTournament.id ? updatedRecord : item));
      setTournaments(updated);
      saveTournamentsToStore(updated);
      logAdminAction("tournament.update", "tournaments", editingTournament.id);

      try {
        await (supabase.from("tournaments" as any) as any).update({
          title: data.title,
          slug: data.slug,
          game_slug: data.game_slug,
          mode: data.mode,
          entry_fee: data.entry_fee,
          prize_pool_display: data.prize_pool_display,
          max_slots: data.max_slots,
          status: data.status,
          published: data.published,
          rules: data.rules,
        }).eq("id", editingTournament.id);
        await adminApi.updateTournament(editingTournament.id, data);
      } catch {
        // Keep local sync active
      }
    } else {
      const newId = `t-${Date.now()}`;
      const newRecord: TournamentRecord = { ...data, id: newId };
      const updated = [newRecord, ...tournaments];
      setTournaments(updated);
      saveTournamentsToStore(updated);
      logAdminAction("tournament.create", "tournaments", newId);

      try {
        await (supabase.from("tournaments" as any) as any).insert({
          id: newId,
          title: data.title,
          slug: data.slug,
          game_slug: data.game_slug,
          mode: data.mode,
          entry_fee: data.entry_fee,
          prize_pool_display: data.prize_pool_display,
          max_slots: data.max_slots,
          status: data.status,
          published: data.published,
          rules: data.rules,
        });
        await adminApi.createTournament(newRecord);
      } catch {
        // Keep local sync active
      }
    }
  };

  return (
    <div className="space-y-6 text-charcoal">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-tight text-charcoal font-bold">Tournament &amp; Game Management</h1>
          <p className="text-xs text-charcoal-muted mt-1">Real-time sync: Any edit or creation here instantly updates the live website.</p>
        </div>
        <button
          onClick={() => {
            setEditingTournament(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 shimmer-btn rounded-2xl px-5 py-3 text-xs font-bold text-white shadow-glow hover:scale-105 transition-transform"
        >
          <Plus size={16} /> Create New Tournament
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 text-charcoal-muted" size={15} />
          <input
            type="text"
            placeholder="Search tournament title or game..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl glass-card pl-9 pr-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
          />
        </div>

        {/* Game Filter */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-3 text-charcoal-muted" size={15} />
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full rounded-2xl glass-card pl-9 pr-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon appearance-none cursor-pointer font-bold"
          >
            <option value="all">All Esports Games</option>
            <option value="bgmi">BGMI</option>
            <option value="valorant">Valorant</option>
            <option value="freefire">Free Fire</option>
            <option value="fc">FC Pro League</option>
            <option value="cricket">Cricket</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-2xl glass-card px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon appearance-none cursor-pointer font-bold"
          >
            <option value="all">All Statuses</option>
            <option value="live">Live Now</option>
            <option value="reg_open">Registration Open</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft / Offline</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-sm text-charcoal-muted">Loading live tournaments…</p>}

      {!loading && (
        <div className="glass-card rounded-3xl p-4 shadow-glass overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-xs font-mono text-charcoal-muted uppercase">
                <th className="py-3 px-3 font-bold">Tournament Title</th>
                <th className="py-3 px-3 font-bold">Game</th>
                <th className="py-3 px-3 font-bold">Format</th>
                <th className="py-3 px-3 font-bold">Entry Fee</th>
                <th className="py-3 px-3 font-bold">Prize Pool</th>
                <th className="py-3 px-3 font-bold">Max Slots</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-3 font-bold">Publish</th>
                <th className="py-3 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/6">
              {filteredTournaments.map((t) => (
                <tr key={t.id} className="hover:bg-white/60 transition-colors text-xs">
                  <td className="py-3.5 px-3 font-bold text-charcoal">
                    {t.title}
                    <div className="text-[10px] text-charcoal-muted font-mono">{t.slug}</div>
                  </td>
                  <td className="py-3.5 px-3 text-charcoal font-bold">{t.game}</td>
                  <td className="py-3.5 px-3 uppercase text-charcoal-muted font-mono font-bold">{t.mode}</td>
                  <td className="py-3.5 px-3 text-charcoal font-mono font-bold">₹{t.entry_fee ?? 0}</td>
                  <td className="py-3.5 px-3 text-gold-warm font-bold">{t.prize_pool_display}</td>
                  <td className="py-3.5 px-3 text-charcoal font-mono font-bold">{t.max_slots} Teams</td>
                  <td className="py-3.5 px-3 capitalize">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      t.status === "live" ? "bg-coral/15 text-coral border border-coral/30" :
                      t.status === "reg_open" ? "bg-neon/15 text-neon border border-neon/30" : "bg-charcoal/10 text-charcoal-muted"
                    }`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => togglePublish(t)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                        t.published ? "bg-neon/15 text-neon border border-neon/30" : "bg-charcoal/10 text-charcoal-muted border border-charcoal/10"
                      }`}
                    >
                      {t.published ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {t.published ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingTournament(t);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-charcoal/10 px-3 py-1 text-xs font-bold text-charcoal hover:border-gold hover:text-gold transition-colors"
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(t.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-coral/30 bg-coral/10 px-3 py-1 text-xs font-bold text-coral hover:bg-coral/20 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTournaments.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-charcoal-muted">
                    No tournaments match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-md px-4">
          <div className="w-full max-w-sm rounded-3xl glass-card p-6 text-charcoal space-y-4 shadow-glass-xl">
            <div className="flex items-center gap-2 text-coral font-bold font-display uppercase">
              <AlertTriangle size={20} /> Delete Tournament Confirmation
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Are you sure you want to delete this tournament? This will immediately remove it from the live website.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-2xl border border-charcoal/10 px-4 py-2 text-xs font-bold text-charcoal-muted hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="rounded-2xl bg-coral px-4 py-2 text-xs font-bold text-white shadow-glow hover:bg-coral/90"
              >
                Delete Tournament
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <TournamentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTournament}
        initialData={editingTournament}
      />
    </div>
  );
}
