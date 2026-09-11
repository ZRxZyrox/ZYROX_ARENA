import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { Ban, AlertCircle, RefreshCw, CheckCircle2, Building2 } from "lucide-react";

export default function RefundPolicyPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#0A0A14] text-charcoal dark:text-[#ECEDF0]">
      <Seo
        title="Refund & Cancellation Policy — ZYROX ARENA"
        description="Official cancellation, refund policy, and transaction handling terms for Zyrox Arena tournament registrations."
      />
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="border-b border-charcoal/10 dark:border-white/8 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/15 px-4 py-1.5 text-xs font-bold text-coral">
            <Ban size={14} /> Refund &amp; Cancellation Policy
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl text-charcoal dark:text-white">
            Refund &amp; <span className="text-coral">Cancellation</span> Policy
          </h1>
          <p className="mt-3 text-sm text-charcoal-muted dark:text-[#7A7B88] font-medium">
            Last updated: July 25, 2026 • Please read our non-refundable commitment and exception guidelines carefully.
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-charcoal dark:text-[#ECEDF0] font-medium">
          
          {/* Section 1: Non-Refundable Policy */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal dark:text-white">
              <AlertCircle className="text-coral" size={20} /> 1. Non-Refundable Entry Fee Commitment
            </h2>
            <div className="space-y-3 text-charcoal dark:text-[#ECEDF0]">
              <p>
                All tournament entry fee payments made on Zyrox Arena are <strong className="text-coral font-bold">100% final and non-refundable</strong> once confirmed. Entry fees are immediately allocated toward slot reservation, server infrastructure, lobby administration, and prize pool verification.
              </p>
              <p>
                No refunds will be granted under the following circumstances:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-charcoal dark:text-[#ECEDF0]">
                <li>Player or team no-show, tardiness, or failure to join the match room within the designated check-in time.</li>
                <li>Disqualification due to cheating, emulator usage, hacking, toxicity, or rule violations.</li>
                <li>Player-side technical issues including internet disconnection, device failure, or game app crashes.</li>
                <li>Voluntary team withdrawal or change of mind prior to or during the event.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Platform Cancellation Exceptions */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal dark:text-white">
              <RefreshCw className="text-gold" size={20} /> 2. Eligible Refund Exceptions (Platform Cancellation)
            </h2>
            <div className="space-y-3 text-charcoal dark:text-[#ECEDF0]">
              <p>
                A 100% full refund of the entry fee will be automatically issued back to your original payment method under these specific conditions:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-charcoal dark:text-[#ECEDF0]">
                <li><strong className="text-charcoal dark:text-white font-bold">Event Cancellation by Admin:</strong> If Zyrox Arena cancels a tournament prior to match start due to server maintenance or unforeseen issues.</li>
                <li><strong className="text-charcoal dark:text-white font-bold">Minimum Slot Unfulfilled:</strong> If a tournament fails to reach its minimum required team threshold and is officially cancelled by management.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Processing Timeframes */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal dark:text-white">
              <CheckCircle2 className="text-neon" size={20} /> 3. Refund Processing Timelines
            </h2>
            <div className="space-y-3 text-charcoal dark:text-[#ECEDF0]">
              <p>
                Eligible refunds are processed directly via Razorpay Payments back to your original source (UPI, GPay, Bank Account, or Card).
              </p>
              <p>
                Refund processing typically completes within <strong className="text-neon font-bold font-mono">5 to 7 business days</strong> depending on your bank's processing timelines.
              </p>
            </div>
          </section>

          {/* Section 4: Merchant & Operator Details */}
          <section id="operator-info" className="glass-card rounded-3xl p-6 md:p-8 space-y-4 scroll-mt-24 border border-charcoal/10 dark:border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal dark:text-white">
              <Building2 className="text-gold" size={20} /> 4. Operator &amp; Merchant Legal Entity Details
            </h2>
            <div className="space-y-3 text-charcoal-muted dark:text-[#7A7B88] text-xs leading-relaxed">
              <p>
                For refund inquiries, billing escalations, or merchant identification details:
              </p>
              <div className="rounded-2xl bg-charcoal/5 dark:bg-white/5 border border-charcoal/10 dark:border-white/10 p-5 space-y-2.5 font-mono text-xs text-charcoal dark:text-[#ECEDF0]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-charcoal/5 dark:border-white/5 pb-2">
                  <span className="text-charcoal-muted dark:text-[#7A7B88]">Platform / Trade Name:</span>
                  <span className="font-semibold text-charcoal dark:text-white">Zyrox Studioz - Zyrox Arena</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-charcoal/5 dark:border-white/5 pb-2">
                  <span className="text-charcoal-muted dark:text-[#7A7B88]">Operated by:</span>
                  <span className="font-semibold text-charcoal dark:text-white">Darshit Vipulbhai Tank</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-charcoal/5 dark:border-white/5 pb-2">
                  <span className="text-charcoal-muted dark:text-[#7A7B88]">Business Type:</span>
                  <span className="font-semibold text-charcoal dark:text-white">Individual (unregistered)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-charcoal-muted dark:text-[#7A7B88]">Direct Contact:</span>
                  <a href="mailto:darshittaank@gmail.com" className="font-semibold text-neon hover:underline">darshittaank@gmail.com</a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
