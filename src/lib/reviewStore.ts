import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface ReviewRecord {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  published: boolean;
  created_at?: string;
}

const LOCAL_STORAGE_KEY = "zyrox_testimonials_store_v1";

export const DEFAULT_TESTIMONIALS: ReviewRecord[] = [
  {
    id: "1",
    name: "Arjun S.",
    role: "BGMI Squad Captain",
    quote: "ZYROX ARENA's anti-cheat system is the real deal. First tournament platform where I feel every match is fair.",
    rating: 5,
    published: true,
  },
  {
    id: "2",
    name: "Priya M.",
    role: "Free Fire Solo",
    quote: "Won ₹50,000 in the Clash Cup. Prize money hit my bank account within 12 hours. Unreal experience!",
    rating: 5,
    published: true,
  },
  {
    id: "3",
    name: "Rohan V.",
    role: "Valorant IGL",
    quote: "Lobby credentials arrive on time via WhatsApp. The support team responds within minutes during matches.",
    rating: 5,
    published: true,
  },
  {
    id: "4",
    name: "Vikram R.",
    role: "FC Tournament Winner",
    quote: "Super smooth bracket system and clean UI. Everything from registration to cash payout is completely transparent.",
    rating: 5,
    published: true,
  },
];

export function getStoredReviews(): ReviewRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_TESTIMONIALS;
}

export function saveReviewsToStore(reviews: ReviewRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new Event("zyrox_reviews_updated"));
  } catch {
    // ignore
  }
}

export function useLiveReviews() {
  const [reviews, setReviews] = useState<ReviewRecord[]>(getStoredReviews());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await (supabase.from("testimonials") as any)
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const formatted: ReviewRecord[] = data.map((t: any) => ({
            id: t.id,
            name: t.name ?? "Esports Gamer",
            role: t.role ?? "Verified Participant",
            quote: t.quote ?? "",
            rating: t.rating ?? 5,
            published: t.published ?? true,
            created_at: t.created_at,
          }));

          setReviews(formatted);
          saveReviewsToStore(formatted);
        }
      } catch {
        // Fallback to cached store
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setReviews(getStoredReviews());
    };

    window.addEventListener("zyrox_reviews_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_reviews_updated", handleUpdate);
    };
  }, []);

  const publishedReviews = reviews.filter((r) => r.published);

  const addReview = (review: Omit<ReviewRecord, "id">) => {
    const newRecord: ReviewRecord = {
      ...review,
      id: "rev_" + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [newRecord, ...reviews];
    setReviews(updated);
    saveReviewsToStore(updated);
    // Async push to Supabase
    (supabase.from("testimonials") as any).insert(newRecord).then(() => {});
  };

  const updateReview = (id: string, updatedFields: Partial<ReviewRecord>) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, ...updatedFields } : r));
    setReviews(updated);
    saveReviewsToStore(updated);
    (supabase.from("testimonials") as any).update(updatedFields).eq("id", id).then(() => {});
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    saveReviewsToStore(updated);
    (supabase.from("testimonials") as any).delete().eq("id", id).then(() => {});
  };

  return { reviews, publishedReviews, loading, addReview, updateReview, deleteReview };
}
