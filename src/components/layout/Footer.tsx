import { Link } from "react-router-dom";
import { ShieldCheck, Gavel, Ban, FileText, Swords, Award, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 dark:border-white/8 bg-ivory-warm dark:bg-[#0D0D1A] pt-16 pb-28 sm:pb-32 text-charcoal-muted dark:text-[#7A7B88]">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Top Grid */}
        <div className="grid gap-10 md:grid-cols-4 pb-14 border-b border-charcoal/10 dark:border-white/8">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-neon via-gold to-coral shadow-warm">
                <span className="font-display text-sm font-black text-white">Z</span>
              </span>
              <span className="font-display text-xl font-bold tracking-wide text-charcoal dark:text-white">
                ZYROX <span className="text-gradient-warm">ARENA</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-charcoal-muted dark:text-[#7A7B88]">
              The premier esports tournament platform engineered for high-stakes competitive gaming in India. Verified prize pools, anti-cheat enforcement, and instant brackets.
            </p>
            <div className="space-y-2 text-xs font-mono text-charcoal dark:text-[#ECEDF0]">
              <div className="flex items-center gap-2">
                <Award size={15} className="text-gold" />
                <span className="font-semibold">A Zyrox Studioz Ecosystem Project</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-muted dark:text-[#7A7B88]">
                <Mail size={15} className="text-gold" />
                <a href="mailto:zyroxstudioz@gmail.com" className="hover:text-neon underline">zyroxstudioz@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-charcoal dark:text-white mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link to="/tournaments" className="hover:text-neon transition-colors">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-neon transition-colors">
                  Live Results &amp; Winner Standings
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-neon transition-colors">
                  Event Highlights &amp; Gallery
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-neon transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-charcoal dark:text-white mb-4">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link to="/terms" className="flex items-center gap-1.5 hover:text-gold transition-colors">
                  <FileText size={14} className="text-gold" /> Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="flex items-center gap-1.5 hover:text-coral transition-colors">
                  <Ban size={14} className="text-coral" /> Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="flex items-center gap-1.5 hover:text-neon transition-colors">
                  <ShieldCheck size={14} className="text-neon" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/rules" className="flex items-center gap-1.5 hover:text-gold transition-colors">
                  <Swords size={14} className="text-gold" /> Fair Play &amp; Match Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Guarantees */}
          <div className="glass-card rounded-3xl p-5 space-y-3 text-xs">
            <h4 className="font-display text-xs font-bold uppercase text-charcoal dark:text-white flex items-center gap-2">
              <Gavel size={15} className="text-gold" /> Tournament Guarantees
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-muted dark:text-[#7A7B88]">
              <li className="flex items-start gap-2">
                <span className="text-neon font-bold">✓</span> Strict Anti-Cheat &amp; Emulator Checks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon font-bold">✓</span> 100% Non-Refundable Entry Fee
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon font-bold">✓</span> Admin Decision Final in All Matches
              </li>
              <li className="flex items-center gap-2">
                <span className="text-neon font-bold">✓</span> Razorpay PCI-DSS 256-Bit Encrypted
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & Socials */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-charcoal-muted dark:text-[#7A7B88]">
          <p>© {new Date().getFullYear()} ZYROX ARENA. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/terms" className="hover:text-charcoal dark:hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-charcoal dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="/refund-policy" className="hover:text-charcoal dark:hover:text-white transition-colors">Refunds</Link>
            <Link to="/rules" className="hover:text-charcoal dark:hover:text-white transition-colors">Rules</Link>
            <Link to="/terms#operator-info" className="hover:text-charcoal dark:hover:text-white transition-colors">Merchant Info</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
