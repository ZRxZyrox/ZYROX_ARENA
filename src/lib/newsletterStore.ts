import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { checkAndRecordSpamAttempt, logUserActivity } from "./auditLogger";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  status: "active" | "unsubscribed";
}

const LOCAL_STORAGE_KEY = "zyrox_newsletter_subscribers_v1";

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: "sub-1", email: "arjun.pro@zyrox.gg", subscribed_at: new Date(Date.now() - 86400000 * 5).toISOString(), status: "active" },
  { id: "sub-2", email: "vikram.godlike@gmail.com", subscribed_at: new Date(Date.now() - 86400000 * 3).toISOString(), status: "active" },
  { id: "sub-3", email: "kabir.valorant@outlook.com", subscribed_at: new Date(Date.now() - 86400000 * 1).toISOString(), status: "active" },
];

export function getStoredSubscribers(): NewsletterSubscriber[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_SUBSCRIBERS;
}

export function saveSubscribersToStore(list: NewsletterSubscriber[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("zyrox_subscribers_updated"));
  } catch {
    // ignore
  }
}

export function subscribeNewsletter(emailInput: string): { success: boolean; message: string } {
  const cleanEmail = emailInput.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  // Anti-Spam Check: 3 attempts = 30 Minute Cooldown
  const spamCheck = checkAndRecordSpamAttempt(cleanEmail);
  if (spamCheck.isCooldown) {
    return { success: false, message: spamCheck.message };
  }

  const list = getStoredSubscribers();
  const existing = list.find((s) => s.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: true, message: "You are already subscribed to tournament drops!" };
  }

  const newItem: NewsletterSubscriber = {
    id: "sub-" + Date.now(),
    email: cleanEmail,
    subscribed_at: new Date().toISOString(),
    status: "active",
  };

  const updated = [newItem, ...list];
  saveSubscribersToStore(updated);
  logUserActivity("user_auth", "newsletter.subscribe", "User subscribed to newsletter: " + cleanEmail, cleanEmail);

  // Sync to Supabase
  (supabase.from("newsletter_subscribers") as any)
    .insert({
      id: newItem.id,
      email: newItem.email,
      subscribed_at: newItem.subscribed_at,
      status: newItem.status,
    })
    .then(() => {});

  return { success: true, message: "Successfully subscribed to tournament drops!" };
}

export function useLiveNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(getStoredSubscribers());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        const { data, error } = await (supabase.from("newsletter_subscribers") as any)
          .select("*")
          .order("subscribed_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setSubscribers(data);
          saveSubscribersToStore(data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();

    const handleUpdate = () => {
      setSubscribers(getStoredSubscribers());
    };

    window.addEventListener("zyrox_subscribers_updated", handleUpdate);
    return () => {
      window.removeEventListener("zyrox_subscribers_updated", handleUpdate);
    };
  }, []);

  return { subscribers, loading, setSubscribers };
}
