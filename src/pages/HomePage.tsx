import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import Hero from "@/components/home/Hero";
import { useLiveTournaments } from "@/lib/tournamentStore";
import { useLiveLeaderboard } from "@/lib/leaderboardStore";
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

const HARDCODED_REVIEWS = [
  {
    id: "rev-1",
    name: "Arjun Sharma",
    role: "IGL — Team Soul Esports",
    quote: "ZYROX ARENA has set a new standard for Indian esports. Zero ping latency, instant slot allotment, and prize money in my UPI account within 2 hours of winning.",
    rating: 5,
  },
  {
    id: "rev-2",
    name: "Priya Menon",
    role: "Captain — Valkyrie Ops",
    quote: "The emulator detection is ironclad. In other tourneys we faced closet cheaters, but here the referee panel and live check-ins guarantee a genuinely fair fight.",
    rating: 5,
  },
  {
    id: "rev-3",
    name: "Rohan Verma",
    role: "Solo Fragger — Free Fire Max",
    quote: "Fastest tournament registration I've ever experienced. Room ID & password delivered right to the screen 15 minutes before drop. Flawless management.",
    rating: 5,
  },
  {
    id: "rev-4",
    name: "Vikram Rathore",
    role: "Sniper — Valorant Vanguard",
    quote: "Transparent brackets, strict anti-cheat, and prompt support on Discord. Zyrox Studioz is truly elevating the competitive gaming ecosystem in India.",
    rating: 5,
  },
];

const WHY_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Anti-Cheat Shield",
    desc: "Live hardware check-ins & emulator bans.",
  },
  {
    icon: CreditCard,
    title: "Instant Payouts",
    desc: "Direct UPI & bank transfers within 24 hours.",
  },
  {
    icon: Zap,
    title: "Live Brackets",
    desc: "Instant room credentials & automated scores.",
  },
  {
    icon: Users,
    title: "Verified Rosters",
    desc: "Validated player IGNs & captain check-in.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick Event",
    desc: "Choose title, mode & squad roster.",
  },
  {
    step: "02",
    title: "Instant Entry",
    desc: "Secure instant UPI & card checkout.",
  },
  {
    step: "03",
    title: "Get Room Pass",
    desc: "Private room ID & password 15m prior.",
  },
  {
    step: "04",
    title: "Win Cash",
    desc: "Dominate bracket & get paid directly.",
  },
];

export default function HomePage() {
  const { publishedTournaments } = useLiveTournaments();
  const { leaderboard } = useLiveLeaderboard();

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
      registrationCloses: new Date(Date.now() + 2 * 86400000 + 14 * 3600000),
    };
  }, [publishedTournaments]);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(subscribeEmail);
    setSubscribeFeedback(res.message);
    if (res.success) setSubscribeEmail("");
    setTimeout(() => setSubscribeFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen bg-transparent text-charcoal dark:text-[#ECEDF0] transition-colors relative">
      <Seo
        title="ZYROX ARENA — High-Stakes Esports Tournaments"
        description="India's premier competitive gaming arena. Compete in BGMI, Free Fire, Valorant, FC, and Cricket for verified cash prizes."
      />
      <Header />

      <main className="safe-bottom-dock">
        {/* Hero Section */}
        <Hero featured={featured} />

        {/* ═══════════════ Why ZYROX ARENA ═══════════════ */}
        <section className="py-14">
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
              {WHY_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
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
              {HOW_IT_WORKS.map((step) => (
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

        {/* ═══════════════ Testimonials ═══════════════ */}
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
              {HARDCODED_REVIEWS.map((t) => (
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
                { icon: MessageCircle, label: "Discord", desc: "5,000+ gamers, scrims & squad LFTs." },
                { icon: Instagram, label: "Instagram", desc: "Tournament highlights & winner drops." },
                { icon: Youtube, label: "YouTube", desc: "Grand finals streams & match VODs." },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="glass-card rounded-2xl p-5 group cursor-pointer hover:border-white/40 transition-all border border-white/15 fps-120"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 shadow-glass">
                      <Icon size={20} className="text-white" />
                    </span>
                    <h3 className="mt-3 font-display text-sm font-bold text-white">{s.label}</h3>
                    <p className="mt-1 text-xs text-neutral-400">{s.desc}</p>
                  </div>
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
                    className="flex-1 rounded-full bg-white/5 border border-white/15 px-4 py-2.5 text-xs text-white outline-none focus:border-white focus:ring-1 focus:ring-white/20 placeholder:text-neutral-500"
                  />
                  <button type="submit" className="royal-btn royal-btn-primary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5">
                    <Send size={13} /> Subscribe
                  </button>
                </div>
                {subscribeFeedback && (
                  <div className="rounded-full bg-white/10 border border-white/30 px-4 py-1.5 text-[11px] font-bold text-white flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={13} /> {subscribeFeedback}
                  </div>
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
