import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { TournamentFormData } from "@/components/admin/TournamentModal";

export interface TournamentRecord extends TournamentFormData {
  id: string;
}

const LOCAL_STORAGE_KEY = "zyrox_live_tournaments_v3";

export const INITIAL_TOURNAMENTS: TournamentRecord[] = [
  {
    id: "1",
    slug: "winter-circuit-finals",
    title: "Valorant Winter Circuit Finals",
    game: "Valorant",
    game_slug: "valorant",
    mode: "squad",
    entry_fee: 500,
    prize_pool_display: "₹2,00,000",
    max_slots: 64,
    status: "live",
    banner_variant: "b1",
    published: true,
    rules: "Official 5v5 Tactical Shooter Tournament. Emulators strictly banned. Mandatory anti-cheat check-in.",
  },
  {
    id: "2",
    slug: "showdown-season-4",
    title: "BGMI Showdown Season 4",
    game: "BGMI",
    game_slug: "bgmi",
    mode: "squad",
    entry_fee: 250,
    prize_pool_display: "₹1,50,000",
    max_slots: 100,
    status: "reg_open",
    banner_variant: "b2",
    published: true,
    rules: "Squad TPP Erangel & Miramar. Mobile devices only. Screenshots required after each match.",
  },
  {
    id: "3",
    slug: "free-fire-clash-cup",
    title: "Free Fire Clash Cup 2026",
    game: "Free Fire",
    game_slug: "freefire",
    mode: "squad",
    entry_fee: 150,
    prize_pool_display: "₹1,00,000",
    max_slots: 96,
    status: "reg_open",
    banner_variant: "b3",
    published: true,
    rules: "Battle Royale Squad Clash. Squad Captains must check-in 15 mins prior to room creation.",
  },
  {
    id: "4",
    slug: "pro-league-qualifiers",
    title: "FC Pro League Championship",
    game: "FC",
    game_slug: "fc",
    mode: "solo",
    entry_fee: 100,
    prize_pool_display: "₹75,000",
    max_slots: 128,
    status: "reg_open",
    banner_variant: "b2",
    published: true,
    rules: "1v1 Head-to-Head Competitive Mode. 6 minute halves. Standard competitive squad rosters.",
  },
  {
    id: "5",
    slug: "valorant-champions-invitational",
    title: "Valorant Champions Invitational 2026",
    game: "Valorant",
    game_slug: "valorant",
    mode: "squad",
    entry_fee: 600,
    prize_pool_display: "₹3,50,000",
    max_slots: 32,
    status: "upcoming",
    banner_variant: "b1",
    published: true,
    rules: "Premier bracket tournament. Invitation & qualifier seeding. Official Riot anti-cheat vanguard inspection.",
  },
  {
    id: "6",
    slug: "bgmi-masters-season-3",
    title: "BGMI Masters Season 3 Grand Finals",
    game: "BGMI",
    game_slug: "bgmi",
    mode: "squad",
    entry_fee: 300,
    prize_pool_display: "₹2,50,000",
    max_slots: 120,
    status: "completed",
    banner_variant: "b3",
    published: true,
    rules: "Completed season tournament. Prize pool paid out to top 3 squads. Winner: Team Soul Esports.",
  },
];

// Helper to load stored tournaments safely without re-seeding when deleted to 0
export function getStoredTournaments(): TournamentRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed; // Respect empty array [] if deleted
    }
  } catch {
    // fallback
  }
  return INITIAL_TOURNAMENTS;
}

// Helper to save tournaments
export function saveTournamentsToStore(tournaments: TournamentRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tournaments));
    window.dispatchEvent(new Event("zyrox_tournaments_updated"));
  } catch {
    // ignore
  }
}

// React custom hook for live reactive tournament synchronization
export function useLiveTournaments() {
  const [tournaments, setTournaments] = useState<TournamentRecord[]>(getStoredTournaments());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await supabase
          .from("tournaments")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted: TournamentRecord[] = data.map((t: any) => ({
            id: t.id,
            slug: t.slug,
            title: t.title,
            game: t.game || (t.game_slug ? t.game_slug.toUpperCase() : "Esports"),
            game_slug: t.game_slug ?? "esports",
            mode: (t.mode as any) ?? "squad",
            entry_fee: t.entry_fee ?? 0,
            prize_pool_display: t.prize_pool_display ?? `₹${t.prize_pool?.toLocaleString("en-IN") || "0"}`,
            max_slots: t.max_slots ?? 100,
            status: (t.status as any) ?? "reg_open",
            banner_variant: (t.banner_variant as any) ?? "b1",
            published: t.published ?? true,
            rules: t.rules ?? "Standard Zyrox Arena Fair Play & Anti-Cheat rules apply.",
          }));

          setTournaments(formatted);
          saveTournamentsToStore(formatted);
        }
      } catch {
        // Fallback to cached local store
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setTournaments(getStoredTournaments());
    };

    window.addEventListener("zyrox_tournaments_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_tournaments_updated", handleUpdate);
    };
  }, []);

  const publishedTournaments = tournaments.filter((t) => t.published);

  return { tournaments, publishedTournaments, loading, setTournaments };
}
