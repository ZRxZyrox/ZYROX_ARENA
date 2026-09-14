import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { logAdminAction } from "./auditLogger";

export interface TournamentResult {
  id: string;
  title: string;
  game: string;
  prizePool: string;
  winner: string;
  runnerUp: string;
  thirdPlace: string;
  date: string;
  status: "Payout Complete" | "Under Verification" | "Processing";
  createdAt?: string;
}

const LOCAL_STORAGE_KEY = "zyrox_tournament_results_v1";

export const INITIAL_RESULTS: TournamentResult[] = [
  {
    id: "res-1",
    title: "Valorant Winter Circuit Finals 2026",
    game: "Valorant",
    prizePool: "₹2,00,000",
    winner: "Team Soul Esports",
    runnerUp: "GodLike Official",
    thirdPlace: "Reckoning Esports",
    date: "Jan 20, 2026",
    status: "Payout Complete",
  },
  {
    id: "res-2",
    title: "BGMI Showdown Season 3",
    game: "BGMI",
    prizePool: "₹1,50,000",
    winner: "Blind Esports",
    runnerUp: "Entity Gaming",
    thirdPlace: "Team XSpark",
    date: "Jan 12, 2026",
    status: "Payout Complete",
  },
  {
    id: "res-3",
    title: "Free Fire Clash Cup Season 2",
    game: "Free Fire",
    prizePool: "₹1,00,000",
    winner: "Orangutan Gaming",
    runnerUp: "Chemin Esports",
    thirdPlace: "TSM India",
    date: "Dec 28, 2025",
    status: "Payout Complete",
  },
  {
    id: "res-4",
    title: "FC Pro League Masters",
    game: "FC",
    prizePool: "₹75,000",
    winner: "Charanjot Singh",
    runnerUp: "Sarangaj",
    thirdPlace: "Siddh Chandarana",
    date: "Dec 15, 2025",
    status: "Payout Complete",
  },
];

export function getStoredResults(): TournamentResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_RESULTS;
}

export function saveResultsToStore(results: TournamentResult[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results));
    window.dispatchEvent(new Event("zyrox_results_updated"));
  } catch {
    // ignore
  }
}

export function useLiveResults() {
  const [results, setResults] = useState<TournamentResult[]>(getStoredResults());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await (supabase.from("tournament_results") as any)
          .select("*")
          .order("date", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: TournamentResult[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            game: d.game,
            prizePool: d.prize_pool || d.prizePool,
            winner: d.winner,
            runnerUp: d.runner_up || d.runnerUp,
            thirdPlace: d.third_place || d.thirdPlace,
            date: d.date,
            status: d.status,
          }));
          setResults(mapped);
          saveResultsToStore(mapped);
        }
      } catch {
        // Fallback to localStorage
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setResults(getStoredResults());
    };

    window.addEventListener("zyrox_results_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_results_updated", handleUpdate);
    };
  }, []);

  const addResult = async (item: Omit<TournamentResult, "id">) => {
    const newItem: TournamentResult = {
      ...item,
      id: `res-${Date.now()}`,
    };
    const updated = [newItem, ...results];
    setResults(updated);
    saveResultsToStore(updated);
    logAdminAction("create", "tournament_results", newItem.id, `Added tournament result for ${newItem.title}`);

    try {
      await (supabase.from("tournament_results") as any).insert({
        id: newItem.id,
        title: newItem.title,
        game: newItem.game,
        prize_pool: newItem.prizePool,
        winner: newItem.winner,
        runner_up: newItem.runnerUp,
        third_place: newItem.thirdPlace,
        date: newItem.date,
        status: newItem.status,
      });
    } catch {
      // Offline fallback
    }
  };

  const updateResult = async (id: string, updates: Partial<TournamentResult>) => {
    const updated = results.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setResults(updated);
    saveResultsToStore(updated);
    logAdminAction("update", "tournament_results", id, `Updated result ${id}`);

    try {
      await (supabase.from("tournament_results") as any)
        .update({
          title: updates.title,
          game: updates.game,
          prize_pool: updates.prizePool,
          winner: updates.winner,
          runner_up: updates.runnerUp,
          third_place: updates.thirdPlace,
          date: updates.date,
          status: updates.status,
        })
        .eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const deleteResult = async (id: string) => {
    const updated = results.filter((r) => r.id !== id);
    setResults(updated);
    saveResultsToStore(updated);
    logAdminAction("delete", "tournament_results", id, `Deleted result ${id}`);

    try {
      await (supabase.from("tournament_results") as any).delete().eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  return { results, loading, addResult, updateResult, deleteResult };
}
