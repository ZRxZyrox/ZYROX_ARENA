import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { Lock, Eye, Database, Server, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-transparent text-charcoal dark:text-[#ECEDF0] transition-colors relative">
      <Seo
        title="Privacy Policy — ZYROX ARENA"
        description="Learn how Zyrox Arena collects, protects, and manages participant data, in-game credentials, and payment transactions."
      />
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16 safe-bottom-dock">
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white">
            <Lock size={14} className="text-white" /> Data Protection &amp; Privacy
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl text-white">
            Privacy <span className="text-gradient-warm">Policy</span>
          </h1>
          <p className="mt-3 text-sm text-neutral-400 font-medium">
            Last updated: July 25, 2026 • Zyrox Arena ("we", "our", "us") is committed to safeguarding your personal data and gaming identity.
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-white font-medium">
          
          {/* Section 1: Data Collection */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <Eye className="text-white" size={20} /> 1. Information We Collect
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                To organize esports tournaments, verify participant identity, and distribute prizes, we collect the following data:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-neutral-300">
                <li>
                  <strong className="text-white font-bold">Personal Identity:</strong> Full name, email address, phone number, and state/country of residence.
                </li>
                <li>
                  <strong className="text-white font-bold">Gaming Identifiers:</strong> In-Game Name (IGN), In-Game Character ID/UID, Discord handle, team name, and team roster details.
                </li>
                <li>
                  <strong className="text-white font-bold">Payment Data:</strong> Transaction IDs, order numbers, and payment status via secure payment gateway. <em className="text-neutral-400">Note: Zyrox Arena NEVER stores credit/debit card numbers or bank PINs on our servers. All sensitive financial data is processed securely through PCI-DSS compliant infrastructure.</em>
                </li>
                <li>
                  <strong className="text-white font-bold">Technical Data:</strong> IP address, device type, browser session metadata, and anti-cheat submission logs.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Data Usage */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <Database className="text-white" size={20} /> 2. How We Use Your Information
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>Your data is strictly used for platform operations, including:</p>
              <ul className="ml-5 list-disc space-y-2 text-neutral-300">
                <li>Generating tournament brackets, seeding, and lobby invitations via SMS/WhatsApp/Email.</li>
                <li>Verifying match results, screenshot submissions, and anti-cheat compliance.</li>
                <li>Processing cash prize payouts and tax reporting (KYC verification).</li>
                <li>Sending important match updates, schedule revisions, or room code credentials.</li>
                <li>Preventing cheating, duplicate registrations, and fraudulent transactions.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Data Security */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <Server className="text-white" size={20} /> 3. Data Infrastructure &amp; Security
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                All user accounts, match scores, and registration data are protected using Supabase Row Level Security (RLS), 256-bit SSL encryption in transit, and restricted Cloudflare Worker middleware API endpoints.
              </p>
              <p>
                We maintain strict access controls. Only authorized tournament admins have permission to review match logs and participant rosters.
              </p>
            </div>
          </section>

          {/* Section 4: Data Sharing */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <UserCheck className="text-white" size={20} /> 4. Third-Party Sharing &amp; Non-Disclosure
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                Zyrox Arena <strong className="text-white font-bold">NEVER sells, rents, or trades your personal data</strong> to third-party advertisers. We only share necessary data with trusted processors:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-neutral-300">
                <li><strong className="text-white font-bold">Payment Gateway:</strong> Authorized payment gateways process transaction status callbacks securely.</li>
                <li><strong className="text-charcoal dark:text-white font-bold">Database &amp; Cloud:</strong> Supabase and Cloudflare Workers maintain backend infrastructure under strict confidentiality.</li>
              </ul>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
