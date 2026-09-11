import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/admin-api";
import { verifyTOTP } from "@/lib/totp";
import {
  getRegisteredAdmin,
  registerAdminCredentials,
  DEFAULT_TOTP_SECRET,
} from "@/lib/adminCredentialStore";
import {
  ShieldCheck,
  Smartphone,
  Lock,
  Mail,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
  `otpauth://totp/ZyroxArena:Admin?secret=${DEFAULT_TOTP_SECRET}&issuer=ZyroxArena`
)}`;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isTrustedDevice, setIsTrustedDevice] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const admin = getRegisteredAdmin();
    const hasAdmin = Boolean(admin);
    setIsRegistered(hasAdmin);

    const trustedUntil = Number(localStorage.getItem("zyrox_admin_2fa_trusted_until") || 0);
    const trusted = trustedUntil > Date.now();
    setIsTrustedDevice(trusted);

    // Default to showing QR code if registering for the first time
    setShowQr(!hasAdmin);
  }, []);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(DEFAULT_TOTP_SECRET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError("Please enter both email address and password.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (cleanPass.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (!isRegistered) {
        // First-Time Registration Step 1 -> Move to 2FA Enrollment
        setStep(2);
        setShowQr(true);
      } else {
        // Existing Admin Login -> Validate Credentials Strictly
        await adminApi.login(cleanEmail, cleanPass);

        // Check trusted device
        const trustedUntil = Number(localStorage.getItem("zyrox_admin_2fa_trusted_until") || 0);
        if (trustedUntil > Date.now()) {
          adminApi.setSession("session_token_" + Date.now());
          const adminPath = import.meta.env.VITE_ADMIN_PATH || "control-panel-dev";
          navigate(`/${adminPath}`);
          return;
        }

        setStep(2);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid admin credentials. Access denied.";
      if (msg === "NO_ADMIN_REGISTERED") {
        setIsRegistered(false);
        setStep(2);
        setShowQr(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!totpCode || totpCode.trim().length !== 6 || !/^\d{6}$/.test(totpCode.trim())) {
      setError("Invalid 2FA Authenticator Code. Must be exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const isTotpValid = await verifyTOTP(DEFAULT_TOTP_SECRET, totpCode);
      if (!isTotpValid) {
        throw new Error("Invalid 2FA Authenticator Code. Please check your phone's clock or Authenticator app.");
      }

      if (!isRegistered) {
        // First-Time Admin Registration completion!
        registerAdminCredentials(email, password, DEFAULT_TOTP_SECRET);
        setIsRegistered(true);
      } else {
        // Re-verify credentials before granting session
        await adminApi.login(email, password);
      }

      if (rememberDevice) {
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem("zyrox_admin_2fa_trusted_until", String(Date.now() + thirtyDays));
      }

      adminApi.setSession("session_token_" + Date.now());
      const adminPath = import.meta.env.VITE_ADMIN_PATH || "control-panel-dev";
      navigate(`/${adminPath}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "2FA Verification Failed. Access Denied.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-10 text-charcoal">
      <div className="w-full max-w-md rounded-3xl glass-card p-8 shadow-glass-xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-neon via-gold to-coral shadow-warm">
            {isRegistered ? <ShieldCheck size={18} className="text-white" /> : <UserPlus size={18} className="text-white" />}
          </span>
          <h1 className="text-xl font-bold font-display tracking-wide uppercase text-charcoal">
            {isRegistered ? "Admin Authentication" : "Initial Admin Setup"}
          </h1>
        </div>
        <p className="text-xs text-charcoal-muted mb-6 font-medium">
          {!isRegistered
            ? step === 1
              ? "Step 1 of 2: Create Master Admin Email & Password"
              : "Step 2 of 2: Bind 2FA Authenticator App to Complete Setup"
            : step === 1
            ? "Step 1 of 2: Primary Admin Credentials"
            : "Step 2 of 2: Authenticator 2FA Security Verification"}
        </p>

        {/* Step 1 Form */}
        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1.5 flex items-center gap-1 font-bold">
                <Mail size={13} className="text-gold" /> {!isRegistered ? "New Admin Email Address *" : "Admin Email Address *"}
              </label>
              <input
                type="email"
                required
                placeholder="admin@zyroxstudioz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-3 text-xs text-charcoal outline-none focus:border-neon font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1.5 flex items-center gap-1 font-bold">
                <Lock size={13} className="text-gold" /> {!isRegistered ? "New Password (min 6 chars) *" : "Password *"}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-3 text-xs text-charcoal outline-none focus:border-neon font-medium"
              />
            </div>

            {isTrustedDevice && isRegistered && (
              <div className="rounded-2xl border border-neon/20 bg-neon/5 p-3 text-[11px] text-neon flex items-center gap-2 font-medium">
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span>Trusted device remembered. 2FA step will be automated.</span>
              </div>
            )}

            {successMsg && (
              <div className="rounded-2xl border border-neon/30 bg-neon/10 p-3.5 text-xs text-neon flex items-start gap-2 font-bold">
                <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full shimmer-btn rounded-2xl py-3.5 text-xs font-bold text-white shadow-glow transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {loading
                ? "Validating..."
                : !isRegistered
                ? "Continue to 2FA Setup →"
                : isTrustedDevice
                ? "Sign In to Admin Dashboard →"
                : "Continue to 2FA Step →"}
            </button>
          </form>
        ) : (
          /* Step 2 Form */
          <form onSubmit={handleStep2} className="space-y-5">
            {/* Authenticator Box */}
            <div className="rounded-2xl border border-neon/30 bg-neon/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-neon text-xs">
                  <QrCode size={16} /> {!isRegistered ? "Setup Authenticator App" : "2FA Security Verification"}
                </div>
                <button
                  type="button"
                  onClick={() => setShowQr((v) => !v)}
                  className="text-[11px] font-mono font-bold text-neon underline hover:text-charcoal"
                >
                  {showQr ? "Hide QR" : !isRegistered ? "Show Setup QR" : "Show QR Code"}
                </button>
              </div>

              {showQr && (
                <div className="flex flex-col items-center gap-3 pt-1">
                  <div className="p-2.5 bg-white rounded-2xl border border-charcoal/10 shadow-glass">
                    <img
                      src={QR_URL}
                      alt="Zyrox Arena Authenticator 2FA QR Code"
                      className="h-40 w-40 rounded-xl"
                    />
                  </div>
                  <p className="text-[11px] text-charcoal-muted text-center leading-tight font-medium">
                    Scan with <strong>Google Authenticator</strong>, <strong>Authy</strong>, or <strong>Microsoft Authenticator</strong> on your phone.
                  </p>
                </div>
              )}

              {/* Manual Secret Key */}
              <div className="pt-2 border-t border-neon/20 flex items-center justify-between text-xs">
                <div>
                  <span className="block text-[10px] font-mono text-charcoal-muted uppercase font-bold">Manual Base32 Secret Key</span>
                  <code className="font-mono text-xs font-bold text-gold-warm">{DEFAULT_TOTP_SECRET}</code>
                </div>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="flex items-center gap-1 rounded-xl bg-white/80 border border-charcoal/10 px-3 py-1.5 text-[11px] font-bold text-charcoal hover:bg-white shadow-glass transition-all"
                >
                  {copied ? <Check size={13} className="text-neon" /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* 6-Digit TOTP Input */}
            <div>
              <label className="block text-xs font-mono text-charcoal-muted mb-1.5 font-bold flex items-center gap-1">
                <Smartphone size={14} className="text-neon" /> Enter 6-Digit Live Authenticator Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="••••••"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-2xl border border-gold bg-ivory-warm px-4 py-3 text-center text-xl font-mono tracking-widest text-gold-warm font-bold outline-none focus:border-neon shadow-glass"
              />
            </div>

            {/* Trust Device Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-charcoal-muted font-medium select-none bg-ivory-warm/60 p-3 rounded-xl border border-charcoal/5">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded border-charcoal/20 text-neon focus:ring-neon h-4 w-4 accent-neon"
              />
              <span>Trust this device &amp; remember 2FA for 30 days</span>
            </label>

            {error && (
              <div className="rounded-2xl border border-coral/30 bg-coral/10 p-3.5 text-xs text-coral flex items-start gap-2 font-bold">
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full shimmer-btn rounded-2xl py-3.5 text-xs font-bold text-white shadow-glow transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading
                ? "Verifying 2FA Code..."
                : !isRegistered
                ? "Register Admin & Access Dashboard"
                : "Verify 2FA & Access Admin Control Panel"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-charcoal-muted hover:text-charcoal pt-1 font-semibold"
            >
              ← Back to credentials
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
