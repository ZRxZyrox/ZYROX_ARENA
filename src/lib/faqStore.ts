import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { logAdminAction } from "./auditLogger";

export interface FaqItem {
  id: string;
  category: "Registration" | "Payments" | "Match Rules" | "Anti-Cheat" | "Refunds";
  q: string;
  a: string;
}

const LOCAL_STORAGE_KEY = "zyrox_faqs_v1";

export const INITIAL_FAQS: FaqItem[] = [
  { id: "faq-1", category: "Registration", q: "How do I register a squad for a tournament?", a: "Navigate to any active tournament on the website, select Squad format, enter your Team Captain details, add your teammates' full names and exact in-game IDs (IGNs), accept the match rules, and complete payment via UPI or Card." },
  { id: "faq-2", category: "Payments", q: "How are tournament entry fees and payouts processed?", a: "Entry fees are securely processed using a PCI-DSS 256-bit encrypted gateway. Prize money payouts are transferred directly to the Team Captain's bank account or UPI ID within 24 hours of tournament finals." },
  { id: "faq-3", category: "Match Rules", q: "Where do I receive the Room ID and Password?", a: "Room ID and Password are sent to your registered Team Captain's WhatsApp phone number and email address 15 minutes before the match start time." },
  { id: "faq-4", category: "Anti-Cheat", q: "What anti-cheat measures are enforced during matches?", a: "We enforce strict zero-tolerance policies. Emulators are strictly banned in mobile tournaments. Screen recording and device check-ins may be requested by tournament admins at any time." },
  { id: "faq-5", category: "Refunds", q: "Can I cancel or refund my registration?", a: "As outlined in our 100% Non-Refundable Policy, entry fees are non-refundable once paid to lock in tournament bracket slots. Refunds are issued only if Zyrox Arena cancels an event." },
  { id: "faq-6", category: "Registration", q: "Can I swap a teammate after registering?", a: "Teammate substitutions are allowed up to 1 hour before match start time by contacting our support team with your Order ID and new IGN details." },
  { id: "faq-7", category: "Match Rules", q: "What happens if a player disconnects mid-game?", a: "Match disconnects due to personal internet issues will not cause a match restart. If over 50% of players experience a server outage, the match will be re-scheduled by the admin." },
  { id: "faq-8", category: "Payments", q: "Is online payment 100% safe and instant?", a: "Yes, every payment is verified server-side via HMAC-SHA256 signed webhooks directly with Cloudflare Workers — never trusted client-side." },
];

export function getStoredFaqs(): FaqItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_FAQS;
}

export function saveFaqsToStore(items: FaqItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("zyrox_faqs_updated"));
  } catch {
    // ignore
  }
}

export function useLiveFaqs() {
  const [faqs, setFaqs] = useState<FaqItem[]>(getStoredFaqs());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await (supabase.from("faq_items") as any)
          .select("*")
          .order("id", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: FaqItem[] = data.map((d: any) => ({
            id: d.id,
            category: d.category,
            q: d.question || d.q,
            a: d.answer || d.a,
          }));
          setFaqs(mapped);
          saveFaqsToStore(mapped);
        }
      } catch {
        // Fallback to localStorage
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setFaqs(getStoredFaqs());
    };

    window.addEventListener("zyrox_faqs_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_faqs_updated", handleUpdate);
    };
  }, []);

  const addFaq = async (item: Omit<FaqItem, "id">) => {
    const newItem: FaqItem = {
      ...item,
      id: `faq-${Date.now()}`,
    };
    const updated = [newItem, ...faqs];
    setFaqs(updated);
    saveFaqsToStore(updated);
    logAdminAction("create", "faq_items", newItem.id, `Added FAQ question: "${newItem.q}"`);

    try {
      await (supabase.from("faq_items") as any).insert({
        id: newItem.id,
        category: newItem.category,
        question: newItem.q,
        answer: newItem.a,
      });
    } catch {
      // Offline fallback
    }
  };

  const updateFaq = async (id: string, updates: Partial<FaqItem>) => {
    const updated = faqs.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setFaqs(updated);
    saveFaqsToStore(updated);
    logAdminAction("update", "faq_items", id, `Updated FAQ question ${id}`);

    try {
      await (supabase.from("faq_items") as any)
        .update({
          category: updates.category,
          question: updates.q,
          answer: updates.a,
        })
        .eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const deleteFaq = async (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    saveFaqsToStore(updated);
    logAdminAction("delete", "faq_items", id, `Deleted FAQ ${id}`);

    try {
      await (supabase.from("faq_items") as any).delete().eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  return { faqs, loading, addFaq, updateFaq, deleteFaq };
}
