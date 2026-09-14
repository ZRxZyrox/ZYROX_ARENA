import { Link } from "react-router-dom";
import { ShieldCheck, Gavel, Ban, FileText, Swords, Award, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/85 backdrop-blur-xl pt-16 pb-28 sm:pb-32 text-neutral-400">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Top Grid */}
        <div className="grid gap-10 md:grid-cols-4 pb-14 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center">
              <span className="font-display text-xl font-bold tracking-wide text-white">
                ZYROX <span className="text-gradient-warm">ARENA</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-400">
              The premier esports tournament platform engineered for high-stakes competitive gaming in India. Verified prize pools, anti-cheat enforcement, and instant brackets.
            </p>
            <div className="space-y-2 text-xs font-mono text-white">
              <div className="flex items-center gap-2">
                <Award size={15} className="text-white" />
                <span className="font-semibold">A Zyrox Studioz Ecosystem Project</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Mail size={15} className="text-white" />
                <a href="mailto:zyroxstudioz@gmail.com" className="hover:text-white underline">zyroxstudioz@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-white mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link to="/tournaments" className="hover:text-white transition-colors">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-white transition-colors">
                  Live Results &amp; Winner Standings
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">
                  Event Highlights &amp; Gallery
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-widest text-white mb-4">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link to="/terms" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <FileText size={14} className="text-white" /> Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Ban size={14} className="text-white" /> Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <ShieldCheck size={14} className="text-white" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/rules" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Swords size={14} className="text-white" /> Fair Play &amp; Match Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Guarantees */}
          <div className="glass-card rounded-3xl p-5 space-y-3 text-xs border border-white/15">
            <h4 className="font-display text-xs font-bold uppercase text-white flex items-center gap-2">
              <Gavel size={15} className="text-white" /> Tournament Guarantees
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">✓</span> Strict Anti-Cheat &amp; Emulator Checks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">✓</span> 100% Non-Refundable Entry Fee
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold">✓</span> Admin Decision Final in All Matches
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white font-bold">✓</span> PCI-DSS 256-Bit Encrypted Gateway
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
