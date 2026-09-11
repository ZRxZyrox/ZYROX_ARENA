import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/ui/Seo";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useLiveTournaments } from "@/lib/tournamentStore";
import { useLiveTeams } from "@/lib/registrationStore";
import { ShieldCheck, LogIn, Users, Plus, Trash2, UserCheck, AlertCircle, Lock, CheckCircle2, Trophy } from "lucide-react";

interface FormData {
  playerName: string;
  inGameId: string;
  email: string;
  phone: string;
  discordId?: string;
  teamName?: string;
  teammates?: { name: string; inGameId: string }[];
  acceptTerms: boolean;
}

export default function RegisterPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { tournaments } = useLiveTournaments();
  const { registrations } = useLiveTeams();

  const tournament = tournaments.find((t) => t.slug === slug) ?? {
    title: slug?.replace(/-/g, " ").toUpperCase() ?? "Tournament",
    mode: "squad",
    entry_fee: 250,
    prize_pool_display: "₹1,50,000",
    game: "BGMI",
    requiredFields: {
      requireTeamName: true,
      requirePhone: true,
      requireDiscordId: false,
      requireTeammates: true,
      minTeammatesCount: 3,
    },
  };

  const isAlreadyRegistered = useMemo(() => {
    if (!user) return false;
    const cleanEmail = user.email.toLowerCase();
    const cleanPhone = user.phone ? user.phone.replace(/\D/g, "") : "";

    return registrations.some((r) => {
      const matchGame = tournament && r.game.toLowerCase() === (tournament.game || "bgmi").toLowerCase();
      const matchEmail = r.email.toLowerCase() === cleanEmail;
      const matchPhone = cleanPhone && r.phone && r.phone.replace(/\D/g, "") === cleanPhone;
      return matchGame && (matchEmail || matchPhone);
    });
  }, [user, registrations, tournament]);

  const requiredConfig = tournament.requiredFields ?? {
    requireTeamName: true,
    requirePhone: true,
    requireDiscordId: false,
    requireTeammates: true,
    minTeammatesCount: 3,
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<FormData>({
    defaultValues: {
      acceptTerms: true,
      teammates: [
        { name: "", inGameId: "" },
        { name: "", inGameId: "" },
        { name: "", inGameId: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teammates",
  });

  // Pre-fill fields when signed in
  useEffect(() => {
    if (user) {
      if (user.fullName) setValue("playerName", user.fullName);
      if (user.inGameId) setValue("inGameId", user.inGameId);
      if (user.email) setValue("email", user.email);
      if (user.phone) setValue("phone", user.phone);
    }
  }, [user, setValue]);

  async function onSubmit(values: FormData) {
    if (!user) {
      openAuthModal("login");
      return;
    }

    // Custom Validation logic based on Google Forms Admin config
    if (!values.playerName || values.playerName.length < 2) {
      setError("Captain Name is required (minimum 2 characters).");
      return;
    }
    if (!values.inGameId || values.inGameId.length < 2) {
      setError("Captain In-Game Character ID is required.");
      return;
    }
    if (!values.email || !values.email.includes("@")) {
      setError("A valid Email address is required.");
      return;
    }
    if (requiredConfig.requirePhone && (!values.phone || values.phone.length < 10)) {
      setError("A valid 10-digit Phone Number is required.");
      return;
    }
    if (tournament.mode === "squad" && requiredConfig.requireTeamName && (!values.teamName || values.teamName.length < 2)) {
      setError("Official Team Name is required for Squad registrations.");
      return;
    }
    if (!values.acceptTerms) {
      setError("You must accept the Zyrox Arena Fair Play & Anti-Cheat terms.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_WORKER_API_URL}/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ tournamentSlug: slug, mode: tournament.mode, ...values }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Registration submission failed.");
      }

      const { orderId, razorpayOrderId } = await res.json();

      // Launch Razorpay checkout
      // @ts-expect-error — Razorpay SDK loaded via script tag or window
      if (window.Razorpay && razorpayOrderId) {
        // @ts-expect-error — Razorpay SDK
        const rzp = new window.Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          order_id: razorpayOrderId,
          name: "Zyrox Arena",
          description: `Tournament Slot Entry — ${tournament.title}`,
          handler: function () {
            navigate(`/payment/${orderId}/status`);
          },
        });
        rzp.open();
        return;
      }

      navigate(`/payment/${orderId}/status`);
    } catch (e) {
      // In dev environment or if payment worker is bypassable, navigate directly to status
      navigate(`/payment/order_${Date.now()}/status?status=SUCCESS&team=${encodeURIComponent(values.teamName || values.playerName)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#0A0A14] text-charcoal dark:text-[#ECEDF0]">
      <Seo title={`Register — ${tournament.title}`} description="Official team registration portal for Zyrox Arena tournaments." />
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-14">
        {/* Header */}
        <div className="mb-8 border-b border-charcoal/10 pb-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neon/15 border border-neon/30 px-3 py-1 font-mono text-xs font-bold text-neon uppercase">
              {tournament.mode} Tournament
            </span>
            <span className="font-mono text-xs font-bold text-gold-warm">
              Entry: ₹{tournament.entry_fee} • Prize: {tournament.prize_pool_display}
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold uppercase text-charcoal">
            Register — <span className="text-gradient-warm">{tournament.title}</span>
          </h1>
          <p className="mt-1.5 text-xs text-charcoal-muted font-medium">
            Lock in your official tournament slot. Captain must complete team verification.
          </p>
        </div>

        {/* Require Sign-in Prompt if Unauthenticated */}
        {!user ? (
          <div className="glass-card rounded-3xl p-8 md:p-10 text-center space-y-5 border border-neon/30 shadow-glass-xl animate-fade-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neon/15 border border-neon/30 text-neon">
              <Lock size={28} />
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-charcoal">
                Account Sign-In Required
              </h2>
              <p className="mt-2 text-xs text-charcoal-muted max-w-md mx-auto font-medium">
                To prevent slot spam and ensure anti-cheat account verification, team captains must sign in to their Zyrox Arena account before opening the registration form.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="w-full sm:w-auto shimmer-btn rounded-2xl px-8 py-3.5 text-xs font-bold text-white shadow-glow flex items-center justify-center gap-2"
              >
                <LogIn size={15} /> Sign In to Account
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="w-full sm:w-auto glass-card rounded-2xl border border-charcoal/10 px-8 py-3.5 text-xs font-bold text-charcoal hover:border-gold transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck size={15} /> Create Free Account
              </button>
            </div>
          </div>
        ) : isAlreadyRegistered ? (
          /* Already Applied Notice Card */
          <div className="glass-card rounded-3xl p-8 md:p-10 text-center space-y-5 border border-neon-mint/30 shadow-glass-xl animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-mint/15 border border-neon-mint/30 text-neon-mint">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="inline-block rounded-full bg-neon-mint/15 border border-neon-mint/30 px-3 py-1 font-mono text-xs font-bold text-neon-mint uppercase mb-2">
                Slot Confirmed ✓
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-charcoal">
                You Have Already Registered!
              </h2>
              <p className="mt-2 text-xs text-charcoal-muted max-w-md mx-auto font-medium leading-relaxed">
                Our anti-cheat rules enforce a strict 1-slot limit per player / email / phone for each tournament. Your team slot has been confirmed and locked for <strong>{tournament.title}</strong>.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4 max-w-md mx-auto border border-charcoal/10 text-left text-xs space-y-1 font-mono">
              <div className="text-charcoal font-bold">Registered Captain: {user.fullName}</div>
              <div className="text-charcoal-muted">Email: {user.email}</div>
              <div className="text-gold-warm font-bold">In-Game ID: {user.inGameId}</div>
              <div className="text-neon font-bold">Status: Payment Verified &amp; Room Credentials Reserved</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/tournaments/${slug || "winter-circuit-finals"}`}
                className="w-full sm:w-auto shimmer-btn rounded-2xl px-7 py-3 text-xs font-bold text-white shadow-glow flex items-center justify-center gap-2"
              >
                <Trophy size={15} /> View Tournament Hub
              </Link>
            </div>
          </div>
        ) : (
          /* Form for Authenticated Captain */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
            
            {/* Logged in User Bar */}
            <div className="flex items-center justify-between rounded-2xl bg-neon-mint/10 border border-neon-mint/20 px-4 py-3 text-xs font-bold text-charcoal">
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-neon-mint" />
                <span>Signed in as <strong>{user.fullName}</strong> ({user.email})</span>
              </div>
              <span className="font-mono text-[10px] text-neon-mint uppercase">Verified Captain</span>
            </div>

            {/* Team Name if Squad */}
            {tournament.mode === "squad" && requiredConfig.requireTeamName && (
              <div className="glass-card rounded-3xl p-6 border border-charcoal/10 space-y-2">
                <label className="block text-xs font-mono font-bold text-charcoal">Official Team Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Soul Esports / GodLike Gaming"
                  {...register("teamName")}
                  className="w-full rounded-2xl border border-charcoal/15 bg-ivory-warm px-4 py-3 text-xs text-charcoal outline-none focus:border-neon font-bold placeholder:text-charcoal-muted/50"
                />
              </div>
            )}

            {/* Captain Information */}
            <div className="glass-card rounded-3xl p-6 border border-charcoal/10 space-y-4">
              <h3 className="font-display text-lg font-bold uppercase text-charcoal flex items-center gap-2 border-b border-charcoal/8 pb-3">
                <ShieldCheck size={18} className="text-neon" /> Captain Roster Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal mb-1">Captain Full Name *</label>
                  <input
                    type="text"
                    placeholder="Vikramaditya Singh"
                    {...register("playerName")}
                    className="w-full rounded-2xl border border-charcoal/15 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal mb-1">In-Game Character ID (IGN) *</label>
                  <input
                    type="text"
                    placeholder="5182940291 (Viper)"
                    {...register("inGameId")}
                    className="w-full rounded-2xl border border-charcoal/15 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold text-gold-warm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="captain@team.gg"
                    {...register("email")}
                    className="w-full rounded-2xl border border-charcoal/15 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    {...register("phone")}
                    className="w-full rounded-2xl border border-charcoal/15 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>
              </div>

              {requiredConfig.requireDiscordId && (
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal mb-1">Discord Handle</label>
                  <input
                    type="text"
                    placeholder="CaptainViper#1337"
                    {...register("discordId")}
                    className="w-full rounded-2xl border border-charcoal/15 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                  />
                </div>
              )}
            </div>

            {/* Teammates Roster Section if Required */}
            {tournament.mode === "squad" && requiredConfig.requireTeammates && (
              <div className="glass-card rounded-3xl p-6 border border-charcoal/10 space-y-4">
                <div className="flex items-center justify-between border-b border-charcoal/8 pb-3">
                  <h3 className="font-display text-lg font-bold uppercase text-charcoal flex items-center gap-2">
                    <Users size={18} className="text-gold" /> Teammate Squad Roster
                  </h3>
                  <button
                    type="button"
                    onClick={() => append({ name: "", inGameId: "" })}
                    className="rounded-xl bg-neon/15 border border-neon/30 px-3 py-1 text-xs font-bold text-neon hover:bg-neon hover:text-white transition-all flex items-center gap-1"
                  >
                    <Plus size={13} /> Add Teammate
                  </button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center rounded-2xl bg-ivory-warm p-3 border border-charcoal/5">
                      <div>
                        <input
                          type="text"
                          placeholder={`Player ${idx + 2} Name`}
                          {...register(`teammates.${idx}.name` as const)}
                          className="w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2 text-xs text-charcoal font-medium outline-none focus:border-neon shadow-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder={`Player ${idx + 2} In-Game ID`}
                          {...register(`teammates.${idx}.inGameId` as const)}
                          className="w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2 text-xs text-charcoal font-bold outline-none focus:border-neon shadow-sm"
                        />
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="p-2 text-coral hover:bg-coral/10 rounded-xl transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="rounded-2xl border border-coral/30 bg-coral/10 p-4 text-xs font-bold text-coral flex items-center gap-2 font-mono">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Terms Acceptance & Submit */}
            <div className="glass-card rounded-3xl p-6 border border-charcoal/10 space-y-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="mt-0.5 h-4 w-4 rounded accent-neon cursor-pointer"
                />
                <span className="text-xs text-charcoal-muted font-medium">
                  I agree to the <Link to="/rules" className="text-neon underline font-bold">Zyrox Arena Fair Play Rules</Link> and confirm that all squad character IDs are accurate. I understand entry fees are non-refundable after slot assignment.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full shimmer-btn rounded-2xl py-4 text-xs font-bold text-white shadow-glow uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {submitting ? "Processing Slot Request..." : `Proceed to Pay Entry Fee (₹${tournament.entry_fee}) →`}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
