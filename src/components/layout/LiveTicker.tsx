import { useSiteSettings } from "@/lib/siteSettingsStore";

export interface TickerItem {
  id: string;
  text: string;
  live?: boolean;
}

interface Props {
  items?: TickerItem[];
}

export default function LiveTicker({ items }: Props) {
  const { settings } = useSiteSettings();

  const customTickerItem: TickerItem = {
    id: "admin-ticker",
    text: settings.tickerText,
    live: true,
  };

  const displayItems =
    items && items.length > 0
      ? [customTickerItem, ...items]
      : [
          customTickerItem,
          { id: "2", text: "ZYROX ARENA — Verified Tournament & Cash Payout Platform", live: false },
        ];

  const loopItems = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-black">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-black to-transparent" />
      <div className="flex animate-ticker whitespace-nowrap py-2.5">
        {loopItems.map((item, i) => (
          <span
            key={`${item.id}-${i}`}
            className="flex items-center gap-2 border-r border-white/10 px-7 font-mono text-xs text-cream/90 font-medium"
          >
            {item.live && (
              <span className="h-2 w-2 animate-pulse-live rounded-full bg-neon-mint shadow-[0_0_8px_#33F2C7]" />
            )}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
