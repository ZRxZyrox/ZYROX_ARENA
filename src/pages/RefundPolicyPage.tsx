import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { Ban, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Seo
        title="Refund & Cancellation Policy — ZYROX ARENA"
        description="Official cancellation, refund policy, and transaction handling terms for Zyrox Arena tournament registrations."
      />
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="border-b border-charcoal/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/15 px-4 py-1.5 text-xs font-bold text-coral">
            <Ban size={14} /> Refund &amp; Cancellation Policy
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl text-charcoal">
            Refund &amp; <span className="text-coral">Cancellation</span> Policy
          </h1>
          <p className="mt-3 text-sm text-charcoal-muted font-medium">
            Last updated: July 25, 2026 • Please read our non-refundable commitment and exception guidelines carefully.
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-charcoal font-medium">
          
          {/* Section 1: Non-Refundable Policy */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <AlertCircle className="text-coral" size={20} /> 1. Non-Refundable Entry Fee Commitment
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                All tournament entry fee payments made on Zyrox Arena are <strong className="text-coral font-bold">100% final and non-refundable</strong> once confirmed. Entry fees are immediately allocated toward slot reservation, server infrastructure, lobby administration, and prize pool verification.
              </p>
              <p>
                No refunds will be granted under the following circumstances:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-charcoal">
                <li>Player or team no-show, tardiness, or failure to join the match room within the designated check-in time.</li>
                <li>Disqualification due to cheating, emulator usage, hacking, toxicity, or rule violations.</li>
                <li>Player-side technical issues including internet disconnection, device failure, or game app crashes.</li>
                <li>Voluntary team withdrawal or change of mind prior to or during the event.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Platform Cancellation Exceptions */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <RefreshCw className="text-gold" size={20} /> 2. Eligible Refund Exceptions (Platform Cancellation)
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                A 100% full refund of the entry fee will be automatically issued back to your original payment method under these specific conditions:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-charcoal">
                <li><strong className="text-charcoal font-bold">Event Cancellation by Admin:</strong> If Zyrox Arena cancels a tournament prior to match start due to server maintenance or unforeseen issues.</li>
                <li><strong className="text-charcoal font-bold">Minimum Slot Unfulfilled:</strong> If a tournament fails to reach its minimum required team threshold and is officially cancelled by management.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Processing Timeframes */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <CheckCircle2 className="text-neon" size={20} /> 3. Refund Processing Timelines
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                Eligible refunds are processed directly via Razorpay Payments back to your original source (UPI, GPay, Bank Account, or Card).
              </p>
              <p>
                Refund processing typically completes within <strong className="text-neon font-bold font-mono">5 to 7 business days</strong> depending on your bank's processing timelines.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
