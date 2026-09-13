import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/admin-api";
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { wipeAllAdminCredentialsData } from "@/lib/adminCredentialStore";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const configuredEmail = (import.meta.env.VITE_ADMIN_EMAIL || "admin@zyroxarena.com").trim();

  const [email, setEmail] = useState(configuredEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError("Please enter both your admin email address and password.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Direct login against Cloudflare Worker backend and .env variables
      await adminApi.login(cleanEmail, cleanPass);

      // Store authenticated session
      const sessionToken = "session_token_" + Date.now();
      adminApi.setSession(sessionToken);

      // Trust device for 30 days
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("zyrox_admin_2fa_trusted_until", String(Date.now() + thirtyDays));

      setSuccessMsg("Authentication successful! Redirecting to Control Panel...");

      const adminPath = import.meta.env.VITE_ADMIN_PATH || "control-panel-dev";
      setTimeout(() => {
        navigate(`/${adminPath}`);
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      if (msg.includes("Invalid admin email") || msg.includes("Invalid credentials") || msg.includes("401")) {
        setError(
          `Invalid email or password. Please verify the credentials in your .env file or Cloudflare dashboard.`
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleResetCache = () => {
    wipeAllAdminCredentialsData();
    setEmail(configuredEmail);
    setPassword("");
    setError(null);
    setSuccessMsg("Local admin credential cache cleared successfully.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/60 px-4 py-10 text-white transition-colors relative">
      <div className="w-full max-w-md rounded-3xl glass-card border border-white/20 p-8 shadow-glass-xl relative overflow-hidden backdrop-blur-2xl">
        {/* Ambient subtle monochrome glow accents */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1.5 relative z-10">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black shadow-glass">
            <ShieldCheck size={20} className="text-black" />
          </span>
          <div>
            <h1 className="text-xl font-bold font-display tracking-wide uppercase text-white">
              Admin Authentication
            </h1>
            <p className="text-[11px] font-mono text-neutral-400 font-bold">
              ZYROX ARENA CONTROL PANEL
            </p>
          </div>
        </div>

        {/* Configured Admin Hint Badge */}
        {configuredEmail && (
          <div className="my-4 rounded-xl border border-white/20 bg-white/10 p-2.5 flex items-center justify-between text-xs relative z-10">
            <div className="flex items-center gap-1.5 text-white font-semibold text-[11px]">
              <Sparkles size={13} className="text-white" />
              <span>Configured Admin:</span>
              <strong className="font-mono text-white">{configuredEmail}</strong>
            </div>
            {email !== configuredEmail && (
              <button
                type="button"
                onClick={() => setEmail(configuredEmail)}
                className="text-[10px] font-bold text-neutral-300 hover:text-white underline"
              >
                Use this
              </button>
            )}
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="my-3 rounded-2xl border border-white/30 bg-white/10 p-3.5 text-xs text-white flex items-start gap-2.5 font-bold relative z-10 animate-fade-in">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-white" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {successMsg && (
          <div className="my-3 rounded-2xl border border-white/30 bg-white/15 p-3.5 text-xs text-white flex items-start gap-2.5 font-bold relative z-10 animate-fade-in">
            <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-white" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mt-4 relative z-10">
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1.5 flex items-center gap-1 font-bold">
              <Mail size={13} className="text-neutral-400" /> Admin Email Address *
            </label>
            <input
              type="email"
              required
              autoFocus
              placeholder="admin@zyroxarena.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white outline-none focus:border-white font-medium transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1.5 flex items-center gap-1 font-bold">
              <Lock size={13} className="text-neutral-400" /> Admin Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 pr-11 text-xs text-white outline-none focus:border-white font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-3.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-all shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In to Admin Panel →</span>
            )}
          </button>
        </form>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 relative z-10">
          <span>Variables in Cloudflare / .env</span>
          <button
            type="button"
            onClick={handleResetCache}
            className="flex items-center gap-1 hover:text-white transition-colors font-semibold"
            title="Wipe stale credentials stored in browser localStorage"
          >
            <RotateCcw size={11} />
            <span>Reset Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
}
