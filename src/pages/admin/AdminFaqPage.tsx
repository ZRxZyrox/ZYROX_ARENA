import { useState } from "react";
import { useLiveFaqs, FaqItem } from "@/lib/faqStore";
import { HelpCircle, Plus, Edit2, Trash2, Search } from "lucide-react";

export default function AdminFaqPage() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useLiveFaqs();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    category: "Registration" as FaqItem["category"],
    q: "",
    a: "",
  });

  const categories = ["All", "Registration", "Payments", "Match Rules", "Anti-Cheat", "Refunds"];

  const handleOpenEdit = (item: FaqItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData({
      category: item.category,
      q: item.q,
      a: item.a,
    });
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setFormData({
      category: "Registration",
      q: "",
      a: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.q.trim() || !formData.a.trim()) return;

    if (editingItem) {
      updateFaq(editingItem.id, formData);
      setEditingItem(null);
    } else {
      addFaq(formData);
      setIsCreating(false);
    }
  };

  const filtered = faqs.filter((f) => {
    const matchesCat = activeCategory === "All" || f.category === activeCategory;
    const matchesQuery =
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl uppercase tracking-tight text-white font-bold flex items-center gap-2.5">
            <HelpCircle className="text-white" size={24} /> FAQ &amp; Knowledge Base
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage questions, answers, and policy explanations shown on the public /faq page.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="royal-btn royal-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} /> Add FAQ Question
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 glass-card rounded-2xl p-3 border border-white/10">
          <Search size={16} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white text-xs placeholder:text-neutral-500 focus:outline-none flex-1"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-mono font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-white text-black shadow-glass"
                  : "glass-card text-neutral-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingItem) && (
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 border border-white/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <HelpCircle size={16} className="text-white" />
              {isCreating ? "Add New FAQ Entry" : "Edit FAQ Entry"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingItem(null);
              }}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full md:w-64 rounded-xl bg-black border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              >
                <option value="Registration">Registration</option>
                <option value="Payments">Payments</option>
                <option value="Match Rules">Match Rules</option>
                <option value="Anti-Cheat">Anti-Cheat</option>
                <option value="Refunds">Refunds</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Question</label>
              <input
                type="text"
                required
                value={formData.q}
                onChange={(e) => setFormData({ ...formData, q: e.target.value })}
                placeholder="e.g. How are tournament payouts processed?"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Detailed Answer</label>
              <textarea
                required
                rows={3}
                value={formData.a}
                onChange={(e) => setFormData({ ...formData, a: e.target.value })}
                placeholder="Write the clear, full answer for players..."
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="royal-btn royal-btn-primary px-5 py-2 text-xs font-bold"
            >
              {isCreating ? "Publish FAQ Question" : "Update FAQ Question"}
            </button>
          </div>
        </form>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-white/20 transition-all"
          >
            <div className="space-y-1.5 flex-1">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold text-white inline-block">
                {item.category}
              </span>
              <h4 className="font-bold text-sm text-white">{item.q}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.a}</p>
            </div>

            <div className="flex items-center gap-2 self-end md:self-start flex-shrink-0 pt-1">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                title="Edit FAQ"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete FAQ: "${item.q}"?`)) {
                    deleteFaq(item.id);
                  }
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                title="Delete FAQ"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
