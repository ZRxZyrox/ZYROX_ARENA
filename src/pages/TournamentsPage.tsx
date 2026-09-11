import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TournamentCard from "@/components/tournament/TournamentCard";
import Seo from "@/components/ui/Seo";
import { useLiveTournaments } from "@/lib/tournamentStore";
import type { TournamentCardData } from "@/types/tournament";

export default function TournamentsPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const { publishedTournaments, loading } = useLiveTournaments();

  const gameFilter = params.get("game");
  const statusFilter = params.get("status");

  const filteredTournaments: TournamentCardData[] = useMemo(() => {
    return publishedTournaments
      .filter((t) => {
        const matchesQuery = !query || t.title.toLowerCase().includes(query.toLowerCase()) || t.game.toLowerCase().includes(query.toLowerCase());
        const matchesGame = !gameFilter || t.game_slug.toLowerCase() === gameFilter.toLowerCase() || t.game.toLowerCase() === gameFilter.toLowerCase();
        const matchesStatus = !statusFilter || t.status === statusFilter;
        return matchesQuery && matchesGame && matchesStatus;
      })
      .map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        game: t.game,
        bannerVariant: (t.banner_variant as any) ?? "b1",
        status: (t.status as any) ?? "reg_open",
        mode: (t.mode as any) ?? "squad",
        prizePool: t.prize_pool_display,
      }));
  }, [publishedTournaments, query, gameFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Seo
        title="All Esports Tournaments — ZYROX ARENA"
        description="Browse live and upcoming high-stakes BGMI, Free Fire, Valorant, FC, and Cricket tournaments."
      />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-14">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight md:text-5xl text-charcoal">
          Esports <span className="text-gradient-warm">Tournaments</span>
        </h1>
        <p className="mt-2 text-xs text-charcoal-muted font-medium">
          Filter events by game, format, or registration status. Lock in your team roster and claim cash prizes.
        </p>

        {/* Filter Toolbar */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tournaments…"
            className="w-full sm:w-64 rounded-2xl glass-card px-4 py-3 text-xs text-charcoal outline-none focus:border-neon font-medium shadow-glass"
          />

          <button
            onClick={() => setParams(new URLSearchParams())}
            className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
              !gameFilter ? "bg-neon text-white shadow-glow" : "glass-card text-charcoal-muted hover:text-charcoal"
            }`}
          >
            All Games
          </button>

          {["bgmi", "freefire", "valorant", "fc", "cricket"].map((g) => (
            <button
              key={g}
              onClick={() =>
                setParams((p) => {
                  p.set("game", g);
                  return p;
                })
              }
              className={`rounded-2xl px-4 py-2.5 text-xs font-bold uppercase transition-all ${
                gameFilter === g ? "bg-neon text-white shadow-glow" : "glass-card text-charcoal-muted hover:text-charcoal"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Tournaments Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && <p className="text-charcoal-muted text-sm col-span-3">Loading live tournaments…</p>}
          {!loading && filteredTournaments.length === 0 && (
            <div className="col-span-3 py-16 text-center text-charcoal-muted text-sm glass-card rounded-3xl">
              No tournaments match your filter. Check back soon for new bracket announcements!
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
