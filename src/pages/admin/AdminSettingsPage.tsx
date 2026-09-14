import { useState } from "react";
import { useSiteSettings, PlatformGuarantee, HowItWorksStep } from "@/lib/siteSettingsStore";
import { logAdminAction } from "@/lib/auditLogger";
import {
  Sliders,
  Save,
  Check,
  Sparkles,
  Newspaper,
  ShieldCheck,
  AlertCircle,
  Mail,
  Zap,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSiteSettings();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tickerText, setTickerText] = useState(settings.tickerText);
  const [paidOutAmount, setPaidOutAmount] = useState(settings.paidOutAmount);
  const [activePlayersCount, setActivePlayersCount] = useState(settings.activePlayersCount);
  const [liveEventsCount, setLiveEventsCount] = useState(settings.liveEventsCount);
  const [announcementBanner, setAnnouncementBanner] = useState(settings.announcementBanner);

  // Social & Contact
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || "zyroxstudioz@gmail.com");
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone || "+91 98765 43210");
  const [discordUrl, setDiscordUrl] = useState(settings.discordUrl || "https://discord.gg/zyroxarena");
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || "https://instagram.com/zyroxarena");
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || "https://youtube.com/@zyroxarena");
  const [whatsappSupportNumber, setWhatsappSupportNumber] = useState(settings.whatsappSupportNumber || "+91 98765 43210");

  // Platform Guarantees
  const [guarantees, setGuarantees] = useState<PlatformGuarantee[]>(settings.guarantees || []);

  // How It Works Steps
  const [howItWorks, setHowItWorks] = useState<HowItWorksStep[]>(settings.howItWorks || []);

  const handleGuaranteeChange = (idx: number, field: keyof PlatformGuarantee, val: string) => {
    const updated = [...guarantees];
    updated[idx] = { ...updated[idx], [field]: val };
    setGuarantees(updated);
  };

  const handleStepChange = (idx: number, field: keyof HowItWorksStep, val: string) => {
    const updated = [...howItWorks];
    updated[idx] = { ...updated[idx], [field]: val };
    setHowItWorks(updated);
  };

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
      supportEmail,
      supportPhone,
      discordUrl,
      instagramUrl,
      youtubeUrl,
      whatsappSupportNumber,
      guarantees,
      howItWorks,
    });
    logAdminAction("site_settings.update", "site_settings", "global");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="font-display text-2xl font-bold uppercase text-white flex items-center gap-2">
          <Sliders size={22} className="text-white" /> Global Platform &amp; Content Controls
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-medium">
          Edit global site numbers, guarantees, how-it-works steps, social media handles, ticker text, and support contacts.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-xs font-bold text-red-400 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Top Moving Ticker Section */}
        <div className="glass-card rounded-3xl p-6 space-y-3 border border-white/10">
          <div className="flex items-center gap-2 font-display text-base font-bold uppercase text-white">
            <Newspaper size={17} className="text-white" /> Top Moving Ticker Bar
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            This text scrolls continuously across the moving bar at the top of the website.
          </p>
          <div>
            <textarea
              rows={2}
              required
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Global Numbers */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border border-white/10">
          <div className="flex items-center gap-2 font-display text-base font-bold uppercase text-white">
            <Sparkles size={17} className="text-white" /> Website Stats &amp; Counters
          </div>
          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Total Paid Out Stat</label>
              <input
                type="text"
                required
                value={paidOutAmount}
                onChange={(e) => setPaidOutAmount(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white font-bold outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Registered Players</label>
              <input
                type="text"
                required
                value={activePlayersCount}
                onChange={(e) => setActivePlayersCount(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white font-bold outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Total Events Live</label>
              <input
                type="text"
                required
                value={liveEventsCount}
                onChange={(e) => setLiveEventsCount(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white font-bold outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* Highlighted Announcement Banner */}
        <div className="glass-card rounded-3xl p-6 space-y-3 border border-white/10">
          <div className="flex items-center gap-2 font-display text-base font-bold uppercase text-white">
            <Newspaper size={17} className="text-white" /> Hero Announcement Capsule
          </div>
          <div>
            <input
              type="text"
              required
              value={announcementBanner}
              onChange={(e) => setAnnouncementBanner(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Global Contact Info & Socials */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border border-white/10">
          <div className="flex items-center gap-2 font-display text-base font-bold uppercase text-white">
            <Mail size={17} className="text-white" /> Contact Info &amp; Community Social Channels
          </div>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Support WhatsApp / Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Discord Invite URL</label>
              <input
                type="text"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">Instagram URL</label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1">WhatsApp Support Number</label>
              <input
                type="text"
                value={whatsappSupportNumber}
                onChange={(e) => setWhatsappSupportNumber(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* Platform Guarantees ("Why ZYROX ARENA") */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border border-white/10">
          <div className="flex items-center gap-2 font-display text-base font-bold uppercase text-white">
            <ShieldCheck size={17} className="text-white" /> "Why ZYROX ARENA" Guarantees
          </div>
          <p className="text-xs text-neutral-400">
            Control the 4 feature cards on the Homepage.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {guarantees.map((item, idx) => (
              <div key={item.id || idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs">
                <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase">Card #{idx + 1}</span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleGuaranteeChange(idx, "title", e.target.value)}
                  placeholder="Card Title"
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-white font-bold outline-none"
                />
                <input
                  type="text"
                  value={item.desc}
                  onChange={(e) => handleGuaranteeChange(idx, "desc", e.target.value)}
                  placeholder="Card Description"
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-neutral-300 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* "How It Works" Steps */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border border-white/10">
          <div className="flex items-center gap-2 font-display text-base font-bold uppercase text-white">
            <Zap size={17} className="text-white" /> "How It Works" Steps
          </div>
          <p className="text-xs text-neutral-400">
            Control the 4 registration workflow steps on the Homepage.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {howItWorks.map((step, idx) => (
              <div key={step.step || idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs">
                <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase">Step {step.step}</span>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(idx, "title", e.target.value)}
                  placeholder="Step Title"
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-white font-bold outline-none"
                />
                <input
                  type="text"
                  value={step.desc}
                  onChange={(e) => handleStepChange(idx, "desc", e.target.value)}
                  placeholder="Step Description"
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-neutral-300 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-white font-mono bg-white/10 border border-white/30 px-3.5 py-1.5 rounded-full">
              <Check size={14} /> All Platform Settings Updated Live!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto royal-btn royal-btn-primary px-7 py-3 text-xs font-bold flex items-center gap-2"
          >
            <Save size={15} /> Save All Website Changes
          </button>
        </div>
      </form>
    </div>
  );
}
