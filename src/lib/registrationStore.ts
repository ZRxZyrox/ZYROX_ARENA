import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface TeamRegistration {
  id: string;
  player_name: string;
  team_name: string;
  game: string;
  in_game_id: string;
  email: string;
  phone: string;
  mode: "solo" | "squad" | "duo";
  payment_status: "paid" | "pending_payment" | "failed";
  approval_status: "approved" | "pending" | "rejected";
  amount_paise: number;
  created_at: string;
  teammates?: { name: string; inGameId: string }[];
}

const LOCAL_STORAGE_KEY = "zyrox_team_registrations_v2";

export const DEFAULT_TEAMS: TeamRegistration[] = [
  {
    id: "reg-101",
    player_name: "Vikramaditya Singh",
    team_name: "GodLike Esports",
    game: "BGMI",
    in_game_id: "5182940291 (Viper)",
    email: "vikram@godlike.gg",
    phone: "+91 9876543210",
    mode: "squad",
    payment_status: "paid",
    approval_status: "approved",
    amount_paise: 50000,
    created_at: "2026-07-24",
    teammates: [
      { name: "Anish Kumar", inGameId: "5182940292" },
      { name: "Rohan Das", inGameId: "5182940293" },
      { name: "Siddharth Roy", inGameId: "5182940294" },
    ],
  },
  {
    id: "reg-102",
    player_name: "Aman Jain",
    team_name: "Soul Strikers",
    game: "BGMI",
    in_game_id: "7129481920 (Mortal)",
    email: "aman@soul.gg",
    phone: "+91 9812345678",
    mode: "squad",
    payment_status: "paid",
    approval_status: "approved",
    amount_paise: 50000,
    created_at: "2026-07-24",
    teammates: [
      { name: "Raj Sharma", inGameId: "7129481921" },
      { name: "Karan Patel", inGameId: "7129481922" },
    ],
  },
  {
    id: "reg-103",
    player_name: "Rohan V.",
    team_name: "Phoenix Valor Squad",
    game: "Valorant",
    in_game_id: "RohanV#1337",
    email: "rohan@phoenix.gg",
    phone: "+91 9765432109",
    mode: "squad",
    payment_status: "paid",
    approval_status: "approved",
    amount_paise: 50000,
    created_at: "2026-07-24",
    teammates: [
      { name: "Samir K.", inGameId: "Samir#001" },
      { name: "Tushar M.", inGameId: "Tushar#002" },
    ],
  },
  {
    id: "reg-104",
    player_name: "Priya M.",
    team_name: "Desi Gamers FF",
    game: "Free Fire",
    in_game_id: "DG_Priya#99",
    email: "priya@desigamers.in",
    phone: "+91 9988776655",
    mode: "squad",
    payment_status: "paid",
    approval_status: "approved",
    amount_paise: 30000,
    created_at: "2026-07-24",
  },
];

export function getStoredTeams(): TeamRegistration[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_TEAMS;
}

export function saveTeamsToStore(teams: TeamRegistration[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(teams));
    window.dispatchEvent(new Event("zyrox_teams_updated"));
  } catch {
    // ignore
  }
}

export function useLiveTeams() {
  const [registrations, setRegistrations] = useState<TeamRegistration[]>(getStoredTeams());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await (supabase.from("registrations") as any)
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const formatted: TeamRegistration[] = data.map((r: any) => ({
            id: r.id,
            player_name: r.captain_name ?? r.player_name ?? "Captain",
            team_name: r.team_name ?? "Team " + (r.captain_name || "Squad"),
            game: r.game ?? "BGMI",
            in_game_id: r.in_game_id ?? "",
            email: r.captain_email ?? r.email ?? "",
            phone: r.captain_phone ?? r.phone ?? "",
            mode: r.mode ?? "squad",
            payment_status: r.payment_status ?? "paid",
            approval_status: r.approval_status ?? "approved",
            amount_paise: r.amount_paid ? r.amount_paid * 100 : 50000,
            created_at: r.created_at ? r.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
            teammates: r.players ?? [],
          }));

          setRegistrations(formatted);
          saveTeamsToStore(formatted);
        }
      } catch {
        // Fallback to local store
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setRegistrations(getStoredTeams());
    };

    window.addEventListener("zyrox_teams_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_teams_updated", handleUpdate);
    };
  }, []);

  const approvedTeams = registrations.filter((r) => r.approval_status === "approved");

  const addTeam = (newTeam: Omit<TeamRegistration, "id" | "created_at">) => {
    const record: TeamRegistration = {
      ...newTeam,
      id: "reg-" + Date.now(),
      created_at: new Date().toISOString().substring(0, 10),
    };
    const updated = [record, ...registrations];
    setRegistrations(updated);
    saveTeamsToStore(updated);
    (supabase.from("registrations") as any).insert(record).then(() => {});
  };

  const updateTeam = (id: string, fields: Partial<TeamRegistration>) => {
    const updated = registrations.map((r) => (r.id === id ? { ...r, ...fields } : r));
    setRegistrations(updated);
    saveTeamsToStore(updated);
    (supabase.from("registrations") as any).update(fields).eq("id", id).then(() => {});
  };

  const deleteTeam = (id: string) => {
    const updated = registrations.filter((r) => r.id !== id);
    setRegistrations(updated);
    saveTeamsToStore(updated);
    (supabase.from("registrations") as any).delete().eq("id", id).then(() => {});
  };

  return { registrations, approvedTeams, loading, addTeam, updateTeam, deleteTeam };
}
