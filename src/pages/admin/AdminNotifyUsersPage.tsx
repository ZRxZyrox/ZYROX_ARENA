import { useState } from "react";
import { useLiveNewsletter, subscribeNewsletter } from "@/lib/newsletterStore";
import { logAdminAction } from "@/lib/auditLogger";
import { Mail, Send, Download, Plus, Check, Search, Bell } from "lucide-react";

export default function AdminNotifyUsersPage() {
  const { subscribers } = useLiveNewsletter();
  const [query, setQuery] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Broadcast Notification Form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(newEmail);
    if (res.success) {
      setNewEmail("");
      logAdminAction("subscriber.add", "newsletter_subscribers", newEmail);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    logAdminAction("notification.broadcast_send", "newsletter_subscribers", `Target: ${targetAudience} | Subject: ${subject}`);
    setSentSuccess(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setSentSuccess(false), 3500);
  };

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  const exportCsv = () => {
    const headers = "ID,Email Address,Subscribed Date,Status\n";
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.subscribed_at}","${s.status}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-6xl text-charcoal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
            <Mail size={24} className="text-neon" /> Notify Users &amp; Email Newsletter Center
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            View all subscribed user emails stored in database and dispatch broadcast email notifications to players.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="rounded-2xl border border-charcoal/10 glass-card px-4 py-2.5 text-xs font-bold text-charcoal hover:border-gold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download size={14} /> Export Email List (CSV)
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Left: Email Broadcast Notification Composer */}
        <form onSubmit={handleSendBroadcast} className="glass-card rounded-3xl p-7 space-y-5 border border-charcoal/10">
          <div className="flex items-center gap-2 font-display text-lg font-bold uppercase text-charcoal border-b border-charcoal/8 pb-3">
            <Send size={18} className="text-neon" /> Compose Broadcast Notification
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5">Target Audience *</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs font-bold text-charcoal outline-none focus:border-neon cursor-pointer"
            >
              <option value="all">All Subscribed Users &amp; Registered Players ({subscribers.length})</option>
              <option value="captains">Team Captains Only</option>
              <option value="bgmi">BGMI Tournament Participants</option>
              <option value="valorant">Valorant Tournament Participants</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5">Email / Notification Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. 🏆 Season 4 Grand Finals Room Credentials Released!"
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal font-bold outline-none focus:border-neon"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1.5">Message Content / Announcement Body *</label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter announcement message details, room times, or payout updates to send to players..."
              className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-3 text-xs text-charcoal font-medium outline-none focus:border-neon"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {sentSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-neon font-mono bg-neon/10 border border-neon/30 px-3.5 py-1.5 rounded-full">
                <Check size={14} /> Broadcast Notification Sent to {subscribers.length} Users!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto shimmer-btn rounded-2xl px-7 py-3 text-xs font-bold text-white shadow-glow flex items-center gap-2"
            >
              <Send size={15} /> Send Broadcast Notification
            </button>
          </div>
        </form>

        {/* Right: Manual Email Add & Subscribed Email List */}
        <div className="space-y-6">
          {/* Add Subscriber */}
          <form onSubmit={handleManualAdd} className="glass-card rounded-3xl p-6 space-y-3 border border-charcoal/10">
            <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-charcoal">
              <Plus size={16} className="text-gold" /> Add Email Subscriber
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="player@zyrox.gg"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1 rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2 text-xs text-charcoal outline-none focus:border-neon font-medium"
              />
              <button
                type="submit"
                className="shimmer-btn rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-glow"
              >
                Add Email
              </button>
            </div>
          </form>

          {/* Subscribed Email List */}
          <div className="glass-card rounded-3xl p-5 space-y-4 border border-charcoal/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-sm font-bold uppercase text-charcoal">
                <Bell size={16} className="text-neon" /> Subscribed Email List ({subscribers.length})
              </div>

              <div className="relative w-36">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
                <input
                  type="text"
                  placeholder="Filter email..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/10 bg-ivory-warm pl-7 pr-2 py-1 text-[11px] text-charcoal outline-none focus:border-neon"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredSubscribers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl bg-white/60 p-3 text-xs border border-charcoal/5"
                >
                  <div>
                    <span className="font-bold text-charcoal block">{s.email}</span>
                    <span className="text-[10px] text-charcoal-muted font-mono">
                      Subscribed: {new Date(s.subscribed_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="rounded-full bg-neon-mint/10 border border-neon-mint/30 px-2 py-0.5 font-mono text-[10px] font-bold text-neon-mint uppercase">
                    Active
                  </span>
                </div>
              ))}
              {filteredSubscribers.length === 0 && (
                <p className="text-xs text-charcoal-muted py-6 text-center">No subscribed emails found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
