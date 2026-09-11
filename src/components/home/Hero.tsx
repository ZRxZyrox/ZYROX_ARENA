import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Countdown from "@/components/ui/Countdown";
import type { FeaturedTournament } from "@/types/tournament";
import { useSiteSettings } from "@/lib/siteSettingsStore";
import { Zap, Users, Trophy, ArrowRight } from "lucide-react";

interface Props {
  featured?: FeaturedTournament;
  stats?: { liveEvents?: string | number; players?: string; paidOut?: string };
}

export default function Hero({ featured, stats }: Props) {
  const { settings } = useSiteSettings();

  const liveEvents = stats?.liveEvents ?? settings.liveEventsCount;
  const players = stats?.players ?? settings.activePlayersCount;
  const paidOut = stats?.paidOut ?? settings.paidOutAmount;

  // Box data source: Admin custom Hero Box vs Featured tournament fallback
  const isCustomBox = settings.heroBoxEnabled;

  const boxBadge = isCustomBox ? settings.heroBoxBadge : "⚡ FEATURED TOURNAMENT";
  const boxSubtitle = isCustomBox ? settings.heroBoxSubtitle : `${featured?.game || "Esports"} · ${featured?.format || "Squad"}`;
  const boxTitle = isCustomBox ? settings.heroBoxTitle : featured?.title || "Valorant Winter Circuit Finals";
  const boxStatusText = isCustomBox ? settings.heroBoxStatusText : "Reg closes soon";
  const boxPrizePool = isCustomBox ? settings.heroBoxPrizePool : featured?.prizePool || "₹2,00,000";
  const boxCtaText = isCustomBox ? settings.heroBoxCtaText : "View Details →";
  const boxCtaUrl = isCustomBox ? settings.heroBoxCtaUrl : `/tournaments/${featured?.slug || "winter-circuit-finals"}`;
  const boxCountdownTarget = isCustomBox && settings.heroBoxCountdownDate
    ? new Date(settings.heroBoxCountdownDate)
    : (featured?.registrationCloses || new Date(Date.now() + 3 * 86400000));

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-neon/6 dark:bg-neon/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-gold/8 dark:bg-gold/12 blur-3xl animate-float" />
      <div className="absolute top-1/3 right-10 h-48 w-48 rounded-full bg-coral/6 dark:bg-coral/8 blur-3xl animate-float-slow" />

      <div className="relative mx-auto max-w-7xl w-full px-6 py-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Left — Text Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 text-xs font-bold text-neon"
          >
            <span className="h-2 w-2 rounded-full bg-neon animate-pulse-live" />
            {settings.announcementBanner}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.92] text-charcoal dark:text-white"
          >
            {settings.heroHeadline.includes("Arena") ? (
              <>
                The Arena
                <br />
                is <span className="text-gradient-warm">Open.</span>
              </>
            ) : (
              settings.heroHeadline
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-lg text-base md:text-lg leading-relaxed text-charcoal-muted dark:text-[#9A9BA8] font-medium"
          >
            {settings.heroSubheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/tournaments"
                className="flex items-center gap-2 shimmer-btn rounded-2xl px-8 py-4 text-sm font-bold text-white shadow-glow"
              >
                Browse Tournaments <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/teams"
                className="flex items-center gap-2 glass-card rounded-2xl px-8 py-4 text-sm font-semibold text-charcoal dark:text-white hover:shadow-glass-lg transition-all"
              >
                Approved Teams
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-wrap gap-8 pt-4"
          >
            {[
              { num: liveEvents, label: "Live Events", icon: Zap, color: "text-coral" },
              { num: players, label: "Registered Players", icon: Users, color: "text-neon" },
              { num: paidOut, label: "Paid Out", icon: Trophy, color: "text-gold" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 dark:bg-white/8 backdrop-blur-xl border border-white/90 dark:border-white/12 shadow-glass">
                    <Icon size={18} className={s.color} />
                  </span>
                  <div>
                    <span className="block font-display text-2xl font-bold text-charcoal dark:text-white">{s.num}</span>
                    <span className="text-[11px] uppercase tracking-wider text-charcoal-muted dark:text-[#7A7B88] font-mono">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right — Static Hero Box / Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative"
        >
          {/* Glow ring */}
          <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-neon/20 via-gold/15 to-coral/20 dark:from-neon/15 dark:via-neon/8 dark:to-gold/10 blur-xl animate-float-slow" />

          <div className="relative glass-card rounded-[28px] p-7 shadow-glass-xl animate-float-slow">
            {/* Featured badge */}
            <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-neon to-neon-deep px-4 py-1.5 font-mono text-[10px] font-bold tracking-wider text-white shadow-glow uppercase">
              {boxBadge}
            </span>

            <div className="mt-3 mb-5 flex items-center justify-between">
              <span className="text-eyebrow font-mono text-xs text-charcoal-muted dark:text-[#7A7B88] font-bold">{boxSubtitle}</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-neon font-bold">
                <span className="h-2 w-2 animate-pulse-live rounded-full bg-neon" />
                {boxStatusText}
              </span>
            </div>

            <h3 className="mb-6 font-display text-3xl sm:text-4xl font-bold leading-none text-charcoal dark:text-white">
              {boxTitle}
            </h3>

            <Countdown target={boxCountdownTarget} />

            <div className="mt-6 flex items-end justify-between border-t border-charcoal/8 dark:border-white/8 pt-5">
              <div>
                <span className="block font-display text-4xl font-bold text-gradient-warm">
                  {boxPrizePool}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-muted dark:text-[#7A7B88] font-mono font-bold">Prize Pool</span>
              </div>
              <Link
                to={boxCtaUrl}
                className="rounded-xl bg-gradient-to-r from-neon to-neon-deep px-5 py-3 text-xs font-bold text-white shadow-glow hover:brightness-110 transition-all flex items-center gap-1"
              >
                {boxCtaText}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
