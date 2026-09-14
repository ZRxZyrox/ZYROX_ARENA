import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { addSystemAlert } from "./systemAlertStore";

export interface AuditLogItem {
  id: string;
  action: string;
  category: "admin_action" | "page_navigation" | "user_auth" | "tournament_registration" | "spam_guard";
  target_table: string | null;
  target_id: string | null;
  ip_address: string | null;
  created_at: string;
  user_email?: string;
  details?: string;
}

const LOCAL_STORAGE_KEY = "zyrox_audit_logs_v3";
const SPAM_TRACKER_KEY = "zyrox_anti_spam_tracker_v1";

export const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-101",
    action: "admin.login_success",
    category: "admin_action",
    target_table: "admin_users",
    target_id: "admin-master",
    ip_address: "103.21.124.81 (Verified Admin)",
    created_at: new Date(Date.now() - 300000).toISOString(),
    user_email: "admin@zyroxarena.com",
    details: "Admin logged into Control Panel Dashboard",
  },
  {
    id: "log-102",
    action: "page.navigate",
    category: "page_navigation",
    target_table: "navigation",
    target_id: "/tournaments/bgmi-showdown-season-4",
    ip_address: "103.21.124.81",
    created_at: new Date(Date.now() - 600000).toISOString(),
    user_email: "arjun.captain@zyrox.gg",
    details: "User navigated from Home Page to BGMI Showdown Tournament Detail Page",
  },
  {
    id: "log-103",
    action: "slot.checkout_initialize",
    category: "tournament_registration",
    target_table: "registrations",
    target_id: "winter-circuit-finals",
    ip_address: "103.21.124.81",
    created_at: new Date(Date.now() - 1200000).toISOString(),
    user_email: "arjun.captain@zyrox.gg",
    details: "Initialized slot entry checkout for ₹250",
  },
  {
    id: "log-104",
    action: "spam_guard.cooldown_triggered",
    category: "spam_guard",
    target_table: "anti_spam",
    target_id: "notify_newsletter",
    ip_address: "103.21.124.81",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    user_email: "guest@zyrox.gg",
    details: "30-minute anti-spam cooldown activated after 3 rapid submission clicks",
  },
];

export function getStoredAuditLogs(): AuditLogItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_AUDIT_LOGS;
}

export function saveAuditLogsToStore(logs: AuditLogItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new Event("zyrox_audit_logs_updated"));
  } catch {
    // ignore
  }
}

// Log Admin Actions
export function logAdminAction(action: string, target_table?: string, target_id?: string, details?: string) {
  const item: AuditLogItem = {
    id: "log-" + Date.now(),
    action,
    category: "admin_action",
    target_table: target_table ?? null,
    target_id: target_id ?? null,
    ip_address: "103.21.124.81 (Live Admin)",
    created_at: new Date().toISOString(),
    user_email: "admin@zyroxarena.com",
    details: details || `Admin action performed on ${target_table || "system"}`,
  };

  const current = getStoredAuditLogs();
  const updated = [item, ...current];
  saveAuditLogsToStore(updated);

  // Sync to Supabase
  (supabase.from("audit_logs") as any)
    .insert(item)
    .then(() => {});
}

// 100% Comprehensive User Activity Tracker (Navigation, Auth, Registration, Payments)
export function logUserActivity(
  category: "page_navigation" | "user_auth" | "tournament_registration" | "spam_guard",
  action: string,
  details: string,
  userEmail?: string
) {
  const item: AuditLogItem = {
    id: "log-" + Date.now(),
    action,
    category,
    target_table: category,
    target_id: action,
    ip_address: "103.21.124.81",
    created_at: new Date().toISOString(),
    user_email: userEmail || "Guest User",
    details,
  };

  const current = getStoredAuditLogs();
  const updated = [item, ...current];
  saveAuditLogsToStore(updated);

  // Sync to Supabase
  (supabase.from("audit_logs") as any)
    .insert(item)
    .then(() => {});
}

// Anti-Spam Rate Limiter: 3 Attempts = 30-Minute Cooldown
export function checkAndRecordSpamAttempt(key: string): { isCooldown: boolean; remainingMinutes: number; message: string } {
  try {
    const raw = localStorage.getItem(SPAM_TRACKER_KEY);
    const tracker: Record<string, { attempts: number[]; cooldownUntil?: number }> = raw ? JSON.parse(raw) : {};
    const now = Date.now();
    const entry = tracker[key] || { attempts: [] };

    // Check if user is currently under active 30-minute cooldown
    if (entry.cooldownUntil && now < entry.cooldownUntil) {
      const remMins = Math.ceil((entry.cooldownUntil - now) / 60000);
      return {
        isCooldown: true,
        remainingMinutes: remMins,
        message: `ANTI-SPAM SECURITY ALERT: Too many attempts detected. Please wait ${remMins} minutes before trying again.`,
      };
    }

    // Filter attempts within the last 5 minutes
    const recentAttempts = entry.attempts.filter((ts) => now - ts < 300000);
    recentAttempts.push(now);
    entry.attempts = recentAttempts;

    if (recentAttempts.length >= 3) {
      const cooldownUntil = now + 30 * 60 * 1000; // 30 Minutes
      entry.cooldownUntil = cooldownUntil;
      tracker[key] = entry;
      localStorage.setItem(SPAM_TRACKER_KEY, JSON.stringify(tracker));

      // Trigger System Breakdown Alert & Audit Log
      addSystemAlert(
        "warning",
        "Anti-Spam 30-Minute Cooldown Triggered",
        `User (${key}) exceeded 3 rapid submission attempts. System enforced 30-minute lockdown.`,
        "Anti-Spam Engine"
      );

      logUserActivity(
        "spam_guard",
        "spam.cooldown_30min",
        `30-minute cooldown enforced for ${key} after 3 rapid submission clicks.`,
        key
      );

      return {
        isCooldown: true,
        remainingMinutes: 30,
        message: "ANTI-SPAM SECURITY ALERT: You have made 3 rapid attempts. A 30-minute cooldown has been applied.",
      };
    }

    tracker[key] = entry;
    localStorage.setItem(SPAM_TRACKER_KEY, JSON.stringify(tracker));
  } catch {
    // fallback
  }

  return { isCooldown: false, remainingMinutes: 0, message: "" };
}

export function useLiveAuditLogs() {
  const [logs, setLogs] = useState<AuditLogItem[]>(getStoredAuditLogs());
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase.from("audit_logs") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setLogs(data);
        saveAuditLogsToStore(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const handleUpdate = () => setLogs(getStoredAuditLogs());
    window.addEventListener("zyrox_audit_logs_updated", handleUpdate);
    return () => window.removeEventListener("zyrox_audit_logs_updated", handleUpdate);
  }, []);

  return { logs, loading, refreshLogs: fetchLogs };
}
