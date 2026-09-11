import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface LeaderboardItem {
  id: string;
  rank: number;
  name: string;
  wins: number;
  earnings: string;
  game: string;
}

const LOCAL_STORAGE_KEY = "zyrox_leaderboard_store_v1";

export const INITIAL_LEADERBOARD: LeaderboardItem[] = [
  { id: "lb-1", rank: 1, name: "Team Soul Esports", wins: 47, earnings: "₹4,20,000", game: "BGMI" },
  { id: "lb-2", rank: 2, name: "GodLike Official", wins: 41, earnings: "₹3,80,000", game: "BGMI" },
  { id: "lb-3", rank: 3, name: "Phoenix Valor Squad", wins: 38, earnings: "₹2,95,000", game: "Valorant" },
  { id: "lb-4", rank: 4, name: "Desi Gamers FF", wins: 34, earnings: "₹2,50,000", game: "Free Fire" },
  { id: "lb-5", rank: 5, name: "Mumbai FC Legends", wins: 29, earnings: "₹1,75,000", game: "FC" },
];

export function getStoredLeaderboard(): LeaderboardItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_LEADERBOARD;
}

export function saveLeaderboardToStore(items: LeaderboardItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("zyrox_leaderboard_updated"));
  } catch {
    // ignore
  }
}

export function useLiveLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>(getStoredLeaderboard());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await (supabase.from("season_leaderboard") as any)
          .select("*")
          .order("rank", { ascending: true });

        if (!error && data && data.length > 0) {
          setLeaderboard(data);
          saveLeaderboardToStore(data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setLeaderboard(getStoredLeaderboard());
    };

    window.addEventListener("zyrox_leaderboard_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_leaderboard_updated", handleUpdate);
    };
  }, []);

  const updateLeaderboard = (newItems: LeaderboardItem[]) => {
    // Ensure ranks are normalized 1..N
    const sorted = newItems.map((item, idx) => ({ ...item, rank: idx + 1 }));
    setLeaderboard(sorted);
    saveLeaderboardToStore(sorted);

    // Push to Supabase
    (supabase.from("season_leaderboard") as any)
      .upsert(sorted)
      .then(() => {});
  };

  return { leaderboard, loading, updateLeaderboard };
}
