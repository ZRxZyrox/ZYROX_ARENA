import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { logAdminAction } from "./auditLogger";

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  game: string;
  imageBg: string;
  imageUrl?: string;
}

const LOCAL_STORAGE_KEY = "zyrox_gallery_items_v1";

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: "gal-1", title: "Valorant Winter Finals Stage", category: "Grand Finals", game: "Valorant", imageBg: "from-white/15 to-white/5" },
  { id: "gal-2", title: "BGMI Showdown Champion Ceremony", category: "Trophy Moment", game: "BGMI", imageBg: "from-white/10 to-white/5" },
  { id: "gal-3", title: "Free Fire Clash Cup Action", category: "Match Highlights", game: "Free Fire", imageBg: "from-white/15 to-white/5" },
  { id: "gal-4", title: "FC Pro League 1v1 Clutch", category: "Key Plays", game: "FC", imageBg: "from-white/10 to-white/5" },
  { id: "gal-5", title: "Lan Arena Setup & Player Lounge", category: "Event Vibe", game: "Esports", imageBg: "from-white/15 to-white/5" },
  { id: "gal-6", title: "Grand Finals Trophy Unveiling", category: "Behind The Scenes", game: "Esports", imageBg: "from-white/10 to-white/5" },
];

export function getStoredGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_GALLERY;
}

export function saveGalleryToStore(items: GalleryItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("zyrox_gallery_updated"));
  } catch {
    // ignore
  }
}

export function useLiveGallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(getStoredGallery());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await (supabase.from("gallery_items") as any)
          .select("*")
          .order("id", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: GalleryItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            category: d.category,
            game: d.game,
            imageBg: d.image_bg || d.imageBg || "from-white/15 to-white/5",
            imageUrl: d.image_url || d.imageUrl,
          }));
          setGalleryItems(mapped);
          saveGalleryToStore(mapped);
        }
      } catch {
        // Fallback to localStorage
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setGalleryItems(getStoredGallery());
    };

    window.addEventListener("zyrox_gallery_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_gallery_updated", handleUpdate);
    };
  }, []);

  const addGalleryItem = async (item: Omit<GalleryItem, "id">) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    const updated = [newItem, ...galleryItems];
    setGalleryItems(updated);
    saveGalleryToStore(updated);
    logAdminAction("create", "gallery_items", newItem.id, `Added gallery item ${newItem.title}`);

    try {
      await (supabase.from("gallery_items") as any).insert({
        id: newItem.id,
        title: newItem.title,
        category: newItem.category,
        game: newItem.game,
        image_bg: newItem.imageBg,
        image_url: newItem.imageUrl,
      });
    } catch {
      // Offline fallback
    }
  };

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    const updated = galleryItems.map((g) => (g.id === id ? { ...g, ...updates } : g));
    setGalleryItems(updated);
    saveGalleryToStore(updated);
    logAdminAction("update", "gallery_items", id, `Updated gallery item ${id}`);

    try {
      await (supabase.from("gallery_items") as any)
        .update({
          title: updates.title,
          category: updates.category,
          game: updates.game,
          image_bg: updates.imageBg,
          image_url: updates.imageUrl,
        })
        .eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = galleryItems.filter((g) => g.id !== id);
    setGalleryItems(updated);
    saveGalleryToStore(updated);
    logAdminAction("delete", "gallery_items", id, `Deleted gallery item ${id}`);

    try {
      await (supabase.from("gallery_items") as any).delete().eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  return { galleryItems, loading, addGalleryItem, updateGalleryItem, deleteGalleryItem };
}
