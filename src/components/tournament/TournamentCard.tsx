import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { TournamentCardData } from "@/types/tournament";
import { Trophy, ArrowRight, ShieldCheck } from "lucide-react";

const BANNER_CLASS: Record<TournamentCardData["bannerVariant"], string> = {
  b1: "bg-gradient-to-br from-neon/15 via-gold/10 to-transparent border-b border-neon/20",
  b2: "bg-gradient-to-br from-gold/20 via-orange/10 to-transparent border-b border-gold/20",
  b3: "bg-gradient-to-br from-coral/15 via-neon/10 to-transparent border-b border-coral/20",
};

const STATUS_STYLE: Record<TournamentCardData["status"], { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-charcoal/10 text-charcoal border-charcoal/20" },
  reg_open: { label: "Registration Open", className: "bg-neon/15 text-neon border-neon/30" },
  live: { label: "● LIVE NOW", className: "bg-coral/15 text-coral border-coral/30 font-bold animate-pulse-live" },
  completed: { label: "Completed", className: "bg-charcoal-muted/15 text-charcoal-muted border-charcoal-muted/30" },
};

export default function TournamentCard({ t }: { t: TournamentCardData }) {
  const statusInfo = STATUS_STYLE[t.status] || STATUS_STYLE.reg_open;

  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.25 }}>
      <Link
        to={`/tournaments/${t.slug}`}
        className="block glass-card rounded-[24px] overflow-hidden p-0 transition-all hover:shadow-glass-lg group"
      >
        <div className={`flex h-[130px] items-start justify-between p-5 ${BANNER_CLASS[t.bannerVariant]}`}>
          <span className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
          <span className="rounded-full border border-white/60 bg-white/70 backdrop-blur-md px-3 py-1 font-mono text-[10px] font-bold uppercase text-charcoal shadow-glass">
            {t.mode}
          </span>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-gold uppercase tracking-wider">{t.game}</span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-charcoal-muted">
              <ShieldCheck size={12} className="text-neon" /> Verified
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold uppercase text-charcoal group-hover:text-neon transition-colors line-clamp-1">
            {t.title}
          </h3>

          <div className="flex items-end justify-between border-t border-charcoal/8 pt-4">
            <div>
              <span className="block font-display text-2xl font-bold text-gradient-warm">{t.prizePool}</span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-mono flex items-center gap-1">
                <Trophy size={11} className="text-gold" /> Prize Pool
              </span>
            </div>

            <span className="inline-flex items-center gap-1 rounded-xl bg-charcoal px-4 py-2.5 text-xs font-bold text-white shadow-glass group-hover:bg-neon group-hover:shadow-glow transition-all">
              <span>{t.status === "live" ? "View Bracket" : "Register"}</span>
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
