import { useState, useEffect } from "react";
import { X, Trophy, FileText } from "lucide-react";

export interface RequiredFormFields {
  requireTeamName: boolean;
  requirePhone: boolean;
  requireDiscordId: boolean;
  requireTeammates: boolean;
  minTeammatesCount: number;
}

export interface TournamentFormData {
  id?: string;
  title: string;
  slug: string;
  game: string;
  game_slug: string;
  mode: "solo" | "squad" | "duo";
  entry_fee: number;
  prize_pool_display: string;
  max_slots: number;
  status: "upcoming" | "reg_open" | "live" | "completed";
  banner_variant: "b1" | "b2" | "b3";
  published: boolean;
  rules?: string;
  requiredFields?: RequiredFormFields;
}

const DEFAULT_REQUIRED_FIELDS: RequiredFormFields = {
  requireTeamName: true,
  requirePhone: true,
  requireDiscordId: false,
  requireTeammates: true,
  minTeammatesCount: 3,
};

interface TournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TournamentFormData) => Promise<void>;
  initialData?: TournamentFormData | null;
}

export default function TournamentModal({ isOpen, onClose, onSubmit, initialData }: TournamentModalProps) {
  const [formData, setFormData] = useState<TournamentFormData>({
    title: "",
    slug: "",
    game: "BGMI",
    game_slug: "bgmi",
    mode: "squad",
    entry_fee: 100,
    prize_pool_display: "₹1,00,000",
    max_slots: 100,
    status: "reg_open",
    banner_variant: "b1",
    published: true,
    rules: "Standard Zyrox Arena Fair Play & Anti-Cheat rules apply.",
    requiredFields: DEFAULT_REQUIRED_FIELDS,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        requiredFields: initialData.requiredFields ?? DEFAULT_REQUIRED_FIELDS,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        game: "BGMI",
        game_slug: "bgmi",
        mode: "squad",
        entry_fee: 100,
        prize_pool_display: "₹1,00,000",
        max_slots: 100,
        status: "reg_open",
        banner_variant: "b1",
        published: true,
        rules: "Standard Zyrox Arena Fair Play & Anti-Cheat rules apply.",
        requiredFields: DEFAULT_REQUIRED_FIELDS,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setFormData((prev) => ({ ...prev, title, slug: initialData ? prev.slug : slug }));
  };

  const handleFieldToggle = (key: keyof RequiredFormFields, value: any) => {
    setFormData((prev) => ({
      ...prev,
      requiredFields: {
        ...(prev.requiredFields ?? DEFAULT_REQUIRED_FIELDS),
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!formData.title.trim()) throw new Error("Tournament title is required.");
      if (!formData.slug.trim()) throw new Error("URL slug is required.");
      if (formData.entry_fee < 0) throw new Error("Entry fee cannot be negative.");
      if (formData.max_slots < 2) throw new Error("Max slots must be at least 2.");
      if (!formData.prize_pool_display.trim()) throw new Error("Prize pool display string is required.");

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save tournament");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-md px-4 overflow-y-auto py-10">
      <div className="relative w-full max-w-2xl rounded-3xl glass-card p-6 md:p-8 shadow-glass-xl text-charcoal max-h-[90vh] overflow-y-auto border border-charcoal/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-charcoal-muted hover:bg-charcoal/5 hover:text-charcoal transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon via-gold to-coral text-white shadow-warm">
            <Trophy size={18} />
          </span>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-charcoal">
            {initialData ? "Edit Tournament" : "Create New Tournament"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Tournament Title *</label>
            <input
              type="text" required placeholder="e.g. BGMI Pro Championship Season 1"
              value={formData.title} onChange={handleTitleChange}
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-sm text-charcoal outline-none focus:border-neon font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">URL Slug *</label>
              <input
                type="text" required placeholder="bgmi-pro-championship"
                value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Game Category *</label>
              <select
                value={formData.game}
                onChange={(e) => {
                  const game = e.target.value;
                  const game_slug = game.toLowerCase().replace(/\s+/g, "");
                  setFormData({ ...formData, game, game_slug });
                }}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-semibold cursor-pointer"
              >
                <option value="BGMI">BGMI</option>
                <option value="Free Fire">Free Fire</option>
                <option value="Valorant">Valorant</option>
                <option value="FC">FC (EA Sports)</option>
                <option value="Cricket">Cricket 24</option>
                <option value="Call of Duty">Call of Duty Mobile</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Format *</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-semibold cursor-pointer"
              >
                <option value="squad">Squad</option>
                <option value="solo">Solo</option>
                <option value="duo">Duo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Entry Fee (₹) *</label>
              <input
                type="number" required min={0}
                value={formData.entry_fee} onChange={(e) => setFormData({ ...formData, entry_fee: Number(e.target.value) })}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Prize Pool Display *</label>
              <input
                type="text" required placeholder="₹1,50,000"
                value={formData.prize_pool_display} onChange={(e) => setFormData({ ...formData, prize_pool_display: e.target.value })}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-gold-warm outline-none focus:border-gold font-bold"
              />
            </div>
          </div>

          {/* Form Builder Section (Like Google Forms Config) */}
          <div className="rounded-2xl border border-neon/30 bg-neon/5 p-4 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-neon uppercase">
              <FileText size={15} /> Form Builder: Configure Required Player Fields
            </div>
            <p className="text-[11px] text-charcoal-muted">
              Select which fields players must fill when registering for this tournament (Google Forms style).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiredFields?.requireTeamName}
                  onChange={(e) => handleFieldToggle("requireTeamName", e.target.checked)}
                  className="rounded accent-neon"
                />
                Require Team Name
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiredFields?.requirePhone}
                  onChange={(e) => handleFieldToggle("requirePhone", e.target.checked)}
                  className="rounded accent-neon"
                />
                Require Phone Number
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiredFields?.requireDiscordId}
                  onChange={(e) => handleFieldToggle("requireDiscordId", e.target.checked)}
                  className="rounded accent-neon"
                />
                Require Discord Handle
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiredFields?.requireTeammates}
                  onChange={(e) => handleFieldToggle("requireTeammates", e.target.checked)}
                  className="rounded accent-neon"
                />
                Require Teammates Roster
              </label>

              {formData.requiredFields?.requireTeammates && (
                <div className="col-span-2 flex items-center gap-2 text-xs font-mono text-charcoal-muted">
                  <span>Min Teammates:</span>
                  <select
                    value={formData.requiredFields?.minTeammatesCount}
                    onChange={(e) => handleFieldToggle("minTeammatesCount", Number(e.target.value))}
                    className="rounded-xl border border-charcoal/10 bg-ivory-warm px-2 py-1 text-xs font-bold text-charcoal"
                  >
                    <option value={1}>1 Teammate (Duo/Trio)</option>
                    <option value={2}>2 Teammates</option>
                    <option value={3}>3 Teammates (4-Player Squad)</option>
                    <option value={4}>4 Teammates (5-Player Roster)</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Max Team Slots *</label>
              <input
                type="number" required min={2}
                value={formData.max_slots} onChange={(e) => setFormData({ ...formData, max_slots: Number(e.target.value) })}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-semibold cursor-pointer"
              >
                <option value="reg_open">Registrations Open</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live Now</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Banner Variant *</label>
              <select
                value={formData.banner_variant}
                onChange={(e) => setFormData({ ...formData, banner_variant: e.target.value as any })}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-semibold cursor-pointer"
              >
                <option value="b1">Neon Cyber (b1)</option>
                <option value="b2">Gold Champion (b2)</option>
                <option value="b3">Fire Crimson (b3)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-charcoal-muted mb-1 font-bold">Tournament Rules &amp; Notes</label>
            <textarea
              rows={3}
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2.5 text-xs text-charcoal outline-none focus:border-neon"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 rounded border-charcoal/20 accent-neon cursor-pointer"
            />
            <label htmlFor="published" className="text-xs text-charcoal cursor-pointer font-bold">
              Publish immediately on public website
            </label>
          </div>

          {error && <p className="text-xs text-coral font-bold mt-1">{error}</p>}

          <div className="flex gap-3 pt-4 border-t border-charcoal/8">
            <button
              type="button" onClick={onClose}
              className="w-1/2 rounded-2xl border border-charcoal/10 py-3 text-xs font-bold text-charcoal-muted hover:text-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="w-1/2 shimmer-btn rounded-2xl py-3 text-xs font-bold text-white shadow-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? "Saving…" : initialData ? "Update Tournament" : "Create Tournament"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
