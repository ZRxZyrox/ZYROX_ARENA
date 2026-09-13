import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import Countdown from "@/components/ui/Countdown";
import { useLiveTournaments } from "@/lib/tournamentStore";
import { useLiveTeams } from "@/lib/registrationStore";
import { useAuth } from "@/context/AuthContext";
import {
  Trophy,
  ShieldCheck,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

type Tab = "overview" | "rules" | "schedule" | "bracket" | "faq";

export default function TournamentDetailPage() {
  const { slug } = useParams();
  const { publishedTournaments } = useLiveTournaments();
  const { registrations } = useLiveTeams();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  const tournament = useMemo(() => {
    return publishedTournaments.find((t) => t.slug === slug) ?? publishedTournaments[0];
  }, [publishedTournaments, slug]);

  const targetCountdownDate = useMemo(() => {
    return new Date(Date.now() + 2 * 86400000 + 14 * 3600000);
  }, []);

  const isAlreadyRegistered = useMemo(() => {
    if (!user) return false;
    const cleanEmail = user.email.toLowerCase();
    const cleanPhone = user.phone ? user.phone.replace(/\D/g, "") : "";

    return registrations.some((r) => {
      const matchGame = tournament && r.game.toLowerCase() === tournament.game.toLowerCase();
      const matchEmail = r.email.toLowerCase() === cleanEmail;
      const matchPhone = cleanPhone && r.phone && r.phone.replace(/\D/g, "") === cleanPhone;
      return matchGame && (matchEmail || matchPhone);
    });
  }, [user, registrations, tournament]);

  return (
    <div className="min-h-screen bg-transparent text-charcoal dark:text-[#ECEDF0] transition-colors relative">
      {tournament && (
        <Seo
          title={`${tournament.title} — ${tournament.game} Tournament`}
          description={`Register your team for ${tournament.title}. Prize Pool: ${tournament.prize_pool_display}. Mode: ${tournament.mode.toUpperCase()}.`}
        />
      )}
      <Header />

      <main className="safe-bottom-dock">
        {/* Hero Header */}
        <section className="relative border-b border-white/10 mesh-gradient px-6 py-16 md:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full bg-white/10 border border-white/20 px-3.5 py-1 font-mono text-xs font-bold text-white uppercase tracking-wider">
                {tournament?.game ?? "Esports Tournament"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/20 px-3 py-1 font-mono text-xs font-bold text-neutral-300 uppercase">
                <ShieldCheck size={13} className="text-white" /> Anti-Cheat Verified
              </span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">
              {tournament?.title ?? "Tournament Details"}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-8 md:gap-12">
              <div>
                <span className="block font-display text-4xl text-white font-black tracking-tight">
                  {tournament?.prize_pool_display ?? "—"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                  Prize Pool
                </span>
              </div>

              <div>
                <span className="block font-mono text-2xl text-white font-bold">
                  ₹{tournament?.entry_fee ?? 0}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                  Entry Fee
                </span>
              </div>

              <div>
                <span className="block font-mono text-2xl text-white font-bold uppercase">
                  {tournament?.mode ?? "Squad"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                  Game Mode
                </span>
              </div>

              <div className="hidden sm:block">
                <Countdown target={targetCountdownDate} />
              </div>

              {isAlreadyRegistered ? (
                <div className="flex items-center gap-2 rounded-2xl bg-white/15 border border-white/30 px-6 py-4 text-xs font-bold text-white shadow-card">
                  <CheckCircle2 size={18} className="text-white" />
                  <span>Slot Confirmed (Registered ✓)</span>
                </div>
              ) : (
                <Link
                  to={`/tournaments/${tournament?.slug || slug}/register`}
                  className="flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-all shadow-glow hover:scale-105 active:scale-95"
                >
                  <span>Register Team Roster</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <nav className="border-b border-white/10 px-6 md:px-14 bg-black/60 backdrop-blur-md sticky top-16 z-30">
          <div className="mx-auto max-w-7xl flex gap-3 overflow-x-auto no-scrollbar py-2">
            {[
              { id: "overview", label: "Overview", icon: Info },
              { id: "rules", label: "Match Rules", icon: BookOpen },
              { id: "schedule", label: "Schedule", icon: Calendar },
              { id: "bracket", label: "Brackets", icon: Layers },
              { id: "faq", label: "FAQ", icon: HelpCircle },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as Tab)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-white text-black shadow-glow font-black"
                      : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Tab Content */}
        <section className="mx-auto max-w-7xl min-h-[400px] px-6 py-12 md:px-14">
          {tab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold uppercase text-charcoal dark:text-white">
                  Tournament Overview
                </h2>
                <p className="mt-2 text-sm text-charcoal-muted dark:text-[#9A9BA8] leading-relaxed max-w-3xl font-medium">
                  Welcome to {tournament?.title || "this tournament"}. Compete against top esports athletes across India for verified cash prize payouts, verified leaderboard standing, and competitive glory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="glass-card rounded-3xl p-6 space-y-2.5 border border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Trophy size={18} className="text-white" /> Direct Cash Payouts
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Prizes transferred directly via Razorpay UPI/Bank Transfer within 24 hours of finals completion.
                  </p>
                </div>
                <div className="glass-card rounded-3xl p-6 space-y-2.5 border border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <ShieldCheck size={18} className="text-white" /> Anti-Cheat Enforced
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Strict screen-recording, device check-ins, and anti-emulator enforcement in effect.
                  </p>
                </div>
                <div className="glass-card rounded-3xl p-6 space-y-2.5 border border-white/10">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Users size={18} className="text-white" /> Verified Rosters
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Only registered and approved team captains receive room ID &amp; passcode 15 minutes before match start.
                  </p>
                </div>
              </div>

              {/* Tournament Highlights Box */}
              <div className="glass-card rounded-3xl p-7 border border-white/10 space-y-4">
                <h3 className="font-display text-xl font-bold uppercase text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-white" /> Tournament Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                    <span className="text-neutral-400 block text-[10px] uppercase">Format</span>
                    <span className="font-bold text-white text-sm">{tournament?.mode.toUpperCase()}</span>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                    <span className="text-neutral-400 block text-[10px] uppercase">Game Title</span>
                    <span className="font-bold text-white text-sm">{tournament?.game}</span>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                    <span className="text-neutral-400 block text-[10px] uppercase">Server</span>
                    <span className="font-bold text-white text-sm">India (Mumbai / Delhi)</span>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                    <span className="text-neutral-400 block text-[10px] uppercase">Status</span>
                    <span className="font-bold text-white text-sm uppercase">{tournament?.status.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "rules" && (
            <div className="space-y-4 max-w-3xl animate-fade-in">
              <h2 className="font-display text-3xl font-bold uppercase text-white">
                Match Rules &amp; Regulations
              </h2>
              <p className="text-xs text-neutral-400">
                All players must adhere to the official Zyrox Arena Fair Play Code. Violations result in instant disqualification.
              </p>
              <div className="glass-card rounded-3xl p-6 text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-medium border border-white/10 space-y-3">
                {tournament?.rules || (
                  `1. Lobby Room ID & Password: Credentials will be shared 15 minutes before match start via WhatsApp.\n2. Emulator Policy: Strictly prohibited in mobile tournaments. Mobile devices only.\n3. End-Game Proof: Team captains must take screenshots of the final standings and total kills.\n4. Disconnections: Match will not be paused for individual player internet drops.\n5. Decision Finality: Tournament admin decisions are final in all dispute scenarios.`
                )}
              </div>
            </div>
          )}

          {tab === "schedule" && (
            <div className="space-y-6 max-w-3xl animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold uppercase text-white">
                  Tournament Schedule
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Official timetable for check-in, preliminary qualifiers, and championship finals.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl glass-card p-5 text-xs border border-white/10">
                  <span className="font-bold text-white flex items-center gap-2.5">
                    <Calendar size={16} className="text-white" /> Phase 1: Team Roster Check-In &amp; Verification
                  </span>
                  <span className="text-white font-mono font-bold bg-white/15 px-3 py-1 rounded-full border border-white/20">
                    Open Now
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl glass-card p-5 text-xs border border-white/10">
                  <span className="font-bold text-white flex items-center gap-2.5">
                    <Calendar size={16} className="text-white" /> Phase 2: Group Stage Brackets &amp; Semifinals
                  </span>
                  <span className="text-neutral-400 font-mono font-medium">
                    Starts Tomorrow 18:00 IST
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl glass-card p-5 text-xs border border-white/10">
                  <span className="font-bold text-white flex items-center gap-2.5">
                    <Calendar size={16} className="text-white" /> Phase 3: Grand Finals &amp; 24h Prize Payouts
                  </span>
                  <span className="text-neutral-400 font-mono font-medium">
                    Day 3 20:00 IST
                  </span>
                </div>
              </div>
            </div>
          )}

          {tab === "bracket" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold uppercase text-white">
                  Live Tournament Bracket
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Official seeding and live round progression updated in real time.
                </p>
              </div>
              <div className="glass-card rounded-3xl p-12 text-center text-neutral-400 text-xs border border-white/10 space-y-3">
                <Layers size={36} className="mx-auto text-white" />
                <p className="font-bold text-charcoal dark:text-white text-sm">Bracket Seeding in Progress</p>
                <p className="max-w-md mx-auto">
                  Bracket seeds populate automatically once registration slots lock. Team captains receive match slot notifications via WhatsApp.
                </p>
              </div>
            </div>
          )}

          {tab === "faq" && (
            <div className="space-y-6 max-w-3xl animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold uppercase text-charcoal dark:text-white">
                  Tournament FAQ
                </h2>
                <p className="mt-1 text-xs text-charcoal-muted dark:text-[#9A9BA8]">
                  Common questions regarding room credentials, roster changes, and prize distribution.
                </p>
              </div>
              <div className="space-y-3 text-xs">
                <div className="glass-card rounded-2xl p-5 space-y-1.5 border border-charcoal/8 dark:border-white/10">
                  <h4 className="font-bold text-charcoal dark:text-white text-sm">How do I receive the Room ID &amp; Password?</h4>
                  <p className="text-charcoal-muted dark:text-[#9A9BA8] leading-relaxed">
                    Room credentials will be sent to your registered Team Captain's email and WhatsApp 15 minutes before match start time.
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 space-y-1.5 border border-charcoal/8 dark:border-white/10">
                  <h4 className="font-bold text-charcoal dark:text-white text-sm">Can I swap a teammate roster after registering?</h4>
                  <p className="text-charcoal-muted dark:text-[#9A9BA8] leading-relaxed">
                    Yes, substitutions are allowed up to 1 hour before match start time by contacting support at zyroxstudioz@gmail.com with your Order ID.
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 space-y-1.5 border border-charcoal/8 dark:border-white/10">
                  <h4 className="font-bold text-charcoal dark:text-white text-sm">How is the prize money transferred?</h4>
                  <p className="text-charcoal-muted dark:text-[#9A9BA8] leading-relaxed">
                    Prize funds are transferred directly via Razorpay UPI or bank transfer to the winning Captain's account within 24 hours of match conclusion.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
