import { useState } from "react";
import { useLiveCoupons, createAndAssignCoupon, deleteCoupon } from "@/lib/couponStore";
import { useLiveUserManagement } from "@/lib/userManagementStore";
import { logAdminAction } from "@/lib/auditLogger";
import { Ticket, Plus, Trash2, Search, CheckCircle2, Gift } from "lucide-react";

export default function AdminCouponsPage() {
  const { coupons } = useLiveCoupons();
  const { users } = useLiveUserManagement();

  // Form State
  const [codeName, setCodeName] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [rewardValue, setRewardValue] = useState("");
  const [description, setDescription] = useState("");
  const [targetUserId, setTargetUserId] = useState("all");
  const [expiryDays, setExpiryDays] = useState(30);

  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    let targetEmail = "All Registered Gamers";
    if (targetUserId !== "all") {
      const selectedUser = users.find((u) => u.id === targetUserId);
      if (selectedUser) targetEmail = `${selectedUser.fullName} (${selectedUser.email})`;
    }

    const res = createAndAssignCoupon(
      codeName,
      voucherCode,
      rewardValue,
      description,
      targetUserId,
      targetEmail,
      expiryDays
    );

    if (res.success) {
      logAdminAction("coupon.create", "coupons", `${voucherCode.toUpperCase()} - Target: ${targetEmail}`);
      setCodeName("");
      setVoucherCode("");
      setRewardValue("");
      setDescription("");
      setFeedback({ type: "success", text: res.message });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  const handleDelete = (id: string, code: string) => {
    deleteCoupon(id);
    logAdminAction("coupon.delete", "coupons", code);
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      !query ||
      c.codeName.toLowerCase().includes(query.toLowerCase()) ||
      c.voucherCode.toLowerCase().includes(query.toLowerCase()) ||
      c.assignedToUserEmail.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 text-charcoal max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
            <Ticket size={24} className="text-neon" /> Coupons &amp; Voucher Manager
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Issue custom promo codes, slot discount vouchers, and cash credit rewards to specific registered players or all users.
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-neon-mint/15 border border-neon-mint/30 text-neon-mint"
              : "bg-coral/15 border border-coral/30 text-coral"
          }`}
        >
          <CheckCircle2 size={16} />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Form: Issue New Coupon / Voucher */}
      <div className="glass-card rounded-3xl p-6 border border-neon/30 bg-neon/5 space-y-4">
        <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-neon">
          <Gift size={18} /> Issue New Gamer Voucher Code
        </div>

        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-mono font-bold text-charcoal mb-1">Code Name / Title *</label>
            <input
              type="text"
              placeholder="e.g. VIP_FINALS_DISCOUNT"
              value={codeName}
              onChange={(e) => setCodeName(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-white px-3.5 py-2 text-xs font-bold text-charcoal outline-none focus:border-neon"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-charcoal mb-1">Voucher Code (PROMO CODE) *</label>
            <input
              type="text"
              placeholder="e.g. ZYROX50"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-white px-3.5 py-2 text-xs font-mono font-bold text-gold-warm uppercase outline-none focus:border-neon"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-charcoal mb-1">Reward Value / Discount *</label>
            <input
              type="text"
              placeholder="e.g. ₹50 Cash Credit / Free Slot"
              value={rewardValue}
              onChange={(e) => setRewardValue(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-white px-3.5 py-2 text-xs font-bold text-charcoal outline-none focus:border-neon"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-charcoal mb-1">Assign Target Player *</label>
            <select
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-white px-3.5 py-2 text-xs font-bold text-charcoal outline-none focus:border-neon cursor-pointer"
            >
              <option value="all">🌟 All Registered Gamers (Public Voucher)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  👤 {u.fullName} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-charcoal mb-1">Validity Duration</label>
            <select
              value={expiryDays}
              onChange={(e) => setExpiryDays(Number(e.target.value))}
              className="w-full rounded-2xl border border-charcoal/10 bg-white px-3.5 py-2 text-xs font-bold text-charcoal outline-none focus:border-neon cursor-pointer"
            >
              <option value={7}>7 Days Validity</option>
              <option value={30}>30 Days Validity</option>
              <option value={90}>90 Days Validity</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-charcoal mb-1">Voucher Description</label>
            <input
              type="text"
              placeholder="e.g. Bonus tournament credit for Season 5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-white px-3.5 py-2 text-xs text-charcoal outline-none focus:border-neon"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="shimmer-btn rounded-2xl px-6 py-2.5 text-xs font-bold text-white shadow-glow hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              <Plus size={15} /> Issue Voucher Code
            </button>
          </div>
        </form>
      </div>

      {/* Issued Vouchers Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold uppercase text-charcoal flex items-center gap-2">
            <Ticket size={18} className="text-gold" /> Active Issued Vouchers ({filteredCoupons.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search code or gamer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm pl-10 pr-4 py-2 text-xs text-charcoal outline-none focus:border-neon font-medium"
            />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4 shadow-glass-lg overflow-hidden border border-charcoal/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-charcoal/10 text-charcoal-muted font-mono uppercase font-bold">
                  <th className="py-3 px-4">Code Name</th>
                  <th className="py-3 px-4">PROMO CODE</th>
                  <th className="py-3 px-4">Reward Value</th>
                  <th className="py-3 px-4">Assigned To Gamer</th>
                  <th className="py-3 px-4">Expires On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-charcoal-muted font-medium">
                      No issued voucher codes found.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((c) => (
                    <tr key={c.id} className="border-b border-charcoal/5 hover:bg-white/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-charcoal">{c.codeName}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gold-warm text-sm">{c.voucherCode}</td>
                      <td className="py-3.5 px-4 font-bold text-neon">{c.rewardValue}</td>
                      <td className="py-3.5 px-4 text-charcoal-muted font-medium">{c.assignedToUserEmail}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                        {new Date(c.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.voucherCode)}
                          className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-1 text-[11px] font-bold text-coral hover:bg-coral hover:text-white transition-all flex items-center gap-1 ml-auto"
                        >
                          <Trash2 size={12} /> Revoke Code
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
