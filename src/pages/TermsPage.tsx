import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { Gavel, ShieldAlert, CheckCircle2, UserCheck, Trophy, Award } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Seo
        title="Terms & Conditions — ZYROX ARENA"
        description="Official terms of service, anti-cheat policy, dispute resolution, and operational guidelines for Zyrox Arena esports tournaments."
      />
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="border-b border-charcoal/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/15 px-4 py-1.5 text-xs font-bold text-gold-warm">
            <Gavel size={14} /> Official Platform Terms
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl text-charcoal">
            Terms &amp; <span className="text-gradient-warm">Conditions</span>
          </h1>
          <p className="mt-3 text-sm text-charcoal-muted font-medium">
            Last updated: July 25, 2026 • Please read these terms carefully before registering or participating in any tournament hosted on Zyrox Arena.
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-charcoal font-medium">
          
          {/* Section 1 */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <UserCheck className="text-neon" size={20} /> 1. Eligibility &amp; Participant Accounts
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                1.1. <strong className="text-charcoal font-bold">Age Requirement:</strong> Participants must be at least 13 years of age. Players under 18 must have parental or legal guardian consent to register and participate. Cash prize payouts to minors require guardian authorization and valid KYC.
              </p>
              <p>
                1.2. <strong className="text-charcoal font-bold">Account Identity:</strong> All registered player details (In-Game Name / IGN, In-Game UID, Discord ID, Phone Number) must exactly match the account used inside the game during matches. Registering with fake IDs or smurf accounts is strictly prohibited and grounds for immediate disqualification.
              </p>
              <p>
                1.3. <strong className="text-charcoal font-bold">Account Ownership:</strong> Registration slots are strictly non-transferable. You may not sell, swap, or transfer your tournament slot to another player or team once registered.
              </p>
            </div>
          </section>

          {/* Section 2 - ANTI CHEATING */}
          <section className="rounded-3xl border border-coral/30 bg-coral/10 p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-coral">
              <ShieldAlert className="text-coral" size={20} /> 2. Anti-Cheating &amp; Fair Play Policy (Zero Tolerance)
            </h2>
            <div className="space-y-3 text-charcoal font-medium">
              <p>
                Zyrox Arena maintains a strict <strong className="text-coral font-bold">Zero Tolerance Policy</strong> against cheating, hacking, and unfair sportsmanship.
              </p>
              <ul className="ml-5 list-disc space-y-2 text-charcoal">
                <li>
                  <strong className="text-charcoal font-bold">Banned Software:</strong> Use of wallhacks, aimbots, recoil scripts, speed hacks, memory injectors, or modified APKs/files results in an instant perma-ban from all future Zyrox Arena tournaments.
                </li>
                <li>
                  <strong className="text-charcoal font-bold">Emulators &amp; Hardware:</strong> Mobile-only tournaments prohibit emulators (Bluestacks, LDPlayer, Nox) and external controllers unless explicitly permitted in the tournament title.
                </li>
                <li>
                  <strong className="text-charcoal font-bold">Teaming &amp; Collusion:</strong> Any teaming between opposing squads, intentional feeding, or bracket fixing will result in immediate disqualification of all involved teams and forfeiture of entry fees.
                </li>
                <li>
                  <strong className="text-charcoal font-bold">POV Recording:</strong> Admins reserve the right to request full hand-cam or screen POV video recording for any match. Failure to produce a requested video within 2 hours results in match forfeiture.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 - ENTRY FEES & PAYMENTS */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <CheckCircle2 className="text-gold" size={20} /> 3. Entry Fees &amp; Tournament Registrations
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                3.1. <strong className="text-charcoal font-bold">Payment Authorization:</strong> All entry fees are securely processed through Razorpay Payments. A registration is only confirmed once the server receives a verified payment webhook.
              </p>
              <p>
                3.2. <strong className="text-charcoal font-bold">100% Non-Refundable Entry Commitment:</strong> Tournament entry fees are strictly non-refundable once paid to lock in bracket slots. Refer to our Refund Policy for full details.
              </p>
            </div>
          </section>

          {/* Section 4 - PRIZE POOLS & PAYOUTS */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <Trophy className="text-neon" size={20} /> 4. Prize Pool Distribution &amp; Disqualification
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                4.1. <strong className="text-charcoal font-bold">Payout Timelines:</strong> Verified prize money is transferred to the team captain's bank account/UPI ID within 24 hours of finals conclusion and score verification.
              </p>
              <p>
                4.2. <strong className="text-charcoal font-bold">Disqualification Forfeiture:</strong> Teams disqualified for cheating, toxicity, or breaking rules forfeit all rights to prize payouts. The prize slot will roll over to the next eligible team.
              </p>
            </div>
          </section>

          {/* Section 5 - ADMIN DECISION FINAL */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <Award className="text-gold" size={20} /> 5. Admin Rights &amp; Final Decisions
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                5.1. <strong className="text-charcoal font-bold">Admin Authority:</strong> Tournament admins have final authority over room creation, match restarts, score verification, and rule interpretations.
              </p>
              <p>
                5.2. <strong className="text-charcoal font-bold">Finality:</strong> An admin's decision in any dispute is final and binding on all participants.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
