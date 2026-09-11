import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import LiveTicker, { type TickerItem } from "@/components/layout/LiveTicker";
import Hero from "@/components/home/Hero";
import { useLiveTournaments } from "@/lib/tournamentStore";
import { useLiveReviews } from "@/lib/reviewStore";
import { useLiveLeaderboard } from "@/lib/leaderboardStore";
import { subscribeNewsletter } from "@/lib/newsletterStore";
import type { FeaturedTournament } from "@/types/tournament";
import { ShieldCheck, Zap, Users, CreditCard, Star, Quote, Newspaper, Send, Instagram, Youtube, MessageCircle, CheckCircle2 } from "lucide-react";

const WHY_FEATURES = [
  { icon: ShieldCheck, title: "Anti-Cheat Enforcement", desc: "Mandatory device check-ins, screen recording, and emulator bans across every match.", color: "from-neon/20 to-neon/5", iconColor: "text-neon" },
  { icon: CreditCard, title: "Instant Prize Payouts", desc: "Winners receive verified Razorpay bank/UPI transfers within 24 hours of finals.", color: "from-gold/20 to-gold/5", iconColor: "text-gold" },
  { icon: Zap, title: "Live Brackets & Scores", desc: "Real-time bracket progression, room credentials, and match scheduling for every round.", color: "from-coral/20 to-coral/5", iconColor: "text-coral" },
  { icon: Users, title: "Verified Team Rosters", desc: "Full IGN validation, WhatsApp check-in, and captain-approved squad submissions.", color: "from-neon-mint/20 to-neon-mint/5", iconColor: "text-neon-mint" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Register Your Team", desc: "Choose your game, select Solo or Squad format, and add your teammates with their in-game IDs." },
  { step: "02", title: "Pay Entry Fee", desc: "Secure payment via Razorpay — UPI, GPay, PhonePe, cards, or net banking. Instant confirmation." },
  { step: "03", title: "Receive Room Credentials", desc: "Your Team Captain gets the Room ID & Password via WhatsApp 15 minutes before match start." },
  { step: "04", title: "Win & Get Paid", desc: "Top the leaderboard and receive your prize money directly to your bank within 24 hours." },
];

export default function HomePage() {
  const { publishedTournaments } = useLiveTournaments();
  const { publishedReviews } = useLiveReviews();
  const { leaderboard } = useLiveLeaderboard();

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeFeedback, setSubscribeFeedback] = useState<string | null>(null);

  const featured: FeaturedTournament = useMemo(() => {
    const top = publishedTournaments.find((t) => t.status === "live" || t.status === "reg_open") ?? publishedTournaments[0];
    if (top) {
      return { slug: top.slug, title: top.title, game: top.game, format: top.mode === "squad" ? "Squad (4v4)" : "Solo (1v1)", prizePool: top.prize_pool_display, registrationCloses: new Date(Date.now() + 2 * 86400000 + 14 * 3600000) };
    }
    return { slug: "winter-circuit-finals", title: "Valorant Winter Circuit Finals", game: "Valorant", format: "5v5 Squad", prizePool: "₹2,00,000", registrationCloses: new Date(Date.now() + 2 * 86400000 + 14 * 3600000) };
  }, [publishedTournaments]);

  const ticker: TickerItem[] = useMemo(() => {
    if (publishedTournaments.length > 0) {
      return publishedTournaments.map((t) => ({ id: t.id, text: `${t.title} — ${t.prize_pool_display} Prize Pool (${t.status === "live" ? "LIVE NOW" : "Registrations Open"})`, live: t.status === "live" }));
    }
    return [
      { id: "1", text: "BGMI Showdown — Semifinals live now", live: true },
      { id: "2", text: "₹2,00,000 prize pool — Valorant Winter Circuit registrations open" },
      { id: "3", text: "Free Fire Clash — Grand Finals in 3 days", live: true },
    ];
  }, [publishedTournaments]);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(subscribeEmail);
    setSubscribeFeedback(res.message);
    if (res.success) setSubscribeEmail("");
    setTimeout(() => setSubscribeFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#0A0A14] text-charcoal dark:text-[#ECEDF0]">
      <Seo title="ZYROX ARENA — High-Stakes Esports Tournaments" description="India's premier competitive gaming arena. Compete in BGMI, Free Fire, Valorant, FC, and Cricket for verified cash prizes." />
      <Header />
      <LiveTicker items={ticker} />

      <main>
        <Hero featured={featured} />

        {/* ═══════════════ Why ZYROX ARENA ═══════════════ */}
        <section className="py-20 mesh-gradient">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-14">
              <p className="font-mono text-xs uppercase text-neon font-bold tracking-widest">Platform Guarantees</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal dark:text-white">
                Why <span className="text-gradient-warm">ZYROX ARENA</span>
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-charcoal-muted dark:text-[#9A9BA8] text-sm">Built from the ground up for serious competitive gamers who demand fairness, transparency, and instant payouts.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {WHY_FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-3xl p-7 space-y-4 group hover:shadow-glass-lg transition-all"
                  >
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} border border-white/50 dark:border-white/10`}>
                      <Icon size={26} className={f.iconColor} />
                    </span>
                    <h3 className="font-display text-lg font-bold uppercase text-charcoal dark:text-white">{f.title}</h3>
                    <p className="text-xs text-charcoal-muted dark:text-[#7A7B88] leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ How It Works ═══════════════ */}
        <section className="py-20 bg-ivory-warm dark:bg-[#0D0D1A]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-14">
              <p className="font-mono text-xs uppercase text-gold font-bold tracking-widest">Simple 4-Step Process</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal dark:text-white">
                How It <span className="text-gradient-warm">Works</span>
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="glass-card rounded-3xl p-7 relative overflow-hidden group"
                >
                  <span className="absolute -top-4 -right-2 font-display text-[80px] font-black text-charcoal/[0.04] dark:text-white/[0.04] group-hover:text-neon/10 transition-colors">
                    {step.step}
                  </span>
                  <span className="inline-block font-mono text-xs text-neon font-bold mb-3">STEP {step.step}</span>
                  <h3 className="font-display text-xl font-bold uppercase text-charcoal dark:text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-charcoal-muted dark:text-[#7A7B88] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ Dynamic Live Leaderboard ═══════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <p className="font-mono text-xs uppercase text-coral font-bold tracking-widest">Season Rankings</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal dark:text-white">
                Top <span className="text-gradient-warm">Performers</span>
              </h2>
            </div>
            <div className="glass-card rounded-3xl p-6 shadow-glass-lg overflow-hidden border border-charcoal/10 dark:border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-charcoal/10 dark:border-white/8 text-xs font-mono text-charcoal-muted dark:text-[#7A7B88] uppercase">
                    <th className="py-3 px-4 text-left font-bold">Rank</th>
                    <th className="py-3 px-4 text-left font-bold">Team / Player</th>
                    <th className="py-3 px-4 text-left font-bold">Game</th>
                    <th className="py-3 px-4 text-left font-bold">Wins</th>
                    <th className="py-3 px-4 text-right font-bold">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((p) => (
                    <tr key={p.id || p.rank} className="border-b border-charcoal/5 dark:border-white/5 hover:bg-white/5 dark:hover:bg-white/3 transition-colors">
                      <td className="py-4 px-4">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-bold ${
                          p.rank === 1 ? "bg-gradient-to-br from-gold to-gold-bright text-white shadow-warm" :
                          p.rank === 2 ? "bg-charcoal/10 dark:bg-white/10 text-charcoal dark:text-white" :
                          p.rank === 3 ? "bg-coral/10 text-coral" : "bg-charcoal/5 dark:bg-white/5 text-charcoal-muted dark:text-[#7A7B88]"
                        }`}>
                          {p.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-charcoal dark:text-white">{p.name}</td>
                      <td className="py-4 px-4">
                        <span className="rounded-full bg-neon/10 border border-neon/20 px-3 py-1 text-xs font-bold text-neon">{p.game}</span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-charcoal dark:text-white">{p.wins} Wins</td>
                      <td className="py-4 px-4 text-right font-display text-lg font-bold text-gold">{p.earnings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══════════════ Testimonials ═══════════════ */}
        <section className="py-20 mesh-gradient">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-12">
              <p className="font-mono text-xs uppercase text-gold font-bold tracking-widest">Player Voices</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal dark:text-white">
                Trusted By <span className="text-gradient-warm">Gamers Across India</span>
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {publishedReviews.map((t, i) => (
                <motion.div
                  key={t.id || t.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-3xl p-6 space-y-4"
                >
                  <Quote size={24} className="text-gold/40" />
                  <p className="text-sm text-charcoal dark:text-[#ECEDF0] leading-relaxed italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-charcoal/8 dark:border-white/8">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neon/20 to-gold/20 border border-neon/20 font-display text-sm font-bold text-neon">
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="font-bold text-charcoal dark:text-white text-sm">{t.name}</p>
                      <p className="text-[11px] text-charcoal-muted dark:text-[#7A7B88]">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating || 5 }).map((_, s) => (
                      <Star key={s} size={13} className="text-gold fill-gold" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ Community & Socials ═══════════════ */}
        <section className="py-20 bg-ivory-warm dark:bg-[#0D0D1A]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-12">
              <p className="font-mono text-xs uppercase text-neon font-bold tracking-widest">Join the Community</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal dark:text-white">
                Connect <span className="text-gradient-warm">With Us</span>
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: MessageCircle, label: "Discord Community", desc: "Join 5,000+ gamers for LFT calls, scrims, and announcements.", color: "from-neon to-neon-deep", hover: "hover:shadow-glow" },
                { icon: Instagram, label: "Instagram @zyroxarena", desc: "Follow for highlight reels, winner announcements, and behind-the-scenes.", color: "from-coral to-orange", hover: "hover:shadow-warm" },
                { icon: Youtube, label: "YouTube Channel", desc: "Watch Grand Finals VODs, tutorials, and tournament recaps.", color: "from-coral to-coral", hover: "hover:shadow-warm" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`glass-card rounded-3xl p-7 group cursor-pointer ${s.hover} transition-all`}
                  >
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-glass`}>
                      <Icon size={24} className="text-white" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold uppercase text-charcoal dark:text-white">{s.label}</h3>
                    <p className="mt-1 text-xs text-charcoal-muted dark:text-[#7A7B88]">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ Newsletter CTA Banner ═══════════════ */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative overflow-hidden rounded-[32px] shimmer-btn p-[2px]">
              <div className="glass-card rounded-[30px] p-10 md:p-14 text-center space-y-6">
                <div className="flex justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon/20 to-gold/20 border border-neon/20">
                    <Newspaper size={28} className="text-neon" />
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase text-charcoal dark:text-white">
                  Never Miss a <span className="text-gradient-warm">Tournament Drop</span>
                </h2>
                <p className="max-w-lg mx-auto text-sm text-charcoal-muted dark:text-[#9A9BA8]">
                  Get early access to new brackets, exclusive discount codes, and priority registration slots before they go public.
                </p>

                <form onSubmit={handleSubscribeSubmit} className="space-y-3 max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      placeholder="your-email@example.com"
                      className="flex-1 rounded-2xl bg-ivory-warm dark:bg-white/8 border border-charcoal/10 dark:border-white/12 px-5 py-3.5 text-sm text-charcoal dark:text-white outline-none focus:border-neon focus:ring-2 focus:ring-neon/20 font-medium placeholder:text-charcoal-muted dark:placeholder:text-[#7A7B88]"
                    />
                    <button type="submit" className="shimmer-btn rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-glow flex items-center justify-center gap-2 hover:shadow-glass-lg transition-shadow">
                      <Send size={15} /> Subscribe
                    </button>
                  </div>
                  {subscribeFeedback && (
                    <div className="rounded-xl bg-neon-mint/10 border border-neon-mint/30 p-2.5 text-xs font-bold text-neon-mint flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} /> {subscribeFeedback}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
