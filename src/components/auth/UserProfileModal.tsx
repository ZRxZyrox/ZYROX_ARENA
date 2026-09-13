import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  submitProfileChangeRequest,
  getStoredUsers,
  consumeAndLockEditPermission,
  type EditPermissionWindow,
} from "@/lib/userManagementStore";
import { getStoredCoupons } from "@/lib/couponStore";
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Award,
  Gamepad2,
  Wallet,
  CheckCircle2,
  Edit3,
  Send,
  AlertCircle,
  LogOut,
  Clock,
  Unlock,
  Ticket,
  Copy,
  Check,
  CreditCard,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "identity" | "awards" | "tournaments" | "wallet" | "coupons";

export default function UserProfileModal({ isOpen, onClose }: Props) {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("identity");

  // Editable Name state
  const [editableName, setEditableName] = useState(user?.fullName || "");
  const [isEditingName, setIsEditingName] = useState(false);

  // Unlocked Permission Edit State
  const [unlockedValue, setUnlockedValue] = useState("");
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const [activePerm, setActivePerm] = useState<EditPermissionWindow | null>(null);

  // Permission Change Request Modal State
  const [permissionModalField, setPermissionModalField] = useState<{
    field: "email" | "inGameId" | "phone";
    label: string;
    currentValue: string;
  } | null>(null);
  const [requestedValue, setRequestedValue] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live countdown timer for active edit permissions & name sync (must be called unconditionally!)
  useEffect(() => {
    if (!isOpen || !user) return;
    setEditableName(user.fullName || "");
    const all = getStoredUsers();
    const curr = all.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    const perm = curr?.editPermission;

    if (perm && perm.granted && !perm.isUsed) {
      const expires = new Date(perm.expiresAt).getTime();
      const now = Date.now();
      if (now < expires) {
        setActivePerm(perm);
        if (perm.field === "email") setUnlockedValue(user.email);
        if (perm.field === "inGameId") setUnlockedValue(user.inGameId);
        if (perm.field === "phone") setUnlockedValue(user.phone || "");

        const interval = setInterval(() => {
          const rem = expires - Date.now();
          if (rem <= 0) {
            setActivePerm(null);
            setTimeLeftStr("00:00");
            clearInterval(interval);
          } else {
            const mins = Math.floor(rem / 60000);
            const secs = Math.floor((rem % 60000) / 1000);
            setTimeLeftStr(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
          }
        }, 1000);

        return () => clearInterval(interval);
      } else {
        setActivePerm(null);
      }
    } else {
      setActivePerm(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  // Retrieve rich sectioned data for this user or standard mock profile defaults
  const allUsers = getStoredUsers();
  const userData = allUsers.find((u) => u.email.toLowerCase() === user.email.toLowerCase()) || {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    inGameId: user.inGameId,
    phone: user.phone,
    registeredAt: new Date().toISOString(),
    status: "active",
    awards: [
      { id: "a1", title: "Verified Player Roster", badge: "🛡️ FAIR PLAY CERTIFIED", icon: "🛡️", date: "2026-07-01" },
      { id: "a2", title: "Esports Season Participant", badge: "⚡ PRO ATHLETE", icon: "⚡", date: "2026-06-15" },
      { id: "a3", title: "BGMI Season 4 Champion", badge: "🏆 GRAND CHAMPION", icon: "🏆", date: "2026-06-15" },
    ],
    pastTournaments: [
      { id: "pt-1", title: "BGMI Showdown Season 4", game: "BGMI", mode: "Squad TPP", placement: "#1 Winner", prize: "₹4,20,000", date: "2026-07-10" },
      { id: "pt-2", title: "Valorant Winter Circuit", game: "Valorant", mode: "5v5 Squad", placement: "#3 Semifinals", prize: "₹50,000", date: "2026-06-22" },
    ],
    earnings: {
      totalEarned: "₹4,70,000",
      paidVia: "Razorpay Verified Bank / UPI",
      verifiedKyc: true,
      transactionHistory: [
        { id: "tx-1", amount: "₹4,20,000", date: "2026-07-11", status: "Paid" },
        { id: "tx-2", amount: "₹50,000", date: "2026-06-23", status: "Paid" },
      ],
    },
  };

  const handleSaveName = () => {
    if (!user) return;
    user.fullName = editableName.trim() || user.fullName;
    setIsEditingName(false);
    setFeedbackMsg({ type: "success", text: "Display name updated successfully!" });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleSaveAndReLock = (field: "email" | "inGameId" | "phone") => {
    if (!unlockedValue.trim() || !user) return;
    consumeAndLockEditPermission(user.email, field, unlockedValue.trim());

    if (field === "email") user.email = unlockedValue.trim();
    if (field === "inGameId") user.inGameId = unlockedValue.trim();
    if (field === "phone") user.phone = unlockedValue.trim();

    setActivePerm(null);
    setFeedbackMsg({
      type: "success",
      text: `${activePerm?.fieldLabel || "Details"} updated successfully and locked again!`,
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleOpenPermissionRequest = (field: "email" | "inGameId" | "phone", label: string, currentValue: string) => {
    setPermissionModalField({ field, label, currentValue });
    setRequestedValue("");
    setRequestReason("");
  };

  const handleSubmitPermissionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionModalField || !requestedValue.trim()) return;

    const res = submitProfileChangeRequest(
      user.id,
      user.email,
      user.fullName,
      permissionModalField.field,
      permissionModalField.label,
      permissionModalField.currentValue,
      requestedValue,
      requestReason
    );

    setPermissionModalField(null);
    setFeedbackMsg({ type: res.success ? "success" : "error", text: res.message });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "identity", label: "Profile & Identity", icon: User },
    { id: "awards", label: "Awards & Badges", icon: Award },
    { id: "tournaments", label: "Tournaments Played", icon: Gamepad2 },
    { id: "wallet", label: "Prize Wallet", icon: Wallet },
    { id: "coupons", label: "Coupons & Vouchers 🎟️", icon: Ticket },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-hidden no-scrollbar">
      {/* Responsive Dialog Window */}
      <div className="relative w-full max-w-4xl h-[90vh] md:h-[560px] max-h-[92vh] rounded-3xl glass-card border border-white/15 shadow-glass-xl text-white flex flex-col md:flex-row overflow-hidden no-scrollbar animate-scale-in">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-black/80 backdrop-blur-xl p-3.5 md:p-5 flex flex-col justify-between flex-shrink-0 no-scrollbar">
          <div>
            {/* User Profile Header Card */}
            <div className="flex items-center justify-between md:border-b border-white/10 md:pb-4 md:mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-white text-black font-display text-lg md:text-xl font-black shadow-glow flex-shrink-0">
                  {user.fullName[0]?.toUpperCase() || "P"}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-bold text-white text-xs md:text-sm truncate">
                    {user.fullName}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/30 px-2 py-0.5 font-mono text-[9px] font-bold text-white uppercase mt-0.5">
                    <CheckCircle2 size={10} className="text-white" /> Verified
                  </span>
                </div>
              </div>

              {/* Close Button on Mobile Header */}
              <button
                type="button"
                onClick={onClose}
                className="md:hidden rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar pt-2 md:pt-0">
              {NAV_ITEMS.map((t) => {
                const Icon = t.icon;
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 rounded-2xl px-3 py-2 md:px-3.5 md:py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0 md:flex-shrink ${
                      isActive
                        ? "bg-white text-black font-black shadow-glow scale-[1.02]"
                        : "text-neutral-400 bg-white/5 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={15} className={isActive ? "text-black" : "text-neutral-300"} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Controls (Desktop Only) */}
          <div className="hidden md:block pt-4 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
              <ShieldCheck size={13} className="text-white" /> Anti-Cheat Encrypted Roster
            </div>

            <button
              type="button"
              onClick={() => {
                signOut();
                onClose();
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2"
            >
              <LogOut size={13} /> Sign Out Account
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto no-scrollbar relative flex flex-col justify-between">
          
          {/* Top Header Title & Desktop Close Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 md:pb-4 md:mb-5">
            <div>
              <h2 className="font-display text-lg md:text-xl font-bold uppercase text-white flex items-center gap-2">
                {tab === "identity" && "Profile & Credentials"}
                {tab === "awards" && "Awards & Badges"}
                {tab === "tournaments" && "Tournaments Played"}
                {tab === "wallet" && "Prize Wallet & Earnings"}
                {tab === "coupons" && "Coupons & Vouchers 🎟️"}
              </h2>
              <p className="text-[11px] md:text-xs text-neutral-400 font-mono truncate">{user.email}</p>
            </div>

            {/* Desktop Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="hidden md:block rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {activePerm && (
            <div className="mb-4 rounded-2xl bg-white/15 border border-white/30 p-3.5 text-xs text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-bold shadow-glow animate-pulse">
              <span className="flex items-center gap-2">
                <Unlock size={16} className="text-white" />
                <span>Admin Edit Access Unlocked for <strong>{activePerm.fieldLabel}</strong></span>
              </span>
              <span className="font-mono bg-white text-black px-3 py-1 rounded-xl flex items-center gap-1.5 self-start sm:self-auto text-xs font-black shadow-card">
                <Clock size={14} /> Time Remaining: {timeLeftStr}
              </span>
            </div>
          )}

          {feedbackMsg && (
            <div className="mb-4 rounded-2xl p-3 text-xs font-bold flex items-center gap-2 bg-white/10 border border-white/20 text-white">
              <AlertCircle size={14} className="text-white" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Tab 1: Profile & Credentials */}
          {tab === "identity" && (
            <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-0.5">
              <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                Directly edit your display name below. Sensitive credentials (Email, In-Game Character UID, and Phone) are protected for fair play anti-cheat enforcement and require Admin Permission to edit.
              </p>

              {/* Editable Name Field */}
              <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/10">
                <div>
                  <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase">Gamer Display Name</span>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={editableName}
                      onChange={(e) => setEditableName(e.target.value)}
                      className="mt-1 rounded-xl border border-white/30 bg-white/5 px-3 py-1 text-xs font-bold text-white outline-none w-full sm:w-auto"
                    />
                  ) : (
                    <span className="font-bold text-white text-xs sm:text-sm">{user.fullName}</span>
                  )}
                </div>
                {isEditingName ? (
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="rounded-xl bg-white text-black px-3 py-1.5 text-xs font-black uppercase tracking-wider shadow-glow self-start sm:self-auto hover:bg-neutral-200"
                  >
                    Save Name
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Edit3 size={12} className="text-white" /> Edit Name
                  </button>
                )}
              </div>

              {/* Protected Field: Email */}
              <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/10">
                <div className="flex-1">
                  <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase flex items-center gap-1">
                    {activePerm?.field === "email" ? (
                      <Unlock size={11} className="text-white" />
                    ) : (
                      <Lock size={11} className="text-neutral-400" />
                    )}
                    Email Address {activePerm?.field === "email" ? "(UNLOCKED)" : "(Protected)"}
                  </span>
                  {activePerm?.field === "email" ? (
                    <input
                      type="email"
                      value={unlockedValue}
                      onChange={(e) => setUnlockedValue(e.target.value)}
                      className="mt-1 rounded-xl border border-white/30 bg-white/5 px-3 py-1.5 text-xs font-bold text-white outline-none w-full max-w-xs"
                    />
                  ) : (
                    <span className="font-bold text-white text-xs sm:text-sm break-all">{user.email}</span>
                  )}
                </div>
                {activePerm?.field === "email" ? (
                  <button
                    type="button"
                    onClick={() => handleSaveAndReLock("email")}
                    className="rounded-xl bg-white text-black px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-glow flex items-center gap-1 self-start sm:self-auto hover:bg-neutral-200"
                  >
                    <Lock size={11} /> Save &amp; Re-Lock Details 🔒
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenPermissionRequest("email", "Email Address", user.email)}
                    className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white hover:text-black transition-all flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Lock size={11} /> Request Change 🔒
                  </button>
                )}
              </div>

              {/* Protected Field: In-Game Character UID */}
              <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/10">
                <div className="flex-1">
                  <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase flex items-center gap-1">
                    {activePerm?.field === "inGameId" ? (
                      <Unlock size={11} className="text-white" />
                    ) : (
                      <Lock size={11} className="text-neutral-400" />
                    )}
                    In-Game Character ID {activePerm?.field === "inGameId" ? "(UNLOCKED)" : "(Protected)"}
                  </span>
                  {activePerm?.field === "inGameId" ? (
                    <input
                      type="text"
                      value={unlockedValue}
                      onChange={(e) => setUnlockedValue(e.target.value)}
                      className="mt-1 rounded-xl border border-white/30 bg-white/5 px-3 py-1.5 text-xs font-bold text-white outline-none w-full max-w-xs"
                    />
                  ) : (
                    <span className="font-mono font-bold text-white text-xs sm:text-sm">{user.inGameId}</span>
                  )}
                </div>
                {activePerm?.field === "inGameId" ? (
                  <button
                    type="button"
                    onClick={() => handleSaveAndReLock("inGameId")}
                    className="rounded-xl bg-white text-black px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-glow flex items-center gap-1 self-start sm:self-auto hover:bg-neutral-200"
                  >
                    <Lock size={11} /> Save &amp; Re-Lock Details 🔒
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenPermissionRequest("inGameId", "In-Game Character ID", user.inGameId)}
                    className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white hover:text-black transition-all flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Lock size={11} /> Request Change 🔒
                  </button>
                )}
              </div>

              {/* Protected Field: Phone Number */}
              <div className="glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/10">
                <div className="flex-1">
                  <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase flex items-center gap-1">
                    {activePerm?.field === "phone" ? (
                      <Unlock size={11} className="text-white" />
                    ) : (
                      <Lock size={11} className="text-neutral-400" />
                    )}
                    WhatsApp Phone Number {activePerm?.field === "phone" ? "(UNLOCKED)" : "(Protected)"}
                  </span>
                  {activePerm?.field === "phone" ? (
                    <input
                      type="tel"
                      value={unlockedValue}
                      onChange={(e) => setUnlockedValue(e.target.value)}
                      className="mt-1 rounded-xl border border-white/30 bg-white/5 px-3 py-1.5 text-xs font-bold text-white outline-none w-full max-w-xs"
                    />
                  ) : (
                    <span className="font-mono font-bold text-white text-xs sm:text-sm">{user.phone || "+91 9876543210"}</span>
                  )}
                </div>
                {activePerm?.field === "phone" ? (
                  <button
                    type="button"
                    onClick={() => handleSaveAndReLock("phone")}
                    className="rounded-xl bg-white text-black px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-glow flex items-center gap-1 self-start sm:self-auto hover:bg-neutral-200"
                  >
                    <Lock size={11} /> Save &amp; Re-Lock Details 🔒
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenPermissionRequest("phone", "Phone Number", user.phone || "+91 9876543210")}
                    className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white hover:text-black transition-all flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Lock size={11} /> Request Change 🔒
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Awards & Badges */}
          {tab === "awards" && (
            <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-0.5">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {(userData.awards || []).map((a) => (
                  <div key={a.id} className="glass-card rounded-2xl p-3.5 space-y-1 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl">{a.icon}</span>
                      <span className="rounded-full bg-white/15 border border-white/25 px-2 py-0.5 font-mono text-[9px] font-bold text-white uppercase">
                        {a.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs">{a.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono block">Awarded: {a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Past Tournaments Played */}
          {tab === "tournaments" && (
            <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-0.5">
              {(userData.pastTournaments || []).map((pt) => (
                <div key={pt.id} className="glass-card rounded-2xl p-3.5 flex items-center justify-between border border-white/10 text-xs">
                  <div>
                    <h4 className="font-bold text-white">{pt.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">{pt.game} • {pt.mode} • Date: {pt.date}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-display font-bold text-xs text-white block">{pt.placement}</span>
                    <span className="font-mono text-[10px] text-white font-bold">{pt.prize}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Prize Wallet & Earnings */}
          {tab === "wallet" && (
            <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pr-0.5">
              <div className="glass-card rounded-2xl p-5 border border-white/20 bg-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Total Verified Earnings</span>
                  <h3 className="font-display text-3xl font-bold text-white">{userData.earnings?.totalEarned || "₹0"}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-white font-bold">
                    <CheckCircle2 size={12} className="text-white" /> Payout Method: {userData.earnings?.paidVia || "Razorpay UPI / Bank"}
                  </div>
                </div>
                <CreditCard size={36} className="text-white flex-shrink-0" />
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase mb-2">
                  Transaction &amp; Payout History
                </h4>
                <div className="space-y-2">
                  {(userData.earnings?.transactionHistory || []).map((tx) => (
                    <div key={tx.id} className="glass-card rounded-xl p-3 flex items-center justify-between text-xs border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white">
                          ✓
                        </span>
                        <div>
                          <span className="font-bold text-white block">Cash Prize Payout</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{tx.date}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white text-sm">{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Coupons & Vouchers */}
          {tab === "coupons" && (
            <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-0.5">
              <div className="glass-card rounded-2xl p-4 border border-white/20 bg-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">My Gaming Vouchers</span>
                  <h4 className="font-display text-lg font-bold text-white">Exclusive Player Promo Codes</h4>
                  <p className="text-[11px] text-neutral-400 font-medium">Use these voucher codes during tournament registration checkout for discounts &amp; bonus credits.</p>
                </div>
                <Ticket size={32} className="text-white flex-shrink-0" />
              </div>

              <div className="grid gap-3">
                {getStoredCoupons()
                  .filter(
                    (c) =>
                      c.assignedToUserId === "all" ||
                      (user && (c.assignedToUserId === user.id || c.assignedToUserEmail.toLowerCase() === user.email.toLowerCase()))
                  )
                  .map((c) => {
                    const isCopied = copiedCode === c.voucherCode;
                    return (
                      <div
                        key={c.id}
                        className="glass-card rounded-2xl p-4 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-glass"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold uppercase bg-white/15 border border-white/30 text-white px-2.5 py-0.5 rounded-full">
                              {c.codeName}
                            </span>
                            <span className="text-xs font-bold text-white">{c.rewardValue}</span>
                          </div>
                          <p className="text-xs text-white font-medium">{c.description}</p>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            Valid Until: {new Date(c.expiresAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <div className="font-mono text-sm font-bold text-white bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 tracking-wider">
                            {c.voucherCode}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(c.voucherCode);
                              setCopiedCode(c.voucherCode);
                              setTimeout(() => setCopiedCode(null), 2500);
                            }}
                            className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                              isCopied
                                ? "bg-white text-black shadow-glow"
                                : "bg-white text-black hover:bg-neutral-200 shadow-glow hover:scale-105"
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check size={13} /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={13} /> Copy Code
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {getStoredCoupons().filter(
                  (c) =>
                    c.assignedToUserId === "all" ||
                    (user && (c.assignedToUserId === user.id || c.assignedToUserEmail.toLowerCase() === user.email.toLowerCase()))
                ).length === 0 && (
                  <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                    No active vouchers assigned to your gamer account at this moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Sign Out Button Footer */}
          <div className="md:hidden pt-3 border-t border-white/10 mt-3 flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400">Encrypted Roster</span>
            <button
              type="button"
              onClick={() => {
                signOut();
                onClose();
              }}
              className="text-xs font-bold text-neutral-300 hover:text-white hover:bg-white/10 px-3 py-1 rounded-xl transition-colors flex items-center gap-1"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </main>
      </div>

      {/* Permission Request Sub-Modal Popup */}
      {permissionModalField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 no-scrollbar">
          <div className="w-full max-w-md rounded-3xl glass-card p-5 sm:p-6 shadow-glass-xl space-y-4 text-white border border-white/20 animate-scale-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-white">
                <Lock size={16} className="text-white" /> Request {permissionModalField.label} Change
              </div>
              <button type="button" onClick={() => setPermissionModalField(null)} className="text-neutral-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              To prevent anti-cheat fraud and ensure tournament roster integrity, sensitive profile changes require approval from the Zyrox Arena Admin team.
            </p>

            <form onSubmit={handleSubmitPermissionRequest} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono font-bold text-white mb-1">Current Value</label>
                <input
                  type="text" disabled value={permissionModalField.currentValue}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-neutral-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-white mb-1">New Requested {permissionModalField.label} *</label>
                <input
                  type="text" required placeholder={`Enter new ${permissionModalField.label}`} value={requestedValue}
                  onChange={(e) => setRequestedValue(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-white outline-none focus:border-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-white mb-1">Reason for Request *</label>
                <textarea
                  rows={2} required placeholder="e.g. Updated official game IGN / Phone number change" value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-white outline-none focus:border-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button" onClick={() => setPermissionModalField(null)}
                  className="rounded-2xl px-4 py-2 text-xs font-bold text-neutral-400 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl px-5 py-2 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-neutral-200 shadow-glow flex items-center gap-1.5"
                >
                  <Send size={13} /> Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
