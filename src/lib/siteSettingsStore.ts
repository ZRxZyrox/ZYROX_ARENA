import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface PlatformGuarantee {
  id: string;
  title: string;
  desc: string;
  iconName: "ShieldCheck" | "CreditCard" | "Zap" | "Users" | string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  desc: string;
}

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
  // Global Contact & Social Channels
  supportEmail: string;
  supportPhone: string;
  discordUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  whatsappSupportNumber: string;
  // Platform Guarantees ("Why ZYROX ARENA")
  guarantees: PlatformGuarantee[];
  // How It Works Steps
  howItWorks: HowItWorksStep[];
}

const LOCAL_STORAGE_KEY = "zyrox_site_settings_v3";

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
  supportEmail: "zyroxstudioz@gmail.com",
  supportPhone: "+91 98765 43210",
  discordUrl: "https://discord.gg/zyroxarena",
  instagramUrl: "https://instagram.com/zyroxarena",
  youtubeUrl: "https://youtube.com/@zyroxarena",
  whatsappSupportNumber: "+91 98765 43210",
  guarantees: [
    {
      id: "g1",
      iconName: "ShieldCheck",
      title: "Anti-Cheat Shield",
      desc: "Live hardware check-ins & emulator bans.",
    },
    {
      id: "g2",
      iconName: "CreditCard",
      title: "Instant Payouts",
      desc: "Direct UPI & bank transfers within 24 hours.",
    },
    {
      id: "g3",
      iconName: "Zap",
      title: "Live Brackets",
      desc: "Instant room credentials & automated scores.",
    },
    {
      id: "g4",
      iconName: "Users",
      title: "Verified Rosters",
      desc: "Validated player IGNs & captain check-in.",
    },
  ],
  howItWorks: [
    {
      step: "01",
      title: "Pick Event",
      desc: "Choose title, mode & squad roster.",
    },
    {
      step: "02",
      title: "Instant Entry",
      desc: "Secure instant UPI & card checkout.",
    },
    {
      step: "03",
      title: "Get Room Pass",
      desc: "Private room ID & password 15m prior.",
    },
    {
      step: "04",
      title: "Win Cash",
      desc: "Dominate bracket & get paid directly.",
    },
  ],
};

export function getStoredSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          guarantees: Array.isArray(parsed.guarantees) && parsed.guarantees.length > 0 ? parsed.guarantees : DEFAULT_SITE_SETTINGS.guarantees,
          howItWorks: Array.isArray(parsed.howItWorks) && parsed.howItWorks.length > 0 ? parsed.howItWorks : DEFAULT_SITE_SETTINGS.howItWorks,
        };
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
            supportEmail: data.support_email ?? DEFAULT_SITE_SETTINGS.supportEmail,
            supportPhone: data.support_phone ?? DEFAULT_SITE_SETTINGS.supportPhone,
            discordUrl: data.discord_url ?? DEFAULT_SITE_SETTINGS.discordUrl,
            instagramUrl: data.instagram_url ?? DEFAULT_SITE_SETTINGS.instagramUrl,
            youtubeUrl: data.youtube_url ?? DEFAULT_SITE_SETTINGS.youtubeUrl,
            whatsappSupportNumber: data.whatsapp_support_number ?? DEFAULT_SITE_SETTINGS.whatsappSupportNumber,
            guarantees: data.guarantees ? JSON.parse(data.guarantees) : DEFAULT_SITE_SETTINGS.guarantees,
            howItWorks: data.how_it_works ? JSON.parse(data.how_it_works) : DEFAULT_SITE_SETTINGS.howItWorks,
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
    // Push to Supabase if connected
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
        support_email: updated.supportEmail,
        support_phone: updated.supportPhone,
        discord_url: updated.discordUrl,
        instagram_url: updated.instagramUrl,
        youtube_url: updated.youtubeUrl,
        whatsapp_support_number: updated.whatsappSupportNumber,
        guarantees: JSON.stringify(updated.guarantees),
        how_it_works: JSON.stringify(updated.howItWorks),
        updated_at: new Date().toISOString(),
      })
      .then(() => {});
  };

  return { settings, loading, updateSettings };
}
