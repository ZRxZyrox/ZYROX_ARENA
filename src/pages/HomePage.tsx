import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import Hero from "@/components/home/Hero";
import { useLiveTournaments } from "@/lib/tournamentStore";
import { useLiveLeaderboard } from "@/lib/leaderboardStore";
import { useLiveReviews } from "@/lib/reviewStore";
import { useSiteSettings } from "@/lib/siteSettingsStore";
import { subscribeNewsletter } from "@/lib/newsletterStore";
import type { FeaturedTournament } from "@/types/tournament";
import {
  ShieldCheck,
  Zap,
  Users,
  CreditCard,
  Star,
  Quote,
  Newspaper,
  Send,
  Instagram,
  Youtube,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const { publishedTournaments } = useLiveTournaments();
  const { leaderboard } = useLiveLeaderboard();
  const { reviews } = useLiveReviews();
  const { settings } = useSiteSettings();

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeFeedback, setSubscribeFeedback] = useState<string | null>(null);

  const featured: FeaturedTournament = useMemo(() => {
    const top = publishedTournaments.find((t) => t.status === "live" || t.status === "reg_open") ?? publishedTournaments[0];
    if (top) {
      return {
        slug: top.slug,
        title: top.title,
        game: top.game,
        format: top.mode === "squad" ? "Squad (4v4)" : "Solo (1v1)",
        prizePool: top.prize_pool_display,
        registrationCloses: new Date(Date.now() + 2 * 86400000 + 14 * 3600000),
      };
    }
    return {
      slug: "winter-circuit-finals",
      title: "Valorant Winter Circuit Finals",
      game: "Valorant",
      format: "5v5 Squad",
      prizePool: "₹2,00,000",
      registrationCloses: new Date(Date.now() + 3 * 86400000),
    };
  }, [publishedTournaments]);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim() || !subscribeEmail.includes("@")) {
      setSubscribeFeedback("Please enter a valid email address.");
      return;
    }

    const result = subscribeNewsletter(subscribeEmail.trim());
    setSubscribeFeedback(result.message);
    if (result.success) {
      setSubscribeEmail("");
      setTimeout(() => setSubscribeFeedback(null), 4000);
    }
  };

  const getGuaranteeIcon = (iconName: string) => {
    switch (iconName) {
      case "CreditCard":
        return CreditCard;
      case "Zap":
        return Zap;
      case "Users":
        return Users;
      case "ShieldCheck":
      default:
        return ShieldCheck;
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white transition-colors relative overflow-x-hidden">
      <Seo
        title="ZYROX ARENA — Ancient Esports Tournament Sanctum"
        description="Compete in high-stakes esports tournaments across BGMI, Free Fire, Valorant, FC, and Cricket with verified cash prize pools and 24-hour payouts."
      />
      <Header />

      <main className="safe-bottom-dock">
        {/* ═══════════════ Hero Section ═══════════════ */}
        <Hero featured={featured} />

        {/* ═══════════════ Platform Guarantees ("Why ZYROX ARENA") ═══════════════ */}
        <section className="py-14 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-10">
              <span className="inline-block font-mono text-[10px] uppercase text-neutral-300 font-bold tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
                Platform Guarantees
              </span>
              <h2 className="mt-2.5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Why <span className="text-gradient-warm">ZYROX ARENA</span>
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(settings.guarantees || []).map((f) => {
                const Icon = getGuaranteeIcon(f.iconName);
                return (
                  <div
                    key={f.id || f.title}
                    className="glass-card rounded-2xl p-5 space-y-3 group border border-white/15 fps-120 hover:border-white/35 transition-all"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 shadow-glass">
                      <Icon size={20} className="text-white" />
                    </span>
                    <h3 className="font-display text-sm font-bold text-white tracking-wide">
                      {f.title}
                    </h3>
                    <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ═══════════════ Uiverse Daniel1227k Interactive Hover Card ═══════════════ */}
            <div className="mt-8">
              <div className="uiverse-zyrox-card fps-120 w-full">
                <b />
                <div className="card-media flex flex-col items-center justify-center text-white select-none">
                  <span className="font-display text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                    ZYROX
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold text-white/70 mt-0.5">
                    STUDIOZ
                  </span>
                </div>
                <div className="card-content select-none">
                  <div className="card-title">
                    <span>NEVER SETTLE</span>
                    EVER EVOLVING
                    <div className="text-[9px] sm:text-[10px] text-white/90 font-mono tracking-widest mt-1 font-bold">
                      ZYROX STUDIOZ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ How It Works ═══════════════ */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-10">
              <span className="inline-block font-mono text-[10px] uppercase text-neutral-300 font-bold tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
                4-Step Process
              </span>
              <h2 className="mt-2.5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                How It <span className="text-gradient-warm">Works</span>
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(settings.howItWorks || []).map((step) => (
                <div
                  key={step.step}
                  className="glass-card rounded-2xl p-5 relative overflow-hidden group border border-white/15 fps-120 hover:border-white/35 transition-all"
                >
                  <span className="absolute -top-3 -right-1 font-display text-[52px] font-black text-white/[0.04] group-hover:text-white/[0.08] transition-colors select-none">
                    {step.step}
                  </span>
                  <span className="inline-block font-mono text-[10px] text-neutral-400 font-bold tracking-wider mb-2">STEP {step.step}</span>
                  <h3 className="font-display text-sm font-bold text-white mb-1.5">{step.title}</h3>
                  <p className="text-xs text-neutral-400 font-normal leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ Dynamic Live Leaderboard ═══════════════ */}
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center mb-10">
              <span className="inline-block font-mono text-[10px] uppercase text-neutral-300 font-bold tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
                Season Rankings
              </span>
              <h2 className="mt-2.5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Top <span className="text-gradient-warm">Performers</span>
              </h2>
            </div>
            <div className="glass-card rounded-2xl p-5 shadow-glass overflow-x-auto border border-white/15">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-mono text-neutral-400 uppercase">
                    <th className="py-2.5 px-3 text-left font-bold">Rank</th>
                    <th className="py-2.5 px-3 text-left font-bold">Player / Team</th>
                    <th className="py-2.5 px-3 text-left font-bold">Game</th>
                    <th className="py-2.5 px-3 text-left font-bold">Wins</th>
                    <th className="py-2.5 px-3 text-right font-bold">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((p) => (
                    <tr key={p.id || p.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3">
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-bold ${p.rank === 1 ? "bg-white text-black font-black shadow-[0_0_10px_#fff]" :
                            "bg-white/10 text-white border border-white/20"
                          }`}>
                          {p.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white text-xs">{p.name}</td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-neutral-200">{p.game}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs text-neutral-300">{p.wins} W</td>
                      <td className="py-3 px-3 text-right font-display text-sm font-bold text-white">{p.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══════════════ Dynamic Player Reviews & Testimonials ═══════════════ */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-10">
              <span className="inline-block font-mono text-[10px] uppercase text-neutral-300 font-bold tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
                Player Voices
              </span>
              <h2 className="mt-2.5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Trusted By <span className="text-gradient-warm">Gamers Across India</span>
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {reviews.map((t) => (
                <div
                  key={t.id || t.name}
                  className="glass-card rounded-2xl p-5 space-y-3 border border-white/15 fps-120 hover:border-white/35 transition-all"
                >
                  <Quote size={18} className="text-white/30" />
                  <p className="text-xs text-neutral-300 leading-relaxed italic line-clamp-3">"{t.quote}"</p>
                  <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-display text-xs font-bold">
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="font-display font-bold text-white text-xs">{t.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating || 5 }).map((_, s) => (
                      <Star key={s} size={11} className="text-white fill-white" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ Community & Socials ═══════════════ */}
        <section className="py-14">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-10">
              <span className="inline-block font-mono text-[10px] uppercase text-neutral-300 font-bold tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
                Official Channels
              </span>
              <h2 className="mt-2.5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Connect <span className="text-gradient-warm">With Us</span>
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { icon: MessageCircle, label: "Discord", desc: "Join 5,000+ gamers, scrims & squad LFTs.", url: settings.discordUrl },
                { icon: Instagram, label: "Instagram", desc: "Tournament highlights & winner drops.", url: settings.instagramUrl },
                { icon: Youtube, label: "YouTube", desc: "Grand finals streams & match VODs.", url: settings.youtubeUrl },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-2xl p-5 group cursor-pointer hover:border-white/40 transition-all border border-white/15 fps-120 block"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 shadow-glass">
                      <Icon size={20} className="text-white" />
                    </span>
                    <h3 className="mt-3 font-display text-sm font-bold text-white">{s.label}</h3>
                    <p className="mt-1 text-xs text-neutral-400">{s.desc}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ Newsletter CTA Banner ═══════════════ */}
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-6">
            <div className="glass-card rounded-3xl p-8 md:p-10 text-center space-y-4 border border-white/20">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20 shadow-glass mx-auto">
                <Newspaper size={22} className="text-white" />
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
                Tournament <span className="text-gradient-warm">Alerts</span>
              </h2>
              <p className="max-w-md mx-auto text-xs text-neutral-400">
                Priority slots, exclusive codes &amp; new bracket announcements.
              </p>

              <form onSubmit={handleSubscribeSubmit} className="space-y-3 max-w-md mx-auto pt-2">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-white/40 font-medium"
                  />
                  <button
                    type="submit"
                    className="royal-btn royal-btn-primary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Subscribe</span>
                    <Send size={13} />
                  </button>
                </div>
                {subscribeFeedback && (
                  <p className="text-xs font-bold text-white flex items-center justify-center gap-1">
                    <CheckCircle2 size={13} /> {subscribeFeedback}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
