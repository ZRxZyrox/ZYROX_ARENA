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
  { id: "fc", label: "FC Mobile" },
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
    <div className="min-h-screen bg-transparent text-charcoal dark:text-[#ECEDF0] transition-colors relative">
      <Seo
        title="Official Approved Registered Teams — ZYROX ARENA"
        description="View all officially verified & approved team rosters participating in live and upcoming tournaments."
      />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-14 safe-bottom-dock">
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold text-white uppercase">
              <ShieldCheck size={14} className="text-white" /> Official Verified Rosters
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold uppercase text-white">
              Approved <span className="text-gradient-warm">Teams</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-neutral-400 font-medium">
              Real-time directory of verified team captains, squad rosters, and slot confirmations for live tournaments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-400 font-bold">
              Total Approved Teams: <strong className="text-white text-sm">{approvedTeams.length}</strong>
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
                    ? "bg-white text-black shadow-glow font-black"
                    : "glass-card text-neutral-400 hover:text-white border border-white/10"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search team or captain..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-white font-medium placeholder:text-neutral-500"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-neutral-400 font-bold">
            Loading approved team rosters...
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="glass-card rounded-3xl p-14 text-center space-y-3 border border-white/10">
            <Users size={38} className="text-neutral-500 mx-auto" />
            <h3 className="font-display text-xl font-bold uppercase text-white">No Approved Teams Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              No registered teams match your search or filter. Registered teams appear automatically after admin verification.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="glass-card rounded-3xl p-6 space-y-4 hover:shadow-glass-lg transition-all border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 font-mono text-xs font-bold text-white uppercase">
                    {team.game} • {team.mode}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-white font-bold bg-white/15 border border-white/25 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 size={12} className="text-white" /> Approved
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-white">{team.team_name}</h3>
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">
                    Captain: <strong className="text-white">{team.player_name}</strong>
                  </p>
                  <p className="text-[11px] font-mono text-neutral-300 mt-1 font-bold">
                    IGN: {team.in_game_id}
                  </p>
                </div>

                {/* Teammates List */}
                {team.teammates && team.teammates.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase font-bold">
                      Squad Roster ({team.teammates.length + 1} Players)
                    </p>
                    <div className="space-y-1.5 text-xs">
                      {team.teammates.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-1.5 border border-white/5"
                        >
                          <span className="font-bold text-white text-[11px]">{p.name}</span>
                          <span className="font-mono text-[10px] text-neutral-400">ID: {p.inGameId}</span>
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
