import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { TournamentCardData } from "@/types/tournament";
import { Trophy, ArrowRight, ShieldCheck, Users } from "lucide-react";

const BANNER_CLASS: Record<TournamentCardData["bannerVariant"], string> = {
  b1: "bg-gradient-to-br from-white/15 via-white/5 to-transparent border-b border-white/10",
  b2: "bg-gradient-to-br from-white/10 via-white/5 to-transparent border-b border-white/10",
  b3: "bg-gradient-to-br from-white/20 via-white/5 to-transparent border-b border-white/10",
};

const STATUS_STYLE: Record<TournamentCardData["status"], { label: string; className: string }> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-white/10 text-neutral-300 border-white/20 font-bold",
  },
  reg_open: {
    label: "Registration Open",
    className: "bg-white/15 text-white border-white/30 font-bold shadow-[0_0_10px_rgba(255,255,255,0.15)]",
  },
  live: {
    label: "● LIVE NOW",
    className: "bg-white/20 text-white border-white/40 font-bold backdrop-blur-md animate-pulse-live shadow-[0_0_12px_rgba(255,255,255,0.3)]",
  },
  completed: {
    label: "Completed",
    className: "bg-white/5 text-neutral-400 border-white/10",
  },
};

export default function TournamentCard({ t }: { t: TournamentCardData }) {
  const statusInfo = STATUS_STYLE[t.status] || STATUS_STYLE.reg_open;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fps-120"
    >
      <Link
        to={`/tournaments/${t.slug}`}
        className="block glass-card liquid-glass-specular rounded-[26px] overflow-hidden p-0 transition-all hover:shadow-glass-lg group border border-white/20 hover:border-white/45 relative"
      >
        {/* Specular top rim highlight */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-20" />

        {/* Card Header Banner */}
        <div className={`flex h-[130px] items-start justify-between p-5 relative ${BANNER_CLASS[t.bannerVariant]}`}>
          <span className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            {t.mode}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-neutral-300 uppercase tracking-wider">
              {t.game}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-300 font-semibold">
              <ShieldCheck size={13} className="text-white" /> Verified
            </span>
          </div>

          <h3 className="font-display text-lg md:text-xl font-bold text-white group-hover:text-neutral-300 transition-colors line-clamp-1">
            {t.title}
          </h3>

          {/* Quick Info Badges */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-300">
            <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <Users size={12} className="text-white" />
              <span>{t.mode === "squad" ? "4v4 Squad" : "1v1 Solo"}</span>
            </span>
            <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              Anti-Cheat Enforced
            </span>
          </div>

          {/* Card Footer: Prize Pool & CTA with Smooth Royal Button */}
          <div className="flex items-end justify-between border-t border-white/10 pt-4">
            <div>
              <span className="block font-display text-2xl font-bold text-white tracking-tight">
                {t.prizePool}
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-400 font-mono font-semibold flex items-center gap-1">
                <Trophy size={12} className="text-white" /> Prize Pool
              </span>
            </div>

            <span className="royal-btn royal-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold">
              <span>{t.status === "live" ? "View Bracket" : "Register"}</span>
              <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
