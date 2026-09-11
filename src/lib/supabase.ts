import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://mayvfqdzqobcxemabwoy.supabase.co";
const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== "placeholder-anon-key"
);

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ ZYROX ARENA: VITE_SUPABASE_ANON_KEY is not set.\n" +
    "To sync data live between laptop & mobile devices, paste your Supabase 'anon' key in your .env file and Cloudflare Pages Settings."
  );
}

/**
 * Public, browser-safe Supabase client.
 */
export const supabase = createClient<Database>(url, anonKey || "placeholder-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
