import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { GameCategory } from "@/types/tournament";
import { ArrowRight } from "lucide-react";

export default function GameCategories({ games }: { games: GameCategory[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/8 dark:border-white/8 pb-6">
        <div>
          <p className="font-mono text-xs uppercase text-neon font-bold tracking-widest">Esports Titles</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal dark:text-white">
            Pick Your <span className="text-gradient-warm">Battlefield</span>
          </h2>
          <p className="mt-2 max-w-md text-sm text-charcoal-muted dark:text-[#7A7B88]">
            Every game title features verified prize brackets, custom room settings, and live scoring.
          </p>
        </div>
        <Link to="/tournaments" className="flex items-center gap-1.5 text-sm font-bold text-neon hover:underline">
          All Games <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {games.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -6 }}
          >
            <Link
              to={`/tournaments?game=${g.id}`}
              className="glass-card flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl p-4 text-center transition-all hover:shadow-glass-lg hover:border-neon/40 group"
            >
              <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden>{g.icon}</span>
              <span className="text-sm font-bold text-charcoal dark:text-white group-hover:text-neon transition-colors">{g.name}</span>
              <span className="font-mono text-[10px] text-charcoal-muted dark:text-[#7A7B88]">{g.eventCount} Live Events</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
