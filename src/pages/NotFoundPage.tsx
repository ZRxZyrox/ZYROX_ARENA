import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-transparent text-charcoal dark:text-[#ECEDF0] flex flex-col justify-between relative">
      <Header />
      <div className="my-auto py-20 text-center px-6">
        <div className="glass-card rounded-3xl p-12 max-w-md mx-auto space-y-4 shadow-glass-xl">
          <span className="font-display text-8xl font-bold text-gradient-warm block">404</span>
          <h2 className="font-display text-2xl font-bold uppercase text-charcoal dark:text-white">Bracket Not Found</h2>
          <p className="text-xs text-charcoal-muted dark:text-[#7A7B88]">The tournament page or link you were looking for doesn't exist.</p>
          <Link to="/" className="inline-block shimmer-btn rounded-2xl px-7 py-3 text-xs font-bold text-white shadow-glow">
            Back to ZYROX ARENA
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
