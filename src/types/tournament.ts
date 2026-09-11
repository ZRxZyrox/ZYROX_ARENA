export interface FeaturedTournament {
  slug: string;
  title: string;
  game: string;
  format: string; // e.g. "5v5", "Squad", "Solo"
  prizePool: string; // formatted, e.g. "₹2,00,000"
  registrationCloses: Date;
}

export type RegistrationMode = "solo" | "squad";
export type TournamentStatus = "upcoming" | "reg_open" | "live" | "completed";

export interface TournamentCardData {
  id: string;
  slug: string;
  title: string;
  game: string;
  bannerVariant: "b1" | "b2" | "b3";
  status: TournamentStatus;
  mode: RegistrationMode;
  prizePool: string;
}

export interface GameCategory {
  id: string;
  name: string;
  icon: string;
  eventCount: number;
}
