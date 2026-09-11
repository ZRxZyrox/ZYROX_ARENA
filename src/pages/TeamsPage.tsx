import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { useLiveTeams } from "@/lib/registrationStore";
import { Users, ShieldCheck, Search, CheckCircle2 } from "lucide-react";

const GAME_FILTERS = [
  { id: "all", label: "All Games" },
  { id: "bgmi", label: "BGMI" },
  { id: "freefire", label: "Free Fire" },
  { id: "valorant", label: "Valorant" },
  { id: "fc", label: "FC" },
];

export default function TeamsPage() {
  const { approvedTeams, loading } = useLiveTeams();
  const [selectedGame, setSelectedGame] = useState("all");
  const [query, setQuery] = useState("");

  const filteredTeams = approvedTeams.filter((t) => {
    const matchesGame = selectedGame === "all" || t.game.toLowerCase().includes(selectedGame.toLowerCase());
    const matchesSearch =
      !query ||
      t.team_name.toLowerCase().includes(query.toLowerCase()) ||
      t.player_name.toLowerCase().includes(query.toLowerCase()) ||
      t.in_game_id.toLowerCase().includes(query.toLowerCase());
    return matchesGame && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Seo
        title="Official Approved Registered Teams — ZYROX ARENA"
        description="View all officially verified & approved team rosters participating in live and upcoming tournaments."
      />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-14">
        {/* Header */}
        <div className="mb-10 border-b border-charcoal/8 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/15 px-3.5 py-1 text-xs font-bold text-neon uppercase">
              <ShieldCheck size={14} /> Official Verified Rosters
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal">
              Approved <span className="text-gradient-warm">Teams</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-charcoal-muted font-medium">
              Real-time directory of verified team captains, squad rosters, and slot confirmations for live tournaments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-charcoal-muted font-bold">
              Total Approved Teams: <strong className="text-gold text-sm">{approvedTeams.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {GAME_FILTERS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGame(g.id)}
                className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                  selectedGame === g.id
                    ? "bg-neon text-white shadow-glow"
                    : "glass-card text-charcoal-muted hover:text-charcoal border border-charcoal/10"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search team or captain..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm pl-10 pr-4 py-2 text-xs text-charcoal outline-none focus:border-neon font-medium"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-charcoal-muted font-bold">
            Loading approved team rosters...
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="glass-card rounded-3xl p-14 text-center space-y-3">
            <Users size={38} className="text-charcoal-muted mx-auto" />
            <h3 className="font-display text-xl font-bold uppercase text-charcoal">No Approved Teams Found</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              No registered teams match your search or filter. Registered teams appear automatically after admin approval.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => (
              <div key={team.id} className="glass-card rounded-3xl p-6 space-y-4 hover:shadow-glass-lg transition-all border border-charcoal/10">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-neon/10 border border-neon/20 px-3 py-1 font-mono text-xs font-bold text-neon uppercase">
                    {team.game} • {team.mode}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-neon-mint font-bold bg-neon-mint/10 border border-neon-mint/20 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 size={12} /> Approved
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-charcoal">{team.team_name}</h3>
                  <p className="text-xs text-charcoal-muted font-medium mt-0.5">Captain: <strong className="text-charcoal">{team.player_name}</strong></p>
                  <p className="text-[11px] font-mono text-gold-warm mt-1 font-bold">IGN: {team.in_game_id}</p>
                </div>

                {/* Teammates List */}
                {team.teammates && team.teammates.length > 0 && (
                  <div className="pt-3 border-t border-charcoal/8 space-y-2">
                    <p className="text-[10px] font-mono text-charcoal-muted uppercase font-bold">Squad Roster ({team.teammates.length + 1} Players)</p>
                    <div className="space-y-1.5 text-xs">
                      {team.teammates.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-xl bg-ivory-warm px-3 py-1.5 border border-charcoal/5">
                          <span className="font-bold text-charcoal text-[11px]">{p.name}</span>
                          <span className="font-mono text-[10px] text-charcoal-muted">ID: {p.inGameId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
