import { useState } from "react";
import { useSiteSettings } from "@/lib/siteSettingsStore";
import { logAdminAction } from "@/lib/auditLogger";
import { Sliders, Save, Check, Sparkles, Newspaper, Trophy, Users, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSiteSettings();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tickerText, setTickerText] = useState(settings.tickerText);
  const [paidOutAmount, setPaidOutAmount] = useState(settings.paidOutAmount);
  const [activePlayersCount, setActivePlayersCount] = useState(settings.activePlayersCount);
  const [liveEventsCount, setLiveEventsCount] = useState(settings.liveEventsCount);
  const [announcementBanner, setAnnouncementBanner] = useState(settings.announcementBanner);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerText.trim()) {
      setError("Ticker text cannot be empty.");
      return;
    }
    if (!paidOutAmount.trim() || !activePlayersCount.trim() || !liveEventsCount.trim()) {
      setError("Global website numbers (Hero stats) cannot be empty.");
      return;
    }

    setError(null);
    updateSettings({
      tickerText,
      paidOutAmount,
      activePlayersCount,
      liveEventsCount,
      announcementBanner,
    });
    logAdminAction("site_settings.update", "site_settings", "global");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-charcoal/10 pb-5">
        <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
          <Sliders size={22} className="text-neon" /> Site Settings &amp; Moving Ticker Manager
        </h1>
        <p className="text-xs text-charcoal-muted mt-1 font-medium">
          Edit global website numbers, hero stats, top scrolling black ticker text, and live announcement banners.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-coral/10 border border-coral/30 p-4 text-xs font-bold text-coral flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Top Moving Ticker Section */}
        <div className="glass-card rounded-3xl p-7 space-y-4 border border-charcoal/10">
          <div className="flex items-center gap-2 font-display text-lg font-bold uppercase text-charcoal">
            <Newspaper size={18} className="text-gold" /> Top Moving Black Ticker Line
          </div>
          <p className="text-xs text-charcoal-muted font-medium">
            This text scrolls continuously across the black ticker bar at the top of the website below the taskbar.
          </p>
          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5">Ticker Line Text *</label>
            <textarea
              rows={3}
              required
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-3 text-xs text-charcoal font-medium outline-none focus:border-neon"
            />
          </div>
        </div>

        {/* Hero Stats Section */}
        <div className="glass-card rounded-3xl p-7 space-y-5 border border-charcoal/10">
          <div className="flex items-center gap-2 font-display text-lg font-bold uppercase text-charcoal">
            <Sparkles size={18} className="text-neon" /> Global Website Numbers &amp; Hero Stats
          </div>
          <p className="text-xs text-charcoal-muted font-medium">
            Edit the numbers displayed across the homepage hero banner and statistics widgets.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5 flex items-center gap-1">
                <Trophy size={13} className="text-gold" /> Total Paid Out Stat
              </label>
              <input
                type="text"
                required
                value={paidOutAmount}
                onChange={(e) => setPaidOutAmount(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal font-bold outline-none focus:border-neon"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5 flex items-center gap-1">
                <Users size={13} className="text-neon" /> Registered Players Stat
              </label>
              <input
                type="text"
                required
                value={activePlayersCount}
                onChange={(e) => setActivePlayersCount(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal font-bold outline-none focus:border-neon"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5 flex items-center gap-1">
                <ShieldCheck size={13} className="text-coral" /> Total Events Stat
              </label>
              <input
                type="text"
                required
                value={liveEventsCount}
                onChange={(e) => setLiveEventsCount(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal font-bold outline-none focus:border-neon"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="glass-card rounded-3xl p-7 space-y-4 border border-charcoal/10">
          <div className="flex items-center gap-2 font-display text-lg font-bold uppercase text-charcoal">
            <Newspaper size={18} className="text-coral" /> Highlighted Announcement Banner
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5">Banner Text</label>
            <input
              type="text"
              required
              value={announcementBanner}
              onChange={(e) => setAnnouncementBanner(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal font-medium outline-none focus:border-neon"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-neon font-mono bg-neon/10 border border-neon/30 px-3.5 py-1.5 rounded-full">
              <Check size={14} /> Site Settings &amp; Ticker Updated Live!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto shimmer-btn rounded-2xl px-7 py-3 text-xs font-bold text-white shadow-glow flex items-center gap-2"
          >
            <Save size={15} /> Save All Website Changes
          </button>
        </div>
      </form>
    </div>
  );
}
