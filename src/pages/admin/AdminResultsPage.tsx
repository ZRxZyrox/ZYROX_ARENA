import { useState } from "react";
import { useLiveResults, TournamentResult } from "@/lib/resultsStore";
import { Trophy, Plus, Edit2, Trash2, CheckCircle2, Search, Medal } from "lucide-react";

export default function AdminResultsPage() {
  const { results, addResult, updateResult, deleteResult } = useLiveResults();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<TournamentResult | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    game: "BGMI",
    prizePool: "₹1,00,000",
    winner: "",
    runnerUp: "",
    thirdPlace: "",
    date: new Date().toISOString().split("T")[0],
    status: "Payout Complete" as TournamentResult["status"],
  });

  const handleOpenEdit = (item: TournamentResult) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData({
      title: item.title,
      game: item.game,
      prizePool: item.prizePool,
      winner: item.winner,
      runnerUp: item.runnerUp,
      thirdPlace: item.thirdPlace,
      date: item.date,
      status: item.status,
    });
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setFormData({
      title: "",
      game: "BGMI",
      prizePool: "₹1,00,000",
      winner: "",
      runnerUp: "",
      thirdPlace: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Payout Complete",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.winner.trim()) return;

    if (editingItem) {
      updateResult(editingItem.id, formData);
      setEditingItem(null);
    } else {
      addResult(formData);
      setIsCreating(false);
    }
  };

  const filtered = results.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.winner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl uppercase tracking-tight text-white font-bold flex items-center gap-2.5">
            <Trophy className="text-white" size={24} /> Tournament Results &amp; Payouts
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage completed tournament champion records, placements, and payout verification badges displayed on the public Results page.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="royal-btn royal-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} /> Add Tournament Result
        </button>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center gap-3 glass-card rounded-2xl p-3 border border-white/10">
        <Search size={16} className="text-neutral-400" />
        <input
          type="text"
          placeholder="Search results by tournament name, winner, or game..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-white text-xs placeholder:text-neutral-500 focus:outline-none flex-1"
        />
      </div>

      {/* Modal / Form for Create / Edit */}
      {(isCreating || editingItem) && (
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 border border-white/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Medal size={16} className="text-white" />
              {isCreating ? "Add New Tournament Result" : `Edit: ${editingItem?.title}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingItem(null);
              }}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Tournament Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. BGMI Showdown Season 4"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Game</label>
              <select
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                className="w-full rounded-xl bg-black border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              >
                <option value="BGMI">BGMI</option>
                <option value="Valorant">Valorant</option>
                <option value="Free Fire">Free Fire</option>
                <option value="FC">FC Mobile</option>
                <option value="Cricket">Cricket</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Prize Pool Display</label>
              <input
                type="text"
                required
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                placeholder="e.g. ₹2,00,000"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">🥇 1st Place (Champion)</label>
              <input
                type="text"
                required
                value={formData.winner}
                onChange={(e) => setFormData({ ...formData, winner: e.target.value })}
                placeholder="Winning Team Name"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">🥈 2nd Place (Runner-up)</label>
              <input
                type="text"
                required
                value={formData.runnerUp}
                onChange={(e) => setFormData({ ...formData, runnerUp: e.target.value })}
                placeholder="Runner-Up Team Name"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">🥉 3rd Place</label>
              <input
                type="text"
                required
                value={formData.thirdPlace}
                onChange={(e) => setFormData({ ...formData, thirdPlace: e.target.value })}
                placeholder="3rd Place Team Name"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Date</label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. Jan 20, 2026"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Payout Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-xl bg-black border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              >
                <option value="Payout Complete">Payout Complete</option>
                <option value="Under Verification">Under Verification</option>
                <option value="Processing">Processing</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="royal-btn royal-btn-primary px-5 py-2 text-xs font-bold"
            >
              {isCreating ? "Save & Publish Result" : "Update Result"}
            </button>
          </div>
        </form>
      )}

      {/* Results List */}
      <div className="grid gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold text-white">
                  {item.game}
                </span>
                <span className="font-mono text-[10px] text-neutral-400">{item.date}</span>
                <span className="flex items-center gap-1 rounded-full bg-white/10 text-white px-2 py-0.5 font-mono text-[10px] font-bold">
                  <CheckCircle2 size={11} /> {item.status}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
              <div className="grid grid-cols-3 gap-2 text-xs text-neutral-300 pt-1">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">1st Place</span>
                  <strong className="text-white font-semibold">🥇 {item.winner}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">2nd Place</span>
                  <strong className="text-neutral-200 font-semibold">🥈 {item.runnerUp}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">3rd Place</span>
                  <strong className="text-neutral-300 font-semibold">🥉 {item.thirdPlace}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <span className="font-display text-lg font-black text-white mr-2">{item.prizePool}</span>
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                title="Edit result"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete result for "${item.title}"?`)) {
                    deleteResult(item.id);
                  }
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                title="Delete result"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
