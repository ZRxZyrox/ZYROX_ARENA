import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { Camera, Sparkles } from "lucide-react";
import { useLiveGallery } from "@/lib/galleryStore";

export default function GalleryPage() {
  const { galleryItems } = useLiveGallery();

  return (
    <div className="min-h-screen bg-transparent text-white transition-colors relative">
      <Seo
        title="Event Gallery & Highlights — ZYROX ARENA"
        description="Photos, highlight reels, and memorable moments from ZYROX ARENA esports tournaments."
      />
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-14 safe-bottom-dock">
        <div className="mb-12 border-b border-white/10 pb-6">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-white font-bold tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
            <Sparkles size={13} className="text-white" /> Captured Moments
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold uppercase text-white">
            Event <span className="text-gradient-warm">Gallery</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-400 font-medium">
            Highlights, trophy presentations, key match clutches, and tournament floor action from verified events.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl overflow-hidden p-0 group hover:shadow-glass-lg transition-all cursor-pointer border border-white/10 fps-120"
            >
              <div className={`h-56 bg-gradient-to-br ${item.imageBg || "from-white/15 to-white/5"} p-6 flex flex-col justify-between border-b border-white/10 relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 font-mono text-[10px] font-bold uppercase text-white shadow-glass">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-white/15 border border-white/30 px-3 py-1 font-mono text-[10px] font-bold text-white uppercase">
                    {item.game}
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white group-hover:scale-110 shadow-glass transition-transform">
                    <Camera size={24} className="text-white" />
                  </span>
                </div>

                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">
                  Official Match Highlight
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-neutral-300 transition-colors">
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
