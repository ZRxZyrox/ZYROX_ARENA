import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { ShieldAlert, Gavel, CheckCircle2, Clock, Swords } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Seo
        title="Tournament Rules & Fair Play Code — ZYROX ARENA"
        description="Official rulebook, anti-cheat enforcement, match protocols, and dispute procedures for all Zyrox Arena tournaments."
      />
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="border-b border-charcoal/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/15 px-4 py-1.5 text-xs font-bold text-gold-warm">
            <Swords size={14} /> Official Esports Rulebook
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl text-charcoal">
            Tournament <span className="text-gradient-warm">Rules</span> &amp; Fair Play
          </h1>
          <p className="mt-3 text-sm text-charcoal-muted font-medium">
            Mandatory guidelines for all players &amp; teams participating in BGMI, Free Fire, Valorant, FC, and Cricket tournaments on Zyrox Arena.
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-charcoal font-medium">
          
          {/* Rule 1: Check-in & Punctuality */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <Clock className="text-neon" size={20} /> 1. Lobby Schedule &amp; Check-In Protocol
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                1.1. <strong className="text-charcoal font-bold">Lobby Room ID &amp; Password:</strong> Room credentials are distributed 15 minutes before the scheduled match time via SMS, WhatsApp, and the Tournament Dashboard.
              </p>
              <p>
                1.2. <strong className="text-charcoal font-bold">Slot Numbers:</strong> Teams in battle royale games (BGMI / Free Fire) must join their designated slot numbers as shown in the match group schedule. Joining another team's slot will result in an immediate lobby kick and potential match forfeiture.
              </p>
              <p>
                1.3. <strong className="text-charcoal font-bold">Late Arrival:</strong> A 5-minute grace period is given after room creation. Once the countdown timer ends, the match will start strictly on time regardless of missing players.
              </p>
            </div>
          </section>

          {/* Rule 2: Proof & Screenshot Submission */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <CheckCircle2 className="text-gold" size={20} /> 2. Proof Submission &amp; Screenshot Mandatory Rule
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                2.1. <strong className="text-charcoal font-bold">End-Screen Screenshots:</strong> Team captains MUST capture a clear screenshot of the end-game scoreboards showing total kills, finish placement, and player IGNs.
              </p>
              <p>
                2.2. <strong className="text-charcoal font-bold">POV Recording:</strong> For finals and high-stakes matches, admins reserve the right to require players to record full screen/POV gameplay videos. Failure to produce a clean POV video when requested by an admin will lead to match disqualification.
              </p>
            </div>
          </section>

          {/* Rule 3: Zero Tolerance Anti-Cheat */}
          <section className="rounded-3xl border border-coral/30 bg-coral/10 p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-coral">
              <ShieldAlert className="text-coral" size={20} /> 3. Anti-Cheat Enforcement &amp; Banned Devices
            </h2>
            <div className="space-y-3 text-charcoal font-medium">
              <p>
                3.1. <strong className="text-coral font-bold">Emulators &amp; Hacks:</strong> Emulator usage in mobile-only tournaments, wallhacks, auto-aim, recoil scripts, and altered APK files result in an instant ban.
              </p>
              <p>
                3.2. <strong className="text-coral font-bold">Teaming:</strong> Teaming with rival squads will cause both squads to be permanently banned from Zyrox Arena tournaments.
              </p>
            </div>
          </section>

          {/* Rule 4: Single Registration & 1 Slot Rule */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <CheckCircle2 className="text-neon" size={20} /> 4. Single Tournament Registration &amp; Slot Lock Policy
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                4.1. <strong className="text-charcoal font-bold">1 Slot Per Player / Email / Mobile Number:</strong> To ensure equal competitive access and prevent slot hoarding, each player or squad is strictly limited to 1 registration entry per tournament. System validation automatically blocks duplicate registration attempts.
              </p>
              <p>
                4.2. <strong className="text-charcoal font-bold">Duplicate Slot Cancellation:</strong> Submitting multiple entries using alternative emails or phone numbers will lead to instant forfeiture of all slots without fee refunds.
              </p>
            </div>
          </section>

          {/* Rule 5: Time-Bound Roster Edit & Auto Re-Locking Policy */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <Gavel className="text-gold" size={20} /> 5. Sensitive Credential Change &amp; Time-Limited Edit Window
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                5.1. <strong className="text-charcoal font-bold">Protected Credential Locks:</strong> Sensitive tournament details (Email, In-Game Character UID, and Contact Number) are locked upon registration to maintain roster anti-cheat integrity.
              </p>
              <p>
                5.2. <strong className="text-charcoal font-bold">Admin Permission Required:</strong> To edit protected credentials, players must submit a formal Change Request via their Profile Dashboard specifying valid reasons.
              </p>
              <p>
                5.3. <strong className="text-charcoal font-bold">Time-Limited Edit Window &amp; Automatic Re-Lock:</strong> Upon Admin approval, a time-limited editing window (e.g., 15 minutes or 1 hour) is unlocked with a live countdown timer. Once the player saves changes OR when the countdown timer expires, credentials automatically re-lock.
              </p>
            </div>
          </section>

          {/* Rule 6: Admin Decision Final */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-charcoal">
              <Gavel className="text-gold" size={20} /> 6. Dispute Resolution &amp; Admin Rights
            </h2>
            <div className="space-y-3 text-charcoal">
              <p>
                6.1. <strong className="text-charcoal font-bold">Admin Authority:</strong> In any match dispute, technical issue, or roster verification scenario, the head tournament admin's decision is final and binding on all participating players.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
