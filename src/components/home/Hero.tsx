import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Countdown from "@/components/ui/Countdown";
import type { FeaturedTournament } from "@/types/tournament";
import { useSiteSettings } from "@/lib/siteSettingsStore";
import { ArrowRight } from "lucide-react";

interface Props {
  featured?: FeaturedTournament;
  stats?: { liveEvents?: string | number; players?: string; paidOut?: string };
}

export default function Hero({ featured }: Props) {
  const { settings } = useSiteSettings();

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
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden">
      <div className="relative mx-auto max-w-7xl w-full px-6 pt-20 pb-8 grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
        {/* Left — Text Content with Ancient Royal Typography & Liquid Glass */}
        <div className="space-y-8">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass-card border border-white/20 px-4 py-1.5 text-xs font-bold text-white shadow-glass"
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse-live shadow-[0_0_8px_#fff]" />
            <span className="font-mono tracking-[0.1em] uppercase text-neutral-200 font-bold text-[11px]">
              {settings.announcementBanner}
            </span>
          </motion.div>

          {/* Headline with Ancient Royal Script in natural casing */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-scripture text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-wide text-white relative"
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

          {/* Subheadline with soothing readability */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-lg text-base md:text-lg leading-relaxed text-neutral-300 font-normal tracking-wide"
          >
            {settings.heroSubheadline}
          </motion.p>

          {/* Royal Action CTAs (120 FPS Smooth) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/tournaments"
                className="royal-btn royal-btn-primary flex items-center gap-2 px-7 py-3.5 text-xs font-bold"
              >
                <span>Browse Tournaments</span>
                <ArrowRight size={15} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/teams"
                className="royal-btn royal-btn-secondary flex items-center gap-2 px-7 py-3.5 text-xs font-bold"
              >
                <span>Approved Teams</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — Ancient Royal Liquid Glass Card (Smooth 120 FPS) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative"
        >
          {/* Subtle monochrome ambient glow */}
          <div className="absolute -inset-2 rounded-[32px] bg-white/10 blur-xl animate-float-slow" />

          {/* Ancient Royal Liquid Glass Card */}
          <div className="glass-card liquid-glass-specular rounded-[28px] p-8 shadow-glass-xl animate-float-slow fps-120 border border-white/20 relative">
            {/* Top specular highlight rim */}
            <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* Featured title badge on top of card */}
            <span className="absolute -top-3.5 left-7 rounded-full bg-white px-4 py-1 font-mono text-[10px] font-bold tracking-[0.15em] text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] uppercase z-20 select-none">
              {boxBadge}
            </span>

            <div className="mt-3 mb-5 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs text-neutral-400 font-semibold tracking-wider uppercase">
                {boxSubtitle}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-200 font-semibold">
                <span className="h-2 w-2 animate-pulse-live rounded-full bg-white shadow-[0_0_8px_#fff]" />
                {boxStatusText}
              </span>
            </div>

            {/* Tournament Title */}
            <h3 className="mb-6 font-display text-2xl sm:text-3xl font-bold leading-snug text-white">
              {boxTitle}
            </h3>

            {/* Smooth Liquid Glass Countdown */}
            <div className="mb-4">
              <Countdown target={boxCountdownTarget} />
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
              <div>
                <span className="block font-display text-3xl font-black text-white tracking-tight">
                  {boxPrizePool}
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-mono font-semibold">Prize Pool</span>
              </div>
              <Link
                to={boxCtaUrl}
                className="royal-btn royal-btn-primary px-5 py-3 text-xs font-bold flex items-center gap-1"
              >
                {boxCtaText}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full-width responsive Uiverse card spanning from left to right of website */}
      <div className="relative mx-auto max-w-7xl w-full px-6 pt-2 pb-12">
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
    </section>
  );
}
