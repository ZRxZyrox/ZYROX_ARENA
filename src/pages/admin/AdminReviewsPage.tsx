import { useState } from "react";
import { useLiveReviews, type ReviewRecord } from "@/lib/reviewStore";
import { logAdminAction } from "@/lib/auditLogger";
import { MessageSquare, Plus, Trash2, Edit3, Star, Check, X, ShieldCheck } from "lucide-react";

export default function AdminReviewsPage() {
  const { reviews, addReview, updateReview, deleteReview } = useLiveReviews();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [published, setPublished] = useState(true);

  const openNewModal = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setQuote("");
    setRating(5);
    setPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (r: ReviewRecord) => {
    setEditingId(r.id);
    setName(r.name);
    setRole(r.role);
    setQuote(r.quote);
    setRating(r.rating);
    setPublished(r.published);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote) return;

    if (editingId) {
      updateReview(editingId, { name, role, quote, rating, published });
      logAdminAction("review.update", "testimonials", editingId);
    } else {
      addReview({ name, role: role || "Verified Gamer", quote, rating, published });
      logAdminAction("review.create", "testimonials", name);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-charcoal flex items-center gap-2">
            <MessageSquare size={22} className="text-neon" /> Website Reviews &amp; Testimonials
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Manage player testimonials displayed live on the homepage website footer section.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewModal}
          className="shimmer-btn rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-glow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={15} /> Add New Review
        </button>
      </div>

      {/* Reviews Table / Grid */}
      {reviews.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-3">
          <MessageSquare size={36} className="text-charcoal-muted mx-auto" />
          <p className="font-bold text-charcoal">No website reviews found.</p>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Click "+ Add New Review" above to publish player feedback on the website.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="glass-card rounded-3xl p-6 space-y-4 relative flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon/20 to-gold/20 text-neon font-bold text-sm font-display">
                      {r.name[0]}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-charcoal">{r.name}</h3>
                      <p className="text-[11px] text-charcoal-muted">{r.role}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      r.published ? "bg-neon-mint/10 border-neon-mint/30 text-neon-mint" : "bg-coral/10 border-coral/30 text-coral"
                    }`}
                  >
                    {r.published ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="text-xs text-charcoal italic leading-relaxed pt-2">"{r.quote}"</p>
              </div>

              <div className="pt-3 border-t border-charcoal/8 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating || 5 }).map((_, s) => (
                    <Star key={s} size={12} className="text-gold fill-gold" />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(r)}
                    className="p-1.5 rounded-xl border border-charcoal/10 bg-ivory-warm hover:bg-white text-charcoal transition-all"
                    title="Edit Review"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete review by "${r.name}"?`)) {
                        deleteReview(r.id);
                        logAdminAction("review.delete", "testimonials", r.id);
                      }
                    }}
                    className="p-1.5 rounded-xl border border-coral/20 bg-coral/10 hover:bg-coral text-coral hover:text-white transition-all"
                    title="Delete Review"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl glass-card p-7 shadow-glass-xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <h2 className="font-display text-lg font-bold uppercase text-charcoal flex items-center gap-2">
                <ShieldCheck size={18} className="text-neon" /> {editingId ? "Edit Website Review" : "Add Website Review"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-charcoal-muted hover:text-charcoal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Gamer Name *</label>
                <input
                  type="text" required placeholder="e.g. Arjun S." value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Role / Badge Title</label>
                <input
                  type="text" placeholder="e.g. BGMI Squad Captain" value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Review Quote *</label>
                <textarea
                  required rows={3} placeholder="Enter player testimonial text..." value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-charcoal-muted mb-1">Website Visibility</label>
                  <select
                    value={published ? "true" : "false"}
                    onChange={(e) => setPublished(e.target.value === "true")}
                    className="w-full rounded-2xl border border-charcoal/10 bg-ivory-warm px-4 py-2.5 text-xs text-charcoal outline-none focus:border-neon font-bold"
                  >
                    <option value="true">Published Live</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-charcoal/10">
                <button
                  type="button" onClick={() => setModalOpen(false)}
                  className="rounded-2xl px-5 py-2.5 text-xs font-bold text-charcoal-muted hover:bg-charcoal/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="shimmer-btn rounded-2xl px-6 py-2.5 text-xs font-bold text-white shadow-glow flex items-center gap-1.5"
                >
                  <Check size={14} /> {editingId ? "Save Changes" : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
