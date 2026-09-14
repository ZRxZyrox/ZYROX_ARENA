import { useState } from "react";
import { useLiveGallery, GalleryItem } from "@/lib/galleryStore";
import { Camera, Plus, Edit2, Trash2, Search, Image as ImageIcon } from "lucide-react";

export default function AdminGalleryPage() {
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useLiveGallery();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Grand Finals",
    game: "Esports",
    imageBg: "from-white/15 to-white/5",
    imageUrl: "",
  });

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setFormData({
      title: item.title,
      category: item.category,
      game: item.game,
      imageBg: item.imageBg,
      imageUrl: item.imageUrl || "",
    });
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setFormData({
      title: "",
      category: "Grand Finals",
      game: "Esports",
      imageBg: "from-white/15 to-white/5",
      imageUrl: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingItem) {
      updateGalleryItem(editingItem.id, formData);
      setEditingItem(null);
    } else {
      addGalleryItem(formData);
      setIsCreating(false);
    }
  };

  const filtered = galleryItems.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl uppercase tracking-tight text-white font-bold flex items-center gap-2.5">
            <Camera className="text-white" size={24} /> Event Gallery &amp; Highlights
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage photo cards, championship moments, and match highlights visible on the public /gallery page.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="royal-btn royal-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} /> Add Gallery Card
        </button>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center gap-3 glass-card rounded-2xl p-3 border border-white/10">
        <Search size={16} className="text-neutral-400" />
        <input
          type="text"
          placeholder="Search gallery highlights by title, category, or game..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-white text-xs placeholder:text-neutral-500 focus:outline-none flex-1"
        />
      </div>

      {/* Form modal */}
      {(isCreating || editingItem) && (
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 border border-white/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ImageIcon size={16} className="text-white" />
              {isCreating ? "Create New Gallery Highlight" : `Edit Highlight`}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Highlight Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Valorant Winter Finals Stage Unveiling"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Game / Title</label>
              <input
                type="text"
                required
                value={formData.game}
                onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                placeholder="e.g. BGMI, Valorant, Free Fire"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Category Tag</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Grand Finals, Trophy Moment, Event Vibe"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-neutral-400 font-mono text-[10px] uppercase mb-1">Optional External Image URL</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://... (optional image link)"
                className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white focus:border-white/30 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="royal-btn royal-btn-primary px-5 py-2 text-xs font-bold"
            >
              {isCreating ? "Publish to Gallery" : "Update Highlight"}
            </button>
          </div>
        </form>
      )}

      {/* Grid of gallery items */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-3 hover:border-white/20 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold text-white">
                  {item.category}
                </span>
                <span className="font-mono text-[10px] text-neutral-400">{item.game}</span>
              </div>
              <h4 className="font-bold text-sm text-white">{item.title}</h4>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                title="Edit highlight"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete gallery item "${item.title}"?`)) {
                    deleteGalleryItem(item.id);
                  }
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                title="Delete highlight"
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
