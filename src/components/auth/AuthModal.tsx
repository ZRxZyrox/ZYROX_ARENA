import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, ShieldCheck, UserPlus, LogIn, Swords, AlertCircle } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, signUp, authModalTab } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [inGameId, setInGameId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authModalTab) setTab(authModalTab);
    setError(null);
  }, [authModalTab, isAuthModalOpen]);

  // Lock body scroll completely while modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (tab === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, inGameId, phone);
      }
      closeAuthModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-md px-4 overflow-hidden">
      <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 md:p-8 shadow-glass-xl text-charcoal dark:text-[#ECEDF0] animate-in zoom-in-95 fade-in duration-200 border border-charcoal/10 dark:border-white/15">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-5 top-5 rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black shadow-glow">
            <Swords size={16} />
          </span>
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
            Zyrox <span className="text-gradient-warm">Player Authentication</span>
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mb-5 font-medium">
          {tab === "login"
            ? "Sign in to manage your team roster and access live brackets."
            : "Register your official Team Captain account to enter tournaments."}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
              tab === "login"
                ? "bg-white text-black font-black shadow-glow"
                : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <LogIn size={14} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("signup"); setError(null); }}
            className={`flex flex-1 items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
              tab === "signup"
                ? "bg-white text-black font-black shadow-glow"
                : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <UserPlus size={14} /> Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" ? (
            <>
              <div>
                <label className="block text-[11px] font-mono text-white mb-1 font-bold">Full Name *</label>
                <input
                  type="text" required placeholder="e.g. Vikramaditya Singh"
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white outline-none focus:border-white font-medium placeholder:text-neutral-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-white font-bold mb-1">In-Game ID / IGN *</label>
                  <input
                    type="text" required placeholder="5192840291 (Viper)"
                    value={inGameId} onChange={(e) => setInGameId(e.target.value)}
                    className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs text-white outline-none focus:border-white font-bold placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white mb-1 font-bold">WhatsApp Phone *</label>
                  <input
                    type="tel" required placeholder="+91 9876543210"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white outline-none focus:border-white font-medium placeholder:text-neutral-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-white mb-1 font-bold">Email Address *</label>
                  <input
                    type="email" required placeholder="captain@esports.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white outline-none focus:border-white font-medium placeholder:text-neutral-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white mb-1 font-bold">Password * (min 6 chars)</label>
                  <input
                    type="password" required minLength={6} placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white outline-none focus:border-white font-medium placeholder:text-neutral-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-mono text-white mb-1 font-bold">Email Address *</label>
                <input
                  type="email" required placeholder="captain@esports.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white outline-none focus:border-white font-medium placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white mb-1 font-bold">Password *</label>
                <input
                  type="password" required placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white outline-none focus:border-white font-medium placeholder:text-neutral-500"
                />
              </div>
            </>
          )}

          {error && (
            <div className="rounded-2xl border border-white/30 bg-white/10 p-3.5 text-xs text-white flex items-start gap-2 font-medium">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-white" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit" disabled={submitting}
            className="w-full rounded-2xl py-3.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-neutral-200 shadow-glow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-3"
          >
            {submitting ? "Authenticating…" : tab === "login" ? "Sign In & Access Tournaments" : "Register Team Captain Account"}
          </button>
        </form>

        {/* Bottom Toggle Link */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-neutral-400">
          {tab === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => { setTab("signup"); setError(null); }}
                className="text-white font-bold underline hover:text-neutral-300 transition-colors ml-1"
              >
                Create Account Now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setTab("login"); setError(null); }}
                className="text-white font-bold underline hover:text-neutral-300 transition-colors ml-1"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1.5 justify-center text-[10px] text-neutral-400">
          <ShieldCheck size={13} className="text-white" /> 256-Bit Encrypted Tournament Profile &amp; Supabase RLS
        </div>
      </div>
    </div>
  );
}
