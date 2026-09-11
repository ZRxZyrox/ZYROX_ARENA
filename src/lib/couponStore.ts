import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface CouponRecord {
  id: string;
  codeName: string;
  voucherCode: string;
  rewardValue: string;
  description: string;
  assignedToUserId: string; // "all" or specific userId
  assignedToUserEmail: string; // "All Players" or specific email
  expiresAt: string;
  status: "active" | "redeemed" | "expired";
  createdAt: string;
}

const STORAGE_KEY = "zyrox_coupons_vouchers_v1";

export const INITIAL_COUPONS: CouponRecord[] = [
  {
    id: "coup-101",
    codeName: "WELCOME_GAMER_100",
    voucherCode: "ZYROX100",
    rewardValue: "₹100 Tournament Discount",
    description: "Welcome voucher for new registered tournament players on Zyrox Arena",
    assignedToUserId: "all",
    assignedToUserEmail: "All Registered Gamers",
    expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "coup-102",
    codeName: "VIP_FINALS_PASS",
    voucherCode: "VIPBONUS50",
    rewardValue: "₹50 Slot Cash Credit",
    description: "Exclusive reward code issued by HQ Admin for top BGMI Showdown finalists",
    assignedToUserId: "user-101",
    assignedToUserEmail: "arjun.captain@zyrox.gg",
    expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export function getStoredCoupons(): CouponRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_COUPONS;
}

export function saveCouponsToStore(coupons: CouponRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new Event("zyrox_coupons_updated"));
  } catch {
    // ignore
  }
}

export function createAndAssignCoupon(
  codeName: string,
  voucherCode: string,
  rewardValue: string,
  description: string,
  assignedToUserId: string,
  assignedToUserEmail: string,
  expiryDays: number = 30
): { success: boolean; message: string } {
  if (!codeName.trim() || !voucherCode.trim() || !rewardValue.trim()) {
    return { success: false, message: "Code Name, Voucher Code, and Reward Value are required." };
  }

  const coupons = getStoredCoupons();
  const cleanCode = voucherCode.trim().toUpperCase();

  const newCoupon: CouponRecord = {
    id: "coup-" + Date.now(),
    codeName: codeName.trim().toUpperCase(),
    voucherCode: cleanCode,
    rewardValue: rewardValue.trim(),
    description: description.trim() || "Official Zyrox Arena voucher code",
    assignedToUserId,
    assignedToUserEmail,
    expiresAt: new Date(Date.now() + expiryDays * 86400000).toISOString(),
    status: "active",
    createdAt: new Date().toISOString(),
  };

  const updated = [newCoupon, ...coupons];
  saveCouponsToStore(updated);

  // Sync to Supabase
  (supabase.from("coupons") as any)
    .insert(newCoupon)
    .then(() => {});

  return {
    success: true,
    message: `Voucher Code '${cleanCode}' successfully issued and assigned to ${assignedToUserEmail}!`,
  };
}

export function deleteCoupon(id: string) {
  const coupons = getStoredCoupons();
  const updated = coupons.filter((c) => c.id !== id);
  saveCouponsToStore(updated);
}

export function useLiveCoupons() {
  const [coupons, setCoupons] = useState<CouponRecord[]>(getStoredCoupons());

  useEffect(() => {
    const handleUpdate = () => setCoupons(getStoredCoupons());
    window.addEventListener("zyrox_coupons_updated", handleUpdate);
    return () => window.removeEventListener("zyrox_coupons_updated", handleUpdate);
  }, []);

  return { coupons };
}
