import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { Camera } from "lucide-react";

const GALLERY_ITEMS = [
  { id: "1", title: "Valorant Winter Finals Stage", category: "Grand Finals", game: "Valorant", imageBg: "from-neon/20 to-gold/20" },
  { id: "2", title: "BGMI Showdown Champion Ceremony", category: "Trophy Moment", game: "BGMI", imageBg: "from-gold/25 to-coral/20" },
  { id: "3", title: "Free Fire Clash Cup Action", category: "Match Highlights", game: "Free Fire", imageBg: "from-coral/20 to-neon/20" },
  { id: "4", title: "FC Pro League 1v1 Clutch", category: "Key Plays", game: "FC", imageBg: "from-neon-mint/20 to-gold/20" },
  { id: "5", title: "Lan Arena Setup & Player Lounge", category: "Event Vibe", game: "Esports", imageBg: "from-gold/20 to-neon/20" },
  { id: "6", title: "Grand Finals Trophy Unveiling", category: "Behind The Scenes", game: "Esports", imageBg: "from-coral/25 to-gold/20" },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-ivory dark:bg-[#0A0A14] text-charcoal dark:text-[#ECEDF0]">
      <Seo
        title="Event Gallery & Highlights — ZYROX ARENA"
        description="Photos, highlight reels, and memorable moments from ZYROX ARENA esports tournaments."
      />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-12 border-b border-charcoal/8 dark:border-white/8 pb-6">
          <p className="font-mono text-xs uppercase text-neon font-bold tracking-widest">Captured Moments</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold uppercase text-charcoal dark:text-white">
            Event <span className="text-gradient-warm">Gallery</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-charcoal-muted dark:text-[#7A7B88]">
            Highlights, trophy presentations, key match clutches, and tournament floor action.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl overflow-hidden p-0 group hover:shadow-glass-lg transition-all cursor-pointer"
            >
              <div className={`h-56 bg-gradient-to-br ${item.imageBg} p-6 flex flex-col justify-between border-b border-charcoal/8 dark:border-white/8 relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/80 dark:border-white/20 bg-white/70 dark:bg-white/10 backdrop-blur-md px-3 py-1 font-mono text-[10px] font-bold uppercase text-charcoal dark:text-white shadow-glass">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-neon/15 border border-neon/30 px-3 py-1 font-mono text-[10px] font-bold text-neon uppercase">
                    {item.game}
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 dark:border-white/20 bg-white/70 dark:bg-white/10 backdrop-blur-md text-charcoal dark:text-white group-hover:scale-110 shadow-glass transition-transform">
                    <Camera size={24} className="text-neon" />
                  </span>
                </div>

                <span className="text-[10px] font-mono text-charcoal-muted uppercase">HD Media Asset #{item.id}</span>
              </div>

              <div className="p-5">
                <h3 className="font-display text-xl font-bold uppercase text-charcoal dark:text-white group-hover:text-neon transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
