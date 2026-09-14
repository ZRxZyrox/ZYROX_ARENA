import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  { category: "Registration", q: "How do I register a squad for a tournament?", a: "Navigate to any active tournament on the website, select Squad format, enter your Team Captain details, add your teammates' full names and exact in-game IDs (IGNs), accept the match rules, and complete payment via UPI or Card." },
  { category: "Payments", q: "How are tournament entry fees and payouts processed?", a: "Entry fees are securely processed using a PCI-DSS 256-bit encrypted gateway. Prize money payouts are transferred directly to the Team Captain's bank account or UPI ID within 24 hours of tournament finals." },
  { category: "Match Rules", q: "Where do I receive the Room ID and Password?", a: "Room ID and Password are sent to your registered Team Captain's WhatsApp phone number and email address 15 minutes before the match start time." },
  { category: "Anti-Cheat", q: "What anti-cheat measures are enforced during matches?", a: "We enforce strict zero-tolerance policies. Emulators are strictly banned in mobile tournaments. Screen recording and device check-ins may be requested by tournament admins at any time." },
  { category: "Refunds", q: "Can I cancel or refund my registration?", a: "As outlined in our 100% Non-Refundable Policy, entry fees are non-refundable once paid to lock in tournament bracket slots. Refunds are issued only if Zyrox Arena cancels an event." },
  { category: "Registration", q: "Can I swap a teammate after registering?", a: "Teammate substitutions are allowed up to 1 hour before match start time by contacting our support team at zyroxstudioz@gmail.com with your Order ID and new IGN details." },
  { category: "Match Rules", q: "What happens if a player disconnects mid-game?", a: "Match disconnects due to personal internet issues will not cause a match restart. If over 50% of players experience a server outage, the match will be re-scheduled by the admin." },
  { category: "Payments", q: "Is online payment 100% safe and instant?", a: "Yes, every payment is verified server-side via HMAC-SHA256 signed webhooks directly with Cloudflare Workers — never trusted client-side." },
];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = ["All", "Registration", "Payments", "Match Rules", "Anti-Cheat", "Refunds"];

  const filteredFaqs = FAQ_ITEMS.filter((f) => {
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    const matchesQuery = !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-transparent text-charcoal dark:text-[#ECEDF0] transition-colors relative">
      <Seo
        title="Frequently Asked Questions — ZYROX ARENA"
        description="Find answers to registration, payment verification, match rules, room IDs, and prize payout questions."
      />
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-14 safe-bottom-dock">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-6 text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase text-white font-bold tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
            <HelpCircle size={13} className="text-white" /> Help Center &amp; Support
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold uppercase text-white">
            Frequently Asked <span className="text-gradient-warm">Questions</span>
          </h1>
          <p className="mt-2 max-w-md mx-auto text-sm text-neutral-400 font-medium">
            Everything you need to know about registering, payments, anti-cheat, and match rooms.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-3.5 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl glass-card pl-11 pr-5 py-3.5 text-sm text-white outline-none focus:border-white focus:ring-2 focus:ring-white/20 shadow-glass placeholder:text-neutral-500 border border-white/15 bg-white/5"
          />
        </div>

        {/* Category Pills */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-white text-black font-black shadow-glow"
                  : "glass-card text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion FAQs */}
        <div className="space-y-4">
          {filteredFaqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl overflow-hidden transition-all shadow-glass hover:shadow-glass-lg border border-white/10"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-neutral-300 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white font-mono text-xs font-bold">
                      ?
                    </span>
                    <span>{f.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-white/10 font-medium">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center text-neutral-400 text-sm border border-white/10">
              No questions found matching "{query}". Contact support at zyroxstudioz@gmail.com for assistance.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
