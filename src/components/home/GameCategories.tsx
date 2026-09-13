import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { GameCategory } from "@/types/tournament";
import { ArrowRight, Trophy } from "lucide-react";

const DEFAULT_GAMES: GameCategory[] = [
  { id: "bgmi", name: "BGMI", icon: "🎯", eventCount: 8 },
  { id: "freefire", name: "Free Fire", icon: "🔥", eventCount: 6 },
  { id: "valorant", name: "Valorant", icon: "⚡", eventCount: 5 },
  { id: "fc", name: "FC Mobile", icon: "⚽", eventCount: 4 },
  { id: "cricket", name: "Cricket", icon: "🏏", eventCount: 3 },
  { id: "all", name: "Custom Scrims", icon: "🏆", eventCount: 12 },
];

export default function GameCategories({ games = DEFAULT_GAMES }: { games?: GameCategory[] }) {
  const displayGames = games && games.length > 0 ? games : DEFAULT_GAMES;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-neutral-300 font-bold tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
            <Trophy size={13} className="text-white" /> Featured Games
          </span>
          <h2 className="mt-2.5 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Pick Your <span className="text-gradient-warm">Battlefield</span>
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Verified prize pools &amp; instant room passcodes.
          </p>
        </div>
        <Link
          to="/tournaments"
          className="royal-btn royal-btn-secondary flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all group"
        >
          <span>All Tournaments</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {displayGames.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="fps-120"
          >
            <Link
              to={g.id === "all" ? "/tournaments" : `/tournaments?game=${g.id}`}
              className="royal-liquid-card flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl p-4 text-center transition-all group"
            >
              <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden>
                {g.icon}
              </span>
              <span className="font-display text-xs font-bold uppercase tracking-wider text-white group-hover:text-neutral-300 transition-colors">
                {g.name}
              </span>
              <span className="font-mono text-[10px] font-bold text-neutral-300 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full">
                {g.eventCount} Events
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
