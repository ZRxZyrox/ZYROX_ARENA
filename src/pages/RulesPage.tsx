import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { ShieldAlert, Gavel, CheckCircle2, Clock, Swords } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-transparent text-charcoal dark:text-[#ECEDF0] transition-colors relative">
      <Seo
        title="Tournament Rules & Fair Play Code — ZYROX ARENA"
        description="Official rulebook, anti-cheat enforcement, match protocols, and dispute procedures for all Zyrox Arena tournaments."
      />
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16 safe-bottom-dock">
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white">
            <Swords size={14} className="text-white" /> Official Esports Rulebook
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl text-white">
            Tournament <span className="text-gradient-warm">Rules</span> &amp; Fair Play
          </h1>
          <p className="mt-3 text-sm text-neutral-400 font-medium">
            Mandatory guidelines for all players &amp; teams participating in BGMI, Free Fire, Valorant, FC, and Cricket tournaments on Zyrox Arena.
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-white font-medium">
          
          {/* Rule 1: Check-in & Punctuality */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <Clock className="text-white" size={20} /> 1. Lobby Schedule &amp; Check-In Protocol
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                1.1. <strong className="text-white font-bold">Lobby Room ID &amp; Password:</strong> Room credentials are distributed 15 minutes before the scheduled match time via WhatsApp, SMS, and your private Tournament Dashboard.
              </p>
              <p>
                1.2. <strong className="text-white font-bold">Slot Numbers:</strong> Teams in battle royale games (BGMI / Free Fire) must join their designated slot numbers as shown in the match group schedule. Joining another team's slot will result in an immediate lobby kick and potential match forfeiture.
              </p>
              <p>
                1.3. <strong className="text-white font-bold">Late Arrival:</strong> A 5-minute grace period is given after room creation. Once the countdown timer ends, the match will start strictly on time regardless of missing players.
              </p>
            </div>
          </section>

          {/* Rule 2: Proof & Screenshot Submission */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <CheckCircle2 className="text-white" size={20} /> 2. Proof Submission &amp; Screenshot Mandatory Rule
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                2.1. <strong className="text-white font-bold">End-Screen Screenshots:</strong> Team captains MUST capture a clear screenshot of the end-game scoreboards showing total kills, finish placement, and player IGNs.
              </p>
              <p>
                2.2. <strong className="text-white font-bold">POV Recording:</strong> For finals and high-stakes matches, admins reserve the right to require players to record full screen/POV gameplay videos. Failure to produce a clean POV video when requested by an admin will lead to match disqualification.
              </p>
            </div>
          </section>

          {/* Rule 3: Zero Tolerance Anti-Cheat */}
          <section className="glass-card rounded-3xl border border-white/20 bg-white/10 p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <ShieldAlert className="text-white" size={20} /> 3. Anti-Cheat Enforcement &amp; Banned Devices
            </h2>
            <div className="space-y-3 text-neutral-300 font-medium">
              <p>
                3.1. <strong className="text-white font-bold">Emulators &amp; Hacks:</strong> Emulator usage in mobile-only tournaments, wallhacks, auto-aim, recoil scripts, and altered APK files result in an instant perma-ban.
              </p>
              <p>
                3.2. <strong className="text-white font-bold">Teaming:</strong> Teaming with rival squads will cause both squads to be permanently banned from Zyrox Arena tournaments without prize entitlement.
              </p>
            </div>
          </section>

          {/* Rule 4: Single Registration & 1 Slot Rule */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <CheckCircle2 className="text-white" size={20} /> 4. Single Tournament Registration &amp; Slot Lock Policy
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                4.1. <strong className="text-white font-bold">1 Slot Per Player / Email / Mobile Number:</strong> To ensure equal competitive access and prevent slot hoarding, each player or squad is strictly limited to 1 registration entry per tournament. System validation automatically blocks duplicate registration attempts.
              </p>
              <p>
                4.2. <strong className="text-white font-bold">Duplicate Slot Cancellation:</strong> Submitting multiple entries using alternative emails or phone numbers will lead to instant forfeiture of all slots without fee refunds.
              </p>
            </div>
          </section>

          {/* Rule 5: Time-Bound Roster Edit & Auto Re-Locking Policy */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <Gavel className="text-white" size={20} /> 5. Sensitive Credential Change &amp; Time-Limited Edit Window
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                5.1. <strong className="text-white font-bold">Protected Credential Locks:</strong> Sensitive tournament details (Email, In-Game Character UID, and Contact Number) are locked upon registration to maintain roster anti-cheat integrity.
              </p>
              <p>
                5.2. <strong className="text-white font-bold">Admin Permission Required:</strong> To edit protected credentials, players must submit a formal Change Request via their Profile Dashboard specifying valid reasons.
              </p>
              <p>
                5.3. <strong className="text-white font-bold">Time-Limited Edit Window &amp; Automatic Re-Lock:</strong> Upon Admin approval, a time-limited editing window (e.g., 15 minutes or 1 hour) is unlocked with a live countdown timer. Once the player saves changes OR when the countdown timer expires, credentials automatically re-lock.
              </p>
            </div>
          </section>

          {/* Rule 6: Dispute Resolution */}
          <section className="glass-card rounded-3xl p-6 md:p-8 space-y-4 border border-white/10">
            <h2 className="flex items-center gap-2.5 font-display text-xl uppercase font-bold text-white">
              <Gavel className="text-white" size={20} /> 6. Dispute Resolution &amp; Admin Rights
            </h2>
            <div className="space-y-3 text-neutral-300">
              <p>
                6.1. <strong className="text-white font-bold">Admin Authority:</strong> In any match dispute, technical issue, or roster verification scenario, the head tournament admin's decision is final and binding on all participating players.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
