import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { Trophy, Award, CheckCircle2, Medal, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PAST_RESULTS = [
  {
    id: "1",
    title: "Valorant Winter Circuit Finals 2026",
    game: "Valorant",
    prizePool: "₹2,00,000",
    winner: "Team Soul Esports",
    runnerUp: "GodLike Official",
    thirdPlace: "Reckoning Esports",
    date: "Jan 20, 2026",
    status: "Payout Complete",
  },
  {
    id: "2",
    title: "BGMI Showdown Season 3",
    game: "BGMI",
    prizePool: "₹1,50,000",
    winner: "Blind Esports",
    runnerUp: "Entity Gaming",
    thirdPlace: "Team XSpark",
    date: "Jan 12, 2026",
    status: "Payout Complete",
  },
  {
    id: "3",
    title: "Free Fire Clash Cup Season 2",
    game: "Free Fire",
    prizePool: "₹1,00,000",
    winner: "Orangutan Gaming",
    runnerUp: "Chemin Esports",
    thirdPlace: "TSM India",
    date: "Dec 28, 2025",
    status: "Payout Complete",
  },
  {
    id: "4",
    title: "FC Pro League Masters",
    game: "FC",
    prizePool: "₹75,000",
    winner: "Charanjot Singh",
    runnerUp: "Sarangaj",
    thirdPlace: "Siddh Chandarana",
    date: "Dec 15, 2025",
    status: "Payout Complete",
  },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-ivory dark:bg-[#0A0A14] text-charcoal dark:text-[#ECEDF0]">
      <Seo
        title="Live Tournament Results & Winner Standings — ZYROX ARENA"
        description="Official results, standings, and verified prize payout confirmations for all ZYROX ARENA esports tournaments."
      />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-14">
        {/* Header */}
        <div className="mb-12 border-b border-charcoal/8 dark:border-white/8 pb-6">
          <p className="font-mono text-xs uppercase text-gold font-bold tracking-widest">Verified Winners &amp; Payouts</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal dark:text-white">
            Tournament <span className="text-gradient-warm">Results</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-charcoal-muted dark:text-[#7A7B88]">
            Official match outcomes, team standings, and verified 24-hour prize payout receipts.
          </p>
        </div>

        {/* Winner Highlights Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {PAST_RESULTS.map((res) => (
            <div key={res.id} className="glass-card rounded-3xl p-7 space-y-5 hover:shadow-glass-lg transition-all">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-neon/10 border border-neon/20 px-3 py-1 font-mono text-xs font-bold text-neon uppercase">
                  {res.game}
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-neon-mint font-bold bg-neon-mint/10 border border-neon-mint/20 px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} /> {res.status}
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold uppercase text-charcoal dark:text-white">{res.title}</h3>
                <p className="text-xs text-charcoal-muted dark:text-[#7A7B88] font-mono mt-1">Concluded on {res.date}</p>
              </div>

              {/* Podium Breakdown */}
              <div className="space-y-2.5 pt-2 border-t border-charcoal/8 dark:border-white/8">
                {/* 1st Place */}
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-gold/20 via-gold/10 to-transparent p-3.5 border border-gold/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold text-white font-bold">
                      <Trophy size={16} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-charcoal dark:text-white">{res.winner}</p>
                      <p className="text-[10px] text-charcoal-muted uppercase font-mono">1st Place Champion</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-bold text-gold">{res.prizePool}</span>
                </div>

                {/* 2nd & 3rd Place */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded-xl bg-ivory-warm dark:bg-white/5 p-3 border border-charcoal/8 dark:border-white/8">
                    <Medal size={15} className="text-charcoal-muted dark:text-[#7A7B88]" />
                    <div>
                      <p className="font-bold text-charcoal dark:text-white text-[11px] truncate">{res.runnerUp}</p>
                      <p className="text-[9px] text-charcoal-muted dark:text-[#7A7B88]">2nd Place</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-ivory-warm dark:bg-white/5 p-3 border border-charcoal/8 dark:border-white/8">
                    <Medal size={15} className="text-coral" />
                    <div>
                      <p className="font-bold text-charcoal dark:text-white text-[11px] truncate">{res.thirdPlace}</p>
                      <p className="text-[9px] text-charcoal-muted dark:text-[#7A7B88]">3rd Place</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center glass-card rounded-3xl p-10 space-y-4">
          <Award size={36} className="text-gold mx-auto" />
          <h3 className="font-display text-2xl font-bold uppercase text-charcoal dark:text-white">Want Your Team Featured Here?</h3>
          <p className="text-sm text-charcoal-muted dark:text-[#7A7B88] max-w-md mx-auto">
            Register for open tournaments today and claim your spot on the official winners leaderboard.
          </p>
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-2 shimmer-btn rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-glow"
          >
            Register Now <ArrowRight size={15} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
