import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface SiteSettings {
  tickerText: string;
  paidOutAmount: string;
  activePlayersCount: string;
  liveEventsCount: string;
  announcementBanner: string;
  // Hero Section & Custom Hero Box Settings
  heroHeadline: string;
  heroSubheadline: string;
  heroBoxEnabled: boolean;
  heroBoxBadge: string;
  heroBoxTitle: string;
  heroBoxSubtitle: string;
  heroBoxPrizePool: string;
  heroBoxStatusText: string;
  heroBoxCtaText: string;
  heroBoxCtaUrl: string;
  heroBoxCountdownDate: string;
}

const LOCAL_STORAGE_KEY = "zyrox_site_settings_v2";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  tickerText: "🏆 BGMI Showdown Season 4 Finals — Registrations Closing Soon! • ₹45,00,000+ Cash Prizes Paid Out • Valorant Winter Circuit Live",
  paidOutAmount: "₹45,00,000+",
  activePlayersCount: "12,800+",
  liveEventsCount: "14+",
  announcementBanner: "🔥 Season 4 Mega Tournament Registration Open — Claim Your Slot Now!",
  heroHeadline: "The Arena is Open.",
  heroSubheadline: "Compete across BGMI, Free Fire, Valorant, FC and Cricket. Every match is tracked, every bracket is live, every rupee of prize money is verified and paid out within 24 hours.",
  heroBoxEnabled: true,
  heroBoxBadge: "⚡ FEATURED TOURNAMENT",
  heroBoxTitle: "Valorant Winter Circuit Finals",
  heroBoxSubtitle: "Valorant · 5v5 Squad",
  heroBoxPrizePool: "₹2,00,000",
  heroBoxStatusText: "Reg closes soon",
  heroBoxCtaText: "View Details →",
  heroBoxCtaUrl: "/tournaments/winter-circuit-finals",
  heroBoxCountdownDate: new Date(Date.now() + 3 * 86400000).toISOString(),
};

export function getStoredSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_SITE_SETTINGS;
}

export function saveSiteSettingsToStore(settings: SiteSettings) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("zyrox_settings_updated"));
  } catch {
    // ignore
  }
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(getStoredSiteSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await (supabase.from("site_settings") as any)
          .select("*")
          .single();

        if (!error && data) {
          const fetched: SiteSettings = {
            tickerText: data.ticker_text ?? DEFAULT_SITE_SETTINGS.tickerText,
            paidOutAmount: data.paid_out_amount ?? DEFAULT_SITE_SETTINGS.paidOutAmount,
            activePlayersCount: data.active_players_count ?? DEFAULT_SITE_SETTINGS.activePlayersCount,
            liveEventsCount: data.live_events_count ?? DEFAULT_SITE_SETTINGS.liveEventsCount,
            announcementBanner: data.announcement_banner ?? DEFAULT_SITE_SETTINGS.announcementBanner,
            heroHeadline: data.hero_headline ?? DEFAULT_SITE_SETTINGS.heroHeadline,
            heroSubheadline: data.hero_subheadline ?? DEFAULT_SITE_SETTINGS.heroSubheadline,
            heroBoxEnabled: data.hero_box_enabled ?? DEFAULT_SITE_SETTINGS.heroBoxEnabled,
            heroBoxBadge: data.hero_box_badge ?? DEFAULT_SITE_SETTINGS.heroBoxBadge,
            heroBoxTitle: data.hero_box_title ?? DEFAULT_SITE_SETTINGS.heroBoxTitle,
            heroBoxSubtitle: data.hero_box_subtitle ?? DEFAULT_SITE_SETTINGS.heroBoxSubtitle,
            heroBoxPrizePool: data.hero_box_prize_pool ?? DEFAULT_SITE_SETTINGS.heroBoxPrizePool,
            heroBoxStatusText: data.hero_box_status_text ?? DEFAULT_SITE_SETTINGS.heroBoxStatusText,
            heroBoxCtaText: data.hero_box_cta_text ?? DEFAULT_SITE_SETTINGS.heroBoxCtaText,
            heroBoxCtaUrl: data.hero_box_cta_url ?? DEFAULT_SITE_SETTINGS.heroBoxCtaUrl,
            heroBoxCountdownDate: data.hero_box_countdown_date ?? DEFAULT_SITE_SETTINGS.heroBoxCountdownDate,
          };
          setSettings(fetched);
          saveSiteSettingsToStore(fetched);
        }
      } catch {
        // Fallback to localStorage
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setSettings(getStoredSiteSettings());
    };

    window.addEventListener("zyrox_settings_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_settings_updated", handleUpdate);
    };
  }, []);

  const updateSettings = (newFields: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newFields };
    setSettings(updated);
    saveSiteSettingsToStore(updated);
    // Push to Supabase
    (supabase.from("site_settings") as any)
      .upsert({
        id: "global",
        ticker_text: updated.tickerText,
        paid_out_amount: updated.paidOutAmount,
        active_players_count: updated.activePlayersCount,
        live_events_count: updated.liveEventsCount,
        announcement_banner: updated.announcementBanner,
        hero_headline: updated.heroHeadline,
        hero_subheadline: updated.heroSubheadline,
        hero_box_enabled: updated.heroBoxEnabled,
        hero_box_badge: updated.heroBoxBadge,
        hero_box_title: updated.heroBoxTitle,
        hero_box_subtitle: updated.heroBoxSubtitle,
        hero_box_prize_pool: updated.heroBoxPrizePool,
        hero_box_status_text: updated.heroBoxStatusText,
        hero_box_cta_text: updated.heroBoxCtaText,
        hero_box_cta_url: updated.heroBoxCtaUrl,
        hero_box_countdown_date: updated.heroBoxCountdownDate,
        updated_at: new Date().toISOString(),
      })
      .then(() => {});
  };

  return { settings, loading, updateSettings };
}
