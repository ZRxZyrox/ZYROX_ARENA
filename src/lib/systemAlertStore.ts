import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface SystemAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  source: string;
  timestamp: string;
  status: "active" | "resolved";
}

const LOCAL_STORAGE_KEY = "zyrox_system_alerts_v1";

export const INITIAL_SYSTEM_ALERTS: SystemAlert[] = [
  {
    id: "alert-101",
    severity: "warning",
    title: "Anti-Spam Cooldown Rate Limiter",
    message: "Multiple rapid subscriber notifications detected. 30-minute cooldown triggered automatically.",
    source: "Spam Guard Engine",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: "active",
  },
  {
    id: "alert-102",
    severity: "info",
    title: "Razorpay Payment Gateway Sync",
    message: "256-Bit SSL webhook listener active and receiving slot entry transactions.",
    source: "Razorpay API",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "resolved",
  },
];

export function getStoredSystemAlerts(): SystemAlert[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_SYSTEM_ALERTS;
}

export function saveSystemAlertsToStore(alerts: SystemAlert[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(alerts));
    window.dispatchEvent(new Event("zyrox_system_alerts_updated"));
  } catch {
    // ignore
  }
}

export function addSystemAlert(
  severity: "critical" | "warning" | "info",
  title: string,
  message: string,
  source: string = "System Monitor"
) {
  const alerts = getStoredSystemAlerts();
  const newAlert: SystemAlert = {
    id: "alert-" + Date.now(),
    severity,
    title,
    message,
    source,
    timestamp: new Date().toISOString(),
    status: "active",
  };

  const updated = [newAlert, ...alerts];
  saveSystemAlertsToStore(updated);

  // Sync to Supabase
  (supabase.from("system_alerts") as any)
    .insert(newAlert)
    .then(() => {});
}

export function resolveSystemAlert(id: string) {
  const alerts = getStoredSystemAlerts();
  const updated = alerts.map((a) => (a.id === id ? { ...a, status: "resolved" as const } : a));
  saveSystemAlertsToStore(updated);
}

export function useLiveSystemAlerts() {
  const [alerts, setAlerts] = useState<SystemAlert[]>(getStoredSystemAlerts());

  useEffect(() => {
    const handleUpdate = () => setAlerts(getStoredSystemAlerts());
    window.addEventListener("zyrox_system_alerts_updated", handleUpdate);
    return () => window.removeEventListener("zyrox_system_alerts_updated", handleUpdate);
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === "active");

  return { alerts, activeAlerts, addSystemAlert, resolveSystemAlert };
}
