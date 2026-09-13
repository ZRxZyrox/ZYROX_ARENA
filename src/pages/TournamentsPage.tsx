import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TournamentCard from "@/components/tournament/TournamentCard";
import Seo from "@/components/ui/Seo";
import { useLiveTournaments } from "@/lib/tournamentStore";
import type { TournamentCardData } from "@/types/tournament";
import { Search, Trophy, RotateCcw, Flame, ArrowRight } from "lucide-react";

const GAME_TABS = [
  { id: "all", label: "All Games", icon: "🏆" },
  { id: "bgmi", label: "BGMI", icon: "🎯" },
  { id: "freefire", label: "Free Fire", icon: "🔥" },
  { id: "valorant", label: "Valorant", icon: "⚡" },
  { id: "fc", label: "FC Mobile", icon: "⚽" },
  { id: "cricket", label: "Cricket", icon: "🏏" },
];

const STATUS_TABS = [
  { id: "all", label: "All Statuses" },
  { id: "live", label: "Live Now", dot: "bg-white animate-ping shadow-[0_0_6px_#fff]" },
  { id: "reg_open", label: "Registration Open", dot: "bg-white" },
  { id: "upcoming", label: "Upcoming", dot: "bg-neutral-400" },
  { id: "completed", label: "Past / Completed", dot: "bg-neutral-500" },
];

export default function TournamentsPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const { publishedTournaments, loading } = useLiveTournaments();

  const gameFilter = params.get("game") || "all";
  const statusFilter = params.get("status") || "all";

  const handleGameSelect = (g: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (g === "all") next.delete("game");
      else next.set("game", g);
      return next;
    });
  };

  const handleStatusSelect = (s: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (s === "all") next.delete("status");
      else next.set("status", s);
      return next;
    });
  };

  const handleResetFilters = () => {
    setQuery("");
    setParams({});
  };

  const filteredTournaments: TournamentCardData[] = useMemo(() => {
    return publishedTournaments
      .filter((t) => {
        const matchesQuery =
          !query ||
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.game.toLowerCase().includes(query.toLowerCase());
        const matchesGame =
          gameFilter === "all" ||
          t.game.toLowerCase().replace(/\s+/g, "") === gameFilter.toLowerCase().replace(/\s+/g, "");
        const matchesStatus =
          statusFilter === "all" || t.status === statusFilter;
        return matchesQuery && matchesGame && matchesStatus;
      })
      .map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        game: t.game,
        mode: t.mode,
        status: t.status,
        bannerVariant: t.banner_variant,
        prizePool: t.prize_pool_display,
      }));
  }, [publishedTournaments, query, gameFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-transparent text-white transition-colors relative">
      <Seo
        title="All Esports Tournaments — ZYROX ARENA"
        description="Browse live and upcoming high-stakes BGMI, Free Fire, Valorant, FC, and Cricket tournaments."
      />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-14 safe-bottom-dock">
        <div className="border-b border-white/10 pb-6">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-white font-bold tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">
            <Trophy size={13} className="text-white" /> Official Tournaments Directory
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl text-white">
            Esports <span className="text-gradient-warm">Tournaments</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-400 font-medium max-w-2xl">
            Browse verified cash brackets. Filter by competitive title, mode, or registration status. Captains receive private room passcodes directly.
          </p>
        </div>

        {/* Featured Tournament Spotlight Banner */}
        {publishedTournaments.length > 0 && !query && gameFilter === "all" && statusFilter === "all" && (
          <div className="mt-8 glass-card liquid-glass-specular rounded-3xl p-6 sm:p-8 border border-white/20 relative overflow-hidden fps-120">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-20" />
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-white font-bold tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <Flame size={12} className="text-white" /> FEATURED MAJOR TOURNAMENT
                  </span>
                  <span className="font-mono text-[10px] uppercase text-neutral-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                    {publishedTournaments[0]?.game}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-neutral-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                    {publishedTournaments[0]?.mode === "squad" ? "Squad (4v4)" : "Solo (1v1)"}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {publishedTournaments[0]?.title}
                </h2>
                <p className="text-xs text-neutral-300 line-clamp-2">
                  {publishedTournaments[0]?.rules || "High-stakes verified championship bracket. Fast check-ins, strict anti-cheat enforcement, and direct prize pool transfers."}
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-mono">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Prize Pool</span>
                    <strong className="text-white font-display text-base sm:text-lg font-bold">{publishedTournaments[0]?.prize_pool_display}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Entry Fee</span>
                    <strong className="text-white font-bold">{publishedTournaments[0]?.entry_fee === 0 ? "FREE" : `₹${publishedTournaments[0]?.entry_fee}`}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Max Teams</span>
                    <strong className="text-white font-bold">{publishedTournaments[0]?.max_slots} Slots</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
                <Link
                  to={`/tournaments/${publishedTournaments[0]?.slug}`}
                  className="royal-btn royal-btn-primary px-8 py-3 text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Enter Tournament</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to={`/register?tournament=${publishedTournaments[0]?.slug}`}
                  className="royal-btn royal-btn-secondary px-8 py-3 text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Quick Registration</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="mt-8 space-y-4">
          {/* Row 1: Search and Game Selectors */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tournaments or games..."
                className="w-full rounded-2xl glass-card pl-11 pr-4 py-3 text-xs text-white outline-none focus:border-white font-medium shadow-glass placeholder:text-neutral-500 border border-white/15"
              />
            </div>

            {/* Game Filter Pills */}
            <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-1">
              {GAME_TABS.map((g) => {
                const isActive = gameFilter === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => handleGameSelect(g.id)}
                    className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.35)]"
                        : "glass-card text-neutral-300 hover:text-white border border-white/15"
                    }`}
                  >
                    <span>{g.icon}</span>
                    <span>{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Status Filter Pills & Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-400 mr-1">
                STATUS:
              </span>
              {STATUS_TABS.map((s) => {
                const isActive = statusFilter === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleStatusSelect(s.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white text-black font-black shadow-sm"
                        : "bg-white/5 text-neutral-300 hover:text-white border border-white/10"
                    }`}
                  >
                    {s.dot && <span className={`h-2 w-2 rounded-full ${s.dot}`} />}
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-neutral-400 font-bold">
                Showing <strong className="text-white">{filteredTournaments.length}</strong> of{" "}
                {publishedTournaments.length}
              </span>
              {(gameFilter !== "all" || statusFilter !== "all" || query) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-white hover:underline"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <p className="text-neutral-400 text-sm col-span-3 py-12 text-center font-mono">
              Loading live tournaments…
            </p>
          )}
          {!loading && filteredTournaments.length === 0 && (
            <div className="col-span-3 py-20 text-center glass-card rounded-3xl p-10 space-y-4 border border-charcoal/10 dark:border-white/10">
              <Trophy size={42} className="text-charcoal-muted dark:text-[#7A7B88] mx-auto" />
              <h3 className="font-display text-2xl font-bold uppercase text-charcoal dark:text-white">
                No Tournaments Match Your Filter
              </h3>
              <p className="text-xs text-charcoal-muted dark:text-[#9A9BA8] max-w-md mx-auto">
                No active brackets found for this specific game and status combination. Reset your filters to explore other tournaments!
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 shimmer-btn rounded-2xl px-6 py-3 text-xs font-bold text-white shadow-glow"
              >
                <RotateCcw size={14} /> Clear All Filters
              </button>
            </div>
          )}
          {filteredTournaments.map((t) => (
            <TournamentCard key={t.id} t={t} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
