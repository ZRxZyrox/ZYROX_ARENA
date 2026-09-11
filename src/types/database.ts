export interface Database {
  public: {
    Tables: {
      tournaments: {
        Row: {
          id: string;
          slug: string;
          title: string;
          game: string;
          game_slug: string;
          status: string;
          mode: string;
          banner_variant: string | null;
          prize_pool_display: string;
          max_slots: number | null;
          published: boolean | null;
          rules: string | null;
          registration_closes_at: string | null;
          description: string | null;
          rules_text: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          game?: string;
          game_slug: string;
          status?: string;
          mode?: string;
          banner_variant?: string | null;
          prize_pool_display?: string;
          max_slots?: number | null;
          published?: boolean | null;
          rules?: string | null;
          registration_closes_at?: string | null;
          description?: string | null;
          rules_text?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          game?: string;
          game_slug?: string;
          status?: string;
          mode?: string;
          banner_variant?: string | null;
          prize_pool_display?: string;
          max_slots?: number | null;
          published?: boolean | null;
          rules?: string | null;
          registration_closes_at?: string | null;
          description?: string | null;
          rules_text?: string | null;
          created_at?: string | null;
        };
      };
      announcements: {
        Row: { id: string; message: string; is_live_flag: boolean; published: boolean };
        Insert: { id?: string; message: string; is_live_flag?: boolean; published?: boolean };
        Update: { id?: string; message?: string; is_live_flag?: boolean; published?: boolean };
      };
      registrations: {
        Row: {
          id: string;
          tournament_id: string;
          user_id: string | null;
          team_name: string;
          captain_name: string;
          captain_email: string;
          captain_phone: string;
          captain_ign: string;
          payment_status: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          user_id?: string | null;
          team_name: string;
          captain_name: string;
          captain_email: string;
          captain_phone: string;
          captain_ign: string;
          payment_status?: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          user_id?: string | null;
          team_name?: string;
          captain_name?: string;
          captain_email?: string;
          captain_phone?: string;
          captain_ign?: string;
          payment_status?: string;
          created_at?: string | null;
        };
      };
    };
  };
}
