import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import Countdown from "@/components/ui/Countdown";
import { useLiveTournaments } from "@/lib/tournamentStore";
import { useLiveTeams } from "@/lib/registrationStore";
import { useAuth } from "@/context/AuthContext";
import { Trophy, ShieldCheck, Users, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-ivory dark:bg-[#0A0A14] text-charcoal dark:text-[#ECEDF0]">
      {tournament && (
        <Seo
          title={`${tournament.title} — ${tournament.game} Tournament`}
          description={`Register your team for ${tournament.title}. Prize Pool: ${tournament.prize_pool_display}. Mode: ${tournament.mode.toUpperCase()}.`}
        />
      )}
      <Header />

      {/* Hero Header */}
      <section className="relative border-b border-charcoal/8 mesh-gradient px-6 py-16 md:px-14">
        <div className="mx-auto max-w-7xl">
          <span className="inline-block rounded-full bg-gold/15 border border-gold/30 px-3 py-1 font-mono text-xs font-bold text-gold-warm uppercase tracking-wider">
            {tournament?.game ?? "Esports Tournament"}
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-charcoal md:text-6xl">
            {tournament?.title ?? "Tournament Details"}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-8 md:gap-12">
            <div>
              <span className="block font-display text-4xl text-gradient-warm font-bold">
                {tournament?.prize_pool_display ?? "—"}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-mono font-bold">Prize Pool</span>
            </div>

            <div>
              <span className="block font-mono text-xl text-charcoal font-bold">
                ₹{tournament?.entry_fee ?? 0}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-mono font-bold">Entry Fee</span>
            </div>

            <div>
              <span className="block font-mono text-xl text-neon font-bold uppercase">
                {tournament?.mode ?? "Squad"}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-mono font-bold">Game Mode</span>
            </div>

            <Countdown target={targetCountdownDate} />

            {isAlreadyRegistered ? (
              <div className="flex items-center gap-2 rounded-2xl bg-neon-mint/15 border border-neon-mint/30 px-6 py-4 text-xs font-bold text-neon-mint shadow-warm">
                <CheckCircle2 size={18} />
                <span>Already Applied (Slot Confirmed ✓)</span>
              </div>
            ) : (
              <Link
                to={`/tournaments/${tournament?.slug || slug}/register`}
                className="flex items-center gap-2 shimmer-btn rounded-2xl px-8 py-4 text-sm font-bold text-white shadow-glow hover:scale-105 transition-transform"
              >
                <span>Register Team Roster</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <nav className="border-b border-charcoal/8 px-6 md:px-14 bg-white/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex gap-2 overflow-x-auto">
          {(["overview", "rules", "schedule", "bracket", "faq"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${tab === t ? "border-b-2 border-neon text-neon" : "text-charcoal-muted hover:text-charcoal"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <section className="mx-auto max-w-7xl min-h-[350px] px-6 py-12 md:px-14">
        {tab === "overview" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold uppercase text-charcoal">Tournament Overview</h2>
            <p className="text-sm text-charcoal-muted leading-relaxed max-w-3xl font-medium">
              Welcome to {tournament?.title || "this tournament"}. Compete against top esports athletes across India for high-stakes glory and verified cash prize payouts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="glass-card rounded-3xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-gold-warm font-bold text-sm">
                  <Trophy size={18} /> Direct Cash Payouts
                </div>
                <p className="text-xs text-charcoal-muted">Prizes transferred directly via Bank/UPI within 24 hours of finals.</p>
              </div>
              <div className="glass-card rounded-3xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-neon font-bold text-sm">
                  <ShieldCheck size={18} /> Anti-Cheat Enforced
                </div>
                <p className="text-xs text-charcoal-muted">Strict screen-recording, device check-ins, and anti-emulator checks.</p>
              </div>
              <div className="glass-card rounded-3xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-charcoal font-bold text-sm">
                  <Users size={18} /> Verified Rosters
                </div>
                <p className="text-xs text-charcoal-muted">Only registered and approved team captains receive room ID &amp; passcode.</p>
              </div>
            </div>
          </div>
        )}

        {tab === "rules" && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="font-display text-2xl font-bold uppercase text-charcoal">Match Rules &amp; Regulations</h2>
            <div className="glass-card rounded-3xl p-6 text-xs text-charcoal leading-relaxed whitespace-pre-line font-medium">
              {tournament?.rules || "Standard Zyrox Arena Fair Play & Anti-Cheat rules apply."}
            </div>
          </div>
        )}

        {tab === "schedule" && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="font-display text-2xl font-bold uppercase text-charcoal">Tournament Schedule</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl glass-card p-4 text-xs">
                <span className="font-bold text-charcoal flex items-center gap-2"><Calendar size={15} className="text-gold" /> Phase 1: Team Roster Check-In</span>
                <span className="text-neon font-mono font-bold">Open Now</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl glass-card p-4 text-xs">
                <span className="font-bold text-charcoal flex items-center gap-2"><Calendar size={15} className="text-gold" /> Phase 2: Group Stage Brackets</span>
                <span className="text-charcoal-muted font-mono font-medium">Starts Tomorrow 18:00 IST</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl glass-card p-4 text-xs">
                <span className="font-bold text-charcoal flex items-center gap-2"><Calendar size={15} className="text-gold" /> Phase 3: Grand Finals &amp; Payouts</span>
                <span className="text-charcoal-muted font-mono font-medium">Day 3 20:00 IST</span>
              </div>
            </div>
          </div>
        )}

        {tab === "bracket" && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold uppercase text-charcoal">Live Tournament Bracket</h2>
            <div className="glass-card rounded-3xl p-10 text-center text-charcoal-muted text-xs">
              Bracket slots will populate automatically once registration closes. Check back for live match seeds!
            </div>
          </div>
        )}

        {tab === "faq" && (
          <div className="space-y-4 max-w-3xl">
            <h2 className="font-display text-2xl font-bold uppercase text-charcoal">Tournament FAQ</h2>
            <div className="space-y-3 text-xs">
              <div className="glass-card rounded-2xl p-5 space-y-1">
                <h4 className="font-bold text-charcoal">How do I receive the Room ID &amp; Password?</h4>
                <p className="text-charcoal-muted">Room credentials will be sent to your registered Team Captain's email and WhatsApp 15 minutes before match start time.</p>
              </div>
              <div className="glass-card rounded-2xl p-5 space-y-1">
                <h4 className="font-bold text-charcoal">Can I swap a teammate roster after registering?</h4>
                <p className="text-charcoal-muted">Yes, substitutions are allowed up to 1 hour before match start time by contacting support at zyroxstudioz@gmail.com.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
