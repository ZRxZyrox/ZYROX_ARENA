import { useState } from "react";
import { useSiteSettings } from "@/lib/siteSettingsStore";
import { logAdminAction } from "@/lib/auditLogger";
import Countdown from "@/components/ui/Countdown";
import { Layers, Save, Check, Sparkles, AlertCircle, RefreshCw, Trophy, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminHeroBoxPage() {
  const { settings, updateSettings } = useSiteSettings();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [heroHeadline, setHeroHeadline] = useState(settings.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(settings.heroSubheadline);
  const [announcementBanner, setAnnouncementBanner] = useState(settings.announcementBanner);

  // Hero Static Box Fields
  const [heroBoxEnabled, setHeroBoxEnabled] = useState(settings.heroBoxEnabled);
  const [heroBoxBadge, setHeroBoxBadge] = useState(settings.heroBoxBadge);
  const [heroBoxTitle, setHeroBoxTitle] = useState(settings.heroBoxTitle);
  const [heroBoxSubtitle, setHeroBoxSubtitle] = useState(settings.heroBoxSubtitle);
  const [heroBoxPrizePool, setHeroBoxPrizePool] = useState(settings.heroBoxPrizePool);
  const [heroBoxStatusText, setHeroBoxStatusText] = useState(settings.heroBoxStatusText);
  const [heroBoxCtaText, setHeroBoxCtaText] = useState(settings.heroBoxCtaText);
  const [heroBoxCtaUrl, setHeroBoxCtaUrl] = useState(settings.heroBoxCtaUrl);

  // Format date for datetime-local input
  const formatForInput = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 16);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  };

  const [heroBoxCountdownDate, setHeroBoxCountdownDate] = useState(formatForInput(settings.heroBoxCountdownDate));

  // Validation
  const validate = (): boolean => {
    if (!heroHeadline.trim()) {
      setError("Hero headline cannot be empty.");
      return false;
    }
    if (!heroSubheadline.trim()) {
      setError("Hero subheadline description cannot be empty.");
      return false;
    }
    if (heroBoxEnabled) {
      if (!heroBoxTitle.trim()) {
        setError("Hero Box tournament title is required when Hero Box is enabled.");
        return false;
      }
      if (!heroBoxPrizePool.trim()) {
        setError("Hero Box prize pool display amount is required.");
        return false;
      }
      if (!heroBoxCtaUrl.trim()) {
        setError("Hero Box button CTA link URL is required.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const isoDate = new Date(heroBoxCountdownDate).toISOString();

    updateSettings({
      heroHeadline,
      heroSubheadline,
      announcementBanner,
      heroBoxEnabled,
      heroBoxBadge,
      heroBoxTitle,
      heroBoxSubtitle,
      heroBoxPrizePool,
      heroBoxStatusText,
      heroBoxCtaText,
      heroBoxCtaUrl,
      heroBoxCountdownDate: isoDate,
    });

    logAdminAction("hero_box.update", "site_settings", "hero_section_box");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const loadPreset = (preset: "bgmi" | "valorant" | "freefire") => {
    if (preset === "bgmi") {
      setHeroBoxBadge("🏆 GRAND FINALS LIVE");
      setHeroBoxTitle("BGMI Pro League Season 4");
      setHeroBoxSubtitle("BGMI · Squad (4v4) TPP");
      setHeroBoxPrizePool("₹5,00,000");
      setHeroBoxStatusText("Live Registration Open");
      setHeroBoxCtaText("Claim Squad Slot →");
      setHeroBoxCtaUrl("/tournaments/showdown-season-4");
    } else if (preset === "valorant") {
      setHeroBoxBadge("⚡ FEATURED TOURNAMENT");
      setHeroBoxTitle("Valorant Winter Circuit Finals");
      setHeroBoxSubtitle("Valorant · 5v5 Squad");
      setHeroBoxPrizePool("₹2,00,000");
      setHeroBoxStatusText("Reg closes soon");
      setHeroBoxCtaText("View Details →");
      setHeroBoxCtaUrl("/tournaments/winter-circuit-finals");
    } else if (preset === "freefire") {
      setHeroBoxBadge("🔥 MEGA CLASH CUP");
      setHeroBoxTitle("Free Fire Clash Cup 2026");
      setHeroBoxSubtitle("Free Fire · Squad Clash");
      setHeroBoxPrizePool("₹1,50,000");
      setHeroBoxStatusText("Filling Fast");
      setHeroBoxCtaText("Register Squad →");
      setHeroBoxCtaUrl("/tournaments/free-fire-clash-cup");
    }
  };

  const resetDefaults = () => {
    setHeroHeadline(settings.heroHeadline);
    setHeroSubheadline(settings.heroSubheadline);
    setAnnouncementBanner(settings.announcementBanner);
    setHeroBoxEnabled(settings.heroBoxEnabled);
    setHeroBoxBadge(settings.heroBoxBadge);
    setHeroBoxTitle(settings.heroBoxTitle);
    setHeroBoxSubtitle(settings.heroBoxSubtitle);
    setHeroBoxPrizePool(settings.heroBoxPrizePool);
    setHeroBoxStatusText(settings.heroBoxStatusText);
    setHeroBoxCtaText(settings.heroBoxCtaText);
    setHeroBoxCtaUrl(settings.heroBoxCtaUrl);
    setHeroBoxCountdownDate(formatForInput(settings.heroBoxCountdownDate));
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="border-b border-charcoal/10 pb-5">
        <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
          <Layers size={24} className="text-neon" /> Hero Section &amp; Static Promo Box Manager
        </h1>
        <p className="text-xs text-charcoal-muted mt-1 font-medium">
          Manage the hero banner headline, announcement pill, and the featured static box displayed prominently on the website home page.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-coral/10 border border-coral/30 p-4 text-xs font-bold text-coral flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
        {/* Left Form Column */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Hero Headlines & Subtext */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-charcoal/10">
            <div className="flex items-center gap-2 font-display text-lg font-bold uppercase text-charcoal">
              <Sparkles size={18} className="text-neon" /> Hero Banner Text Content
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5">Announcement Badge Banner *</label>
              <input
                type="text"
                required
                value={announcementBanner}
                onChange={(e) => setAnnouncementBanner(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal font-bold outline-none focus:border-neon"
                placeholder="🔥 Season 4 Mega Tournament Registration Open..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5">Hero Main Title (Headline) *</label>
              <input
                type="text"
                required
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-sm text-charcoal font-bold outline-none focus:border-neon"
                placeholder="The Arena is Open."
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5">Hero Description (Subheadline) *</label>
              <textarea
                rows={3}
                required
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal font-medium outline-none focus:border-neon"
                placeholder="Compete across BGMI, Free Fire, Valorant, FC and Cricket..."
              />
            </div>
          </div>

          {/* Section 2: Static Hero Box Manager */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-charcoal/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-lg font-bold uppercase text-charcoal">
                <Trophy size={18} className="text-gold" /> Hero Featured Box / Card
              </div>

              <button
                type="button"
                onClick={() => setHeroBoxEnabled(!heroBoxEnabled)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  heroBoxEnabled ? "bg-neon/15 text-neon border border-neon/30" : "bg-charcoal/10 text-charcoal-muted"
                }`}
              >
                {heroBoxEnabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {heroBoxEnabled ? "Custom Box Active" : "Auto Featured"}
              </button>
            </div>

            <p className="text-xs text-charcoal-muted font-medium">
              Customize every element of the static right-hand card in the homepage Hero section.
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-charcoal/8">
              <span className="text-[11px] font-mono text-charcoal-muted font-bold">Quick Presets:</span>
              <button
                type="button"
                onClick={() => loadPreset("bgmi")}
                className="rounded-xl border border-neon/30 bg-neon/10 px-2.5 py-1 text-[11px] font-bold text-neon hover:bg-neon/20"
              >
                BGMI Preset
              </button>
              <button
                type="button"
                onClick={() => loadPreset("valorant")}
                className="rounded-xl border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11px] font-bold text-gold-warm hover:bg-gold/20"
              >
                Valorant Preset
              </button>
              <button
                type="button"
                onClick={() => loadPreset("freefire")}
                className="rounded-xl border border-coral/30 bg-coral/10 px-2.5 py-1 text-[11px] font-bold text-coral hover:bg-coral/20"
              >
                Free Fire Preset
              </button>
            </div>

            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Badge Tag *</label>
                  <input
                    type="text"
                    required
                    value={heroBoxBadge}
                    onChange={(e) => setHeroBoxBadge(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2 text-xs text-charcoal font-bold outline-none focus:border-neon"
                    placeholder="⚡ FEATURED TOURNAMENT"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Category &amp; Format *</label>
                  <input
                    type="text"
                    required
                    value={heroBoxSubtitle}
                    onChange={(e) => setHeroBoxSubtitle(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2 text-xs text-charcoal font-semibold outline-none focus:border-neon"
                    placeholder="BGMI · Squad (4v4)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Tournament / Box Title *</label>
                <input
                  type="text"
                  required
                  value={heroBoxTitle}
                  onChange={(e) => setHeroBoxTitle(e.target.value)}
                  className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal font-bold outline-none focus:border-neon"
                  placeholder="BGMI Pro Championship Season 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Prize Pool Display *</label>
                  <input
                    type="text"
                    required
                    value={heroBoxPrizePool}
                    onChange={(e) => setHeroBoxPrizePool(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2 text-xs text-gold-warm font-bold outline-none focus:border-gold"
                    placeholder="₹2,50,000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Status Pill Text *</label>
                  <input
                    type="text"
                    required
                    value={heroBoxStatusText}
                    onChange={(e) => setHeroBoxStatusText(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2 text-xs text-neon font-bold outline-none focus:border-neon"
                    placeholder="Reg closes soon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Countdown Target Date &amp; Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={heroBoxCountdownDate}
                  onChange={(e) => setHeroBoxCountdownDate(e.target.value)}
                  className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2 text-xs text-charcoal font-mono font-bold outline-none focus:border-neon"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Button Label (CTA) *</label>
                  <input
                    type="text"
                    required
                    value={heroBoxCtaText}
                    onChange={(e) => setHeroBoxCtaText(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2 text-xs text-charcoal font-bold outline-none focus:border-neon"
                    placeholder="View Details →"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Button Link URL / Slug *</label>
                  <input
                    type="text"
                    required
                    value={heroBoxCtaUrl}
                    onChange={(e) => setHeroBoxCtaUrl(e.target.value)}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-3.5 py-2 text-xs text-charcoal font-mono outline-none focus:border-neon"
                    placeholder="/tournaments/bgmi-pro-championship"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={resetDefaults}
              className="rounded-2xl border border-charcoal/10 px-5 py-3 text-xs font-bold text-charcoal-muted hover:text-charcoal flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Reset Settings
            </button>

            <div className="flex items-center gap-3">
              {saved && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-neon font-mono bg-neon/10 border border-neon/30 px-3.5 py-1.5 rounded-full">
                  <Check size={14} /> Hero Box &amp; Banner Updated Live!
                </span>
              )}
              <button
                type="submit"
                className="shimmer-btn rounded-2xl px-7 py-3 text-xs font-bold text-white shadow-glow flex items-center gap-2"
              >
                <Save size={15} /> Save Hero Section Changes
              </button>
            </div>
          </div>
        </form>

        {/* Right Live Preview Column */}
        <div className="space-y-4 lg:sticky lg:top-8">
          <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-charcoal">
            <Eye size={16} className="text-neon" /> Live Hero Box Interactive Preview
          </div>

          <div className="relative">
            {/* Glow ring */}
            <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-neon/20 via-gold/15 to-coral/20 blur-xl animate-float-slow" />

            <div className="relative glass-card rounded-[28px] p-7 shadow-glass-xl text-charcoal">
              {/* Featured badge */}
              <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-neon to-neon-deep px-4 py-1.5 font-mono text-[10px] font-bold tracking-wider text-white shadow-glow uppercase">
                {heroBoxBadge || "⚡ FEATURED TOURNAMENT"}
              </span>

              <div className="mt-3 mb-5 flex items-center justify-between">
                <span className="font-mono text-xs text-charcoal-muted font-bold">{heroBoxSubtitle || "Game Category · Mode"}</span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-neon font-bold">
                  <span className="h-2 w-2 animate-pulse-live rounded-full bg-neon" />
                  {heroBoxStatusText || "Reg closes soon"}
                </span>
              </div>

              <h3 className="mb-6 font-display text-2xl sm:text-3xl font-bold leading-tight text-charcoal">
                {heroBoxTitle || "Tournament Title Here"}
              </h3>

              <Countdown target={new Date(heroBoxCountdownDate || Date.now() + 3 * 86400000)} />

              <div className="mt-6 flex items-end justify-between border-t border-charcoal/8 pt-5">
                <div>
                  <span className="block font-display text-3xl font-bold text-gradient-warm">
                    {heroBoxPrizePool || "₹0"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-mono font-bold">Prize Pool</span>
                </div>
                <Link
                  to={heroBoxCtaUrl || "#"}
                  className="rounded-xl bg-charcoal px-5 py-3 text-xs font-bold text-white shadow-glass hover:bg-charcoal-light transition-colors flex items-center gap-1.5"
                >
                  {heroBoxCtaText || "View Details →"}
                </Link>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 text-[11px] text-charcoal-muted space-y-1.5 font-medium border border-charcoal/10">
            <span className="font-mono font-bold text-neon block uppercase">ℹ️ Live Sync Note</span>
            <p>
              When saved, these settings directly update the live home page Hero section in real time. Players will immediately see your custom static box with the live countdown and prize pool display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
