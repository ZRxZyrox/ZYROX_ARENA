import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface EditPermissionWindow {
  granted: boolean;
  field: "email" | "inGameId" | "phone" | "all";
  fieldLabel: string;
  grantedAt: string;
  expiresAt: string;
  durationMinutes: number;
  isUsed: boolean;
}

export interface UserRecord {
  id: string;
  email: string;
  fullName: string;
  inGameId: string;
  phone: string;
  registeredAt: string;
  status: "active" | "banned";
  ipAddress?: string;
  banReason?: string;
  bannedAt?: string;
  // Temporary Admin-Granted Editing Permission Window
  editPermission?: EditPermissionWindow;
  // Sectioned User Profile Data
  awards?: { id: string; title: string; badge: string; icon: string; date: string }[];
  pastTournaments?: { id: string; title: string; game: string; mode: string; placement: string; prize: string; date: string }[];
  earnings?: { totalEarned: string; paidVia: string; verifiedKyc: boolean; transactionHistory: { id: string; amount: string; date: string; status: string }[] };
}

export interface UserChangeRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  field: "email" | "inGameId" | "phone";
  fieldLabel: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  adminNote?: string;
}

export interface BannedIpRecord {
  ip: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
}

const USERS_STORAGE_KEY = "zyrox_registered_users_list_v1";
const CHANGE_REQUESTS_STORAGE_KEY = "zyrox_user_change_requests_v1";
const BANNED_IPS_STORAGE_KEY = "zyrox_banned_ips_list_v1";

export const INITIAL_USERS: UserRecord[] = [
  {
    id: "user-101",
    email: "arjun.captain@zyrox.gg",
    fullName: "Arjun Sharma",
    inGameId: "5182940291 (Viper)",
    phone: "+91 9876543210",
    registeredAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    status: "active",
    ipAddress: "103.21.124.81",
    awards: [
      { id: "a1", title: "BGMI Season 4 Champion", badge: "🏆 GRAND CHAMPION", icon: "🏆", date: "2026-06-15" },
      { id: "a2", title: "Verified Anti-Cheat Check-in", badge: "🛡️ FAIR PLAY CERTIFIED", icon: "🛡️", date: "2026-05-10" },
      { id: "a3", title: "MVP Tournament Player", badge: "⚡ MVP PLAYER", icon: "⚡", date: "2026-07-01" },
    ],
    pastTournaments: [
      { id: "pt-1", title: "BGMI Showdown Season 4", game: "BGMI", mode: "Squad TPP", placement: "#1 Grand Winner", prize: "₹4,20,000", date: "2026-07-10" },
      { id: "pt-2", title: "Valorant Winter Circuit", game: "Valorant", mode: "5v5 Squad", placement: "#3 Semifinals", prize: "₹50,000", date: "2026-06-22" },
    ],
    earnings: {
      totalEarned: "₹4,70,000",
      paidVia: "UPI (Verified Bank)",
      verifiedKyc: true,
      transactionHistory: [
        { id: "tx-101", amount: "₹4,20,000", date: "2026-07-11", status: "Paid" },
        { id: "tx-102", amount: "₹50,000", date: "2026-06-23", status: "Paid" },
      ],
    },
  },
  {
    id: "user-102",
    email: "vikram.godlike@gmail.com",
    fullName: "Vikramaditya Singh",
    inGameId: "5910283410 (Demon)",
    phone: "+91 9812345678",
    registeredAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    status: "active",
    ipAddress: "49.36.112.44",
    awards: [
      { id: "a4", title: "Free Fire Clash Runner-up", badge: "🔥 PRO FINALIST", icon: "🔥", date: "2026-06-20" },
    ],
    pastTournaments: [
      { id: "pt-3", title: "Free Fire Clash Cup 2026", game: "Free Fire", mode: "Squad Clash", placement: "#2 Finalist", prize: "₹1,50,000", date: "2026-06-20" },
    ],
    earnings: {
      totalEarned: "₹1,50,000",
      paidVia: "Instant Netbanking",
      verifiedKyc: true,
      transactionHistory: [
        { id: "tx-103", amount: "₹1,50,000", date: "2026-06-21", status: "Paid" },
      ],
    },
  },
];

export const INITIAL_CHANGE_REQUESTS: UserChangeRequest[] = [
  {
    id: "req-1",
    userId: "user-101",
    userEmail: "arjun.captain@zyrox.gg",
    userName: "Arjun Sharma",
    field: "inGameId",
    fieldLabel: "In-Game Character ID",
    currentValue: "5182940291 (Viper)",
    requestedValue: "5182940291 (ViperPro_Official)",
    reason: "Updated official clan tag for Season 5 finals",
    requestedAt: new Date(Date.now() - 7200000).toISOString(),
    status: "pending",
  },
];

export function getStoredUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_USERS;
}

export function saveUsersToStore(users: UserRecord[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event("zyrox_users_updated"));
  } catch {
    // ignore
  }
}

export function getStoredChangeRequests(): UserChangeRequest[] {
  try {
    const raw = localStorage.getItem(CHANGE_REQUESTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_CHANGE_REQUESTS;
}

export function saveChangeRequestsToStore(requests: UserChangeRequest[]) {
  try {
    localStorage.setItem(CHANGE_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event("zyrox_requests_updated"));
  } catch {
    // ignore
  }
}

export function getStoredBannedIps(): BannedIpRecord[] {
  try {
    const raw = localStorage.getItem(BANNED_IPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [
    { ip: "198.51.100.42", reason: "Emulator hack injection attempt", bannedAt: "2026-07-01T12:00:00Z", bannedBy: "Zyrox Anti-Cheat" },
  ];
}

export function saveBannedIpsToStore(ips: BannedIpRecord[]) {
  try {
    localStorage.setItem(BANNED_IPS_STORAGE_KEY, JSON.stringify(ips));
    window.dispatchEvent(new Event("zyrox_banned_ips_updated"));
  } catch {
    // ignore
  }
}

// Ban / Unban User & IP
export function banUserAndIp(userId: string, reason: string) {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  user.status = "banned";
  user.banReason = reason || "Permanent Ban by Anti-Cheat Admin";
  user.bannedAt = new Date().toISOString();

  saveUsersToStore([...users]);

  if (user.ipAddress) {
    const bannedIps = getStoredBannedIps();
    if (!bannedIps.some((b) => b.ip === user.ipAddress)) {
      bannedIps.push({
        ip: user.ipAddress,
        reason: reason || "Associated with Banned Account: " + user.email,
        bannedAt: new Date().toISOString(),
        bannedBy: "Zyrox Admin",
      });
      saveBannedIpsToStore(bannedIps);
    }
  }

  // Push to Supabase
  (supabase.from("user_bans") as any)
    .insert({
      user_id: userId,
      user_email: user.email,
      ip_address: user.ipAddress,
      reason: user.banReason,
      banned_at: user.bannedAt,
    })
    .then(() => {});
}

export function revokeBanUser(userId: string) {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  user.status = "active";
  delete user.banReason;
  delete user.bannedAt;

  saveUsersToStore([...users]);
}

// Submit Permission Change Request for Protected Profile Fields
export function submitProfileChangeRequest(
  userId: string,
  userEmail: string,
  userName: string,
  field: "email" | "inGameId" | "phone",
  fieldLabel: string,
  currentValue: string,
  requestedValue: string,
  reason: string
): { success: boolean; message: string } {
  if (!requestedValue.trim()) {
    return { success: false, message: "Requested new value cannot be empty." };
  }

  const requests = getStoredChangeRequests();
  const newReq: UserChangeRequest = {
    id: "req-" + Date.now(),
    userId,
    userEmail,
    userName,
    field,
    fieldLabel,
    currentValue,
    requestedValue: requestedValue.trim(),
    reason: reason.trim() || "User profile modification request",
    requestedAt: new Date().toISOString(),
    status: "pending",
  };

  const updated = [newReq, ...requests];
  saveChangeRequestsToStore(updated);

  // Sync to Supabase
  (supabase.from("profile_change_requests") as any)
    .insert(newReq)
    .then(() => {});

  return {
    success: true,
    message: `Permission request for ${fieldLabel} submitted to Zyrox HQ Admin! You will be notified once approved.`,
  };
}

// Approve Request with Admin-designated Timeline (durationMinutes)
export function approveChangeRequestWithTimeline(requestId: string, durationMinutes: number = 60) {
  const requests = getStoredChangeRequests();
  const req = requests.find((r) => r.id === requestId);
  if (!req) return;

  req.status = "approved";
  saveChangeRequestsToStore([...requests]);

  // Grant time-limited editing window to user
  const users = getStoredUsers();
  const user = users.find((u) => u.id === req.userId || u.email.toLowerCase() === req.userEmail.toLowerCase());
  if (user) {
    const expiresAt = new Date(Date.now() + durationMinutes * 60000).toISOString();
    user.editPermission = {
      granted: true,
      field: req.field,
      fieldLabel: req.fieldLabel,
      grantedAt: new Date().toISOString(),
      expiresAt,
      durationMinutes,
      isUsed: false,
    };
    saveUsersToStore([...users]);
  }
}

export function approveChangeRequest(requestId: string) {
  approveChangeRequestWithTimeline(requestId, 60);
}

// Consume & Immediately Re-Lock Details upon User Save
export function consumeAndLockEditPermission(
  userEmail: string,
  updatedField?: "email" | "inGameId" | "phone",
  newValue?: string
) {
  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
  if (!user) return;

  if (updatedField && newValue) {
    if (updatedField === "email") user.email = newValue;
    if (updatedField === "inGameId") user.inGameId = newValue;
    if (updatedField === "phone") user.phone = newValue;
  }

  if (user.editPermission) {
    user.editPermission.isUsed = true;
  }

  saveUsersToStore([...users]);
}

export function rejectChangeRequest(requestId: string, adminNote?: string) {
  const requests = getStoredChangeRequests();
  const req = requests.find((r) => r.id === requestId);
  if (!req) return;

  req.status = "rejected";
  req.adminNote = adminNote || "Request rejected by Zyrox Admin";
  saveChangeRequestsToStore([...requests]);
}

// React Custom Hooks
export function useLiveUserManagement() {
  const [users, setUsers] = useState<UserRecord[]>(getStoredUsers());
  const [requests, setRequests] = useState<UserChangeRequest[]>(getStoredChangeRequests());
  const [bannedIps, setBannedIps] = useState<BannedIpRecord[]>(getStoredBannedIps());

  useEffect(() => {
    const handleUsersUpdate = () => setUsers(getStoredUsers());
    const handleReqsUpdate = () => setRequests(getStoredChangeRequests());
    const handleIpsUpdate = () => setBannedIps(getStoredBannedIps());

    window.addEventListener("zyrox_users_updated", handleUsersUpdate);
    window.addEventListener("zyrox_requests_updated", handleReqsUpdate);
    window.addEventListener("zyrox_banned_ips_updated", handleIpsUpdate);

    return () => {
      window.removeEventListener("zyrox_users_updated", handleUsersUpdate);
      window.removeEventListener("zyrox_requests_updated", handleReqsUpdate);
      window.removeEventListener("zyrox_banned_ips_updated", handleIpsUpdate);
    };
  }, []);

  return { users, requests, bannedIps };
}
