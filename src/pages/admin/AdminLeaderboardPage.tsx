import { useState } from "react";
import { useLiveLeaderboard, type LeaderboardItem } from "@/lib/leaderboardStore";
import { logAdminAction } from "@/lib/auditLogger";
import { Award, Plus, Trash2, Edit3, ArrowUp, ArrowDown, Save, Check, X, ShieldCheck } from "lucide-react";

export default function AdminLeaderboardPage() {
  const { leaderboard, updateLeaderboard } = useLiveLeaderboard();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [wins, setWins] = useState(10);
  const [earnings, setEarnings] = useState("₹1,00,000");
  const [game, setGame] = useState("BGMI");

  const openNewModal = () => {
    setEditingId(null);
    setName("");
    setWins(10);
    setEarnings("₹1,00,000");
    setGame("BGMI");
    setModalOpen(true);
  };

  const openEditModal = (item: LeaderboardItem) => {
    setEditingId(item.id);
    setName(item.name);
    setWins(item.wins);
    setEarnings(item.earnings);
    setGame(item.game);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const updated = leaderboard.map((item) =>
        item.id === editingId ? { ...item, name, wins, earnings, game } : item
      );
      updateLeaderboard(updated);
      logAdminAction("leaderboard.update", "season_leaderboard", editingId);
    } else {
      const newId = "lb-" + Date.now();
      const newItem: LeaderboardItem = {
        id: newId,
        rank: leaderboard.length + 1,
        name: name.trim(),
        wins,
        earnings: earnings.trim(),
        game,
      };
      updateLeaderboard([...leaderboard, newItem]);
      logAdminAction("leaderboard.create", "season_leaderboard", name);
    }

    setModalOpen(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id: string, teamName: string) => {
    if (confirm(`Remove team "${teamName}" from the Season Leaderboard?`)) {
      const filtered = leaderboard.filter((item) => item.id !== id);
      updateLeaderboard(filtered);
      logAdminAction("leaderboard.delete", "season_leaderboard", id);
    }
  };

  const moveRank = (index: number, direction: "up" | "down") => {
    const newItems = [...leaderboard];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    updateLeaderboard(newItems);
    logAdminAction("leaderboard.reorder", "season_leaderboard", "reordered");
  };

  return (
    <div className="space-y-6 max-w-5xl text-charcoal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
            <Award size={24} className="text-gold" /> Season Leaderboard Manager
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Edit top performing teams, wins, earnings, and ranking order displayed live on the homepage leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-bold text-neon font-mono bg-neon/10 border border-neon/30 px-3 py-1.5 rounded-full">
              <Check size={14} /> Updated Live!
            </span>
          )}
          <button
            type="button"
            onClick={openNewModal}
            className="shimmer-btn rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-glow flex items-center gap-2"
          >
            <Plus size={15} /> Add Top Performer
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl p-4 shadow-glass-lg border border-charcoal/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal/10 text-charcoal-muted font-mono uppercase font-bold">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Team / Player Name</th>
                <th className="py-3 px-4">Game</th>
                <th className="py-3 px-4">Tournament Wins</th>
                <th className="py-3 px-4">Total Earnings</th>
                <th className="py-3 px-4 text-right">Actions &amp; Order</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr key={item.id} className="border-b border-charcoal/5 hover:bg-white/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-charcoal">
                    #{item.rank}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-charcoal text-sm">
                    {item.name}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="rounded-full bg-neon/10 border border-neon/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-neon uppercase">
                      {item.game}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                    {item.wins} Wins
                  </td>

                  <td className="py-3.5 px-4 font-display font-bold text-sm text-gold-warm">
                    {item.earnings}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveRank(index, "up")}
                      className="p-1.5 rounded-xl border border-charcoal/10 bg-ivory-warm hover:bg-white text-charcoal disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === leaderboard.length - 1}
                      onClick={() => moveRank(index, "down")}
                      className="p-1.5 rounded-xl border border-charcoal/10 bg-ivory-warm hover:bg-white text-charcoal disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-xl border border-charcoal/10 bg-ivory-warm hover:bg-white text-charcoal"
                      title="Edit Entry"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 rounded-xl border border-coral/20 bg-coral/10 hover:bg-coral text-coral hover:text-white"
                      title="Delete Entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal-muted font-medium">
                    No leaderboard entries found. Click "+ Add Top Performer" to create one.
                  </td>
                </tr>
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
                <ShieldCheck size={18} className="text-gold" /> {editingId ? "Edit Leaderboard Entry" : "Add Leaderboard Entry"}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-charcoal-muted hover:text-charcoal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Team or Player Name *</label>
                <input
                  type="text" required placeholder="Team Soul Esports" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Game *</label>
                  <select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
                  >
                    <option value="BGMI">BGMI</option>
                    <option value="Valorant">Valorant</option>
                    <option value="Free Fire">Free Fire</option>
                    <option value="FC">FC</option>
                    <option value="Cricket">Cricket</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Wins Count *</label>
                  <input
                    type="number" required min={0} value={wins}
                    onChange={(e) => setWins(Number(e.target.value))}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Total Earnings *</label>
                  <input
                    type="text" required placeholder="₹4,20,000" value={earnings}
                    onChange={(e) => setEarnings(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-gold-warm outline-none focus:border-gold font-bold"
                  />
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
                  <Save size={14} /> {editingId ? "Save Entry Changes" : "Create Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
