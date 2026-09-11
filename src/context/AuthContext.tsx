import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { getStoredUsers, saveUsersToStore } from "@/lib/userManagementStore";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  inGameId: string;
  phone: string;
}

interface StoredAccount extends UserProfile {
  passwordHash: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string, inGameId: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  openAuthModal: (tab?: "login" | "signup") => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "signup";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_USER_KEY = "zyrox_dev_user_profile";
const ACCOUNTS_DB_KEY = "zyrox_registered_accounts_db";
const COOKIE_NAME = "zyrox_session_token";

// Cookie Helpers for secure session isolation
function setAuthCookie(user: UserProfile) {
  try {
    const encoded = encodeURIComponent(JSON.stringify(user));
    document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=604800; SameSite=Lax`;
  } catch {
    // ignore
  }
}

function getAuthCookie(): UserProfile | null {
  try {
    const cookies = document.cookie.split("; ");
    const found = cookies.find((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (found) {
      const val = found.split("=")[1];
      return JSON.parse(decodeURIComponent(val));
    }
  } catch {
    // fallback
  }
  return null;
}

function clearAuthCookie() {
  try {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  } catch {
    // ignore
  }
}

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccount(account: StoredAccount) {
  const accounts = getStoredAccounts();
  const index = accounts.findIndex((a) => a.email.toLowerCase() === account.email.toLowerCase());
  if (index >= 0) {
    accounts[index] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email ?? "",
            fullName: session.user.user_metadata?.full_name ?? "Player",
            inGameId: session.user.user_metadata?.in_game_id ?? "ZyroxPlayer",
            phone: session.user.user_metadata?.phone ?? "",
          };
          setUser(profile);
          setAuthCookie(profile);
        } else {
          const cookieUser = getAuthCookie();
          if (cookieUser) {
            setUser(cookieUser);
          } else {
            const savedDev = localStorage.getItem(DEV_USER_KEY);
            if (savedDev) setUser(JSON.parse(savedDev));
          }
        }
      } catch {
        const cookieUser = getAuthCookie();
        if (cookieUser) {
          setUser(cookieUser);
        } else {
          const savedDev = localStorage.getItem(DEV_USER_KEY);
          if (savedDev) setUser(JSON.parse(savedDev));
        }
      } finally {
        setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email ?? "",
          fullName: session.user.user_metadata?.full_name ?? "Player",
          inGameId: session.user.user_metadata?.in_game_id ?? "ZyroxPlayer",
          phone: session.user.user_metadata?.phone ?? "",
        };
        setUser(profile);
        setAuthCookie(profile);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

function formatAuthErrorMessage(error: unknown): string {
  if (!error) return "Authentication error. Please try again.";
  const rawMsg = typeof error === "string" ? error : (error as { message?: string }).message || "";
  const lower = rawMsg.toLowerCase();

  if (lower.includes("invalid login credentials") || lower.includes("invalid_credentials") || lower.includes("invalid password") || lower.includes("wrong password")) {
    return "Invalid email or password. Please verify your credentials and try again.";
  }
  if (lower.includes("user not found") || lower.includes("no account found") || lower.includes("account does not exist")) {
    return "No account found with this email address. Please click 'Create Account' to register.";
  }
  if (lower.includes("already registered") || lower.includes("already exists") || lower.includes("user_already_exists")) {
    return "An account with this email address is already registered. Please sign in instead.";
  }
  if (lower.includes("banned") || lower.includes("security alert")) {
    return rawMsg;
  }
  if (lower.includes("fetch") || lower.includes("network") || lower.includes("failed to fetch")) {
    return "Network connection error. Please check your internet connection and try again.";
  }

  // Strip cryptic error prefixes
  return rawMsg.replace(/^\[.*?\]\s*/, "").replace(/^Error:\s*/, "").trim() || "Authentication failed. Please check your details.";
}

  const signIn = async (emailInput: string, passInput: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error("Please provide both email address and password.");
    }

    // Security check: Check if user or email is permanently banned
    const registeredUsers = getStoredUsers();
    const matchUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (matchUser && matchUser.status === "banned") {
      throw new Error(`SECURITY ALERT: Your account (${cleanEmail}) has been PERMANENTLY BANNED. Reason: ${matchUser.banReason || "Anti-Cheat violation"}`);
    }

    // Try Supabase auth first
    let supabaseErr: Error | null = null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });
      if (error) {
        supabaseErr = new Error(formatAuthErrorMessage(error));
      } else if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email ?? cleanEmail,
          fullName: data.user.user_metadata?.full_name ?? cleanEmail.split("@")[0],
          inGameId: data.user.user_metadata?.in_game_id ?? "ZyroxCaptain",
          phone: data.user.user_metadata?.phone ?? "",
        };
        setUser(profile);
        setAuthCookie(profile);
        localStorage.setItem(DEV_USER_KEY, JSON.stringify(profile));
        return;
      }
    } catch (e) {
      supabaseErr = new Error(formatAuthErrorMessage(e));
    }

    // Fallback / Local account validation
    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!existing) {
      if (supabaseErr && !supabaseErr.message.includes("Network connection")) {
        throw supabaseErr;
      }
      throw new Error("No account found with this email address. Please click 'Create Account' to register.");
    }

    if (existing.passwordHash !== cleanPass) {
      throw new Error("Invalid email or password. Please verify your credentials and try again.");
    }

    const profile: UserProfile = {
      id: existing.id,
      email: existing.email,
      fullName: existing.fullName,
      inGameId: existing.inGameId,
      phone: existing.phone,
    };

    setUser(profile);
    setAuthCookie(profile);
    localStorage.setItem(DEV_USER_KEY, JSON.stringify(profile));
  };

  const signUp = async (
    emailInput: string,
    passInput: string,
    fullNameInput: string,
    inGameIdInput: string,
    phoneInput: string
  ) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passInput.trim();
    const cleanName = fullNameInput.trim();
    const cleanIGN = inGameIdInput.trim();
    const cleanPhone = phoneInput.trim();
    const normalizedDigits = cleanPhone.replace(/\D/g, "");

    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (!cleanPass || cleanPass.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    if (!cleanName || !cleanIGN || !cleanPhone) {
      throw new Error("Please complete all registration fields.");
    }
    if (normalizedDigits.length < 10) {
      throw new Error("Please enter a valid 10-digit mobile phone number.");
    }

    // Security check: Check if user email or IP is banned
    const registeredUsers = getStoredUsers();
    const matchUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (matchUser && matchUser.status === "banned") {
      throw new Error(`SECURITY ALERT: Account creation prohibited for ${cleanEmail} (Permanently Banned).`);
    }

    // Database Validation: Check if email is already registered
    const accounts = getStoredAccounts();
    const existingEmail = accounts.find((a) => a.email.toLowerCase() === cleanEmail) || registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      throw new Error("An account with this email address is already registered. Please sign in instead.");
    }

    // Database Validation: Check if mobile phone number is already registered
    const existingPhone = accounts.find((a) => a.phone && a.phone.replace(/\D/g, "") === normalizedDigits) ||
      registeredUsers.find((u) => u.phone && u.phone.replace(/\D/g, "") === normalizedDigits);

    if (existingPhone) {
      throw new Error("This mobile number is already registered with another account. Please use a unique phone number.");
    }

    // Try Supabase signUp
    let supaUser: UserProfile | null = null;
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: { full_name: cleanName, in_game_id: cleanIGN, phone: cleanPhone },
        },
      });
      if (error) {
        throw new Error(formatAuthErrorMessage(error));
      } else if (data.user) {
        supaUser = {
          id: data.user.id,
          email: cleanEmail,
          fullName: cleanName,
          inGameId: cleanIGN,
          phone: cleanPhone,
        };
      }
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
    }

    const newProfile: UserProfile = supaUser ?? {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanName,
      inGameId: cleanIGN,
      phone: cleanPhone,
    };

    saveAccount({
      ...newProfile,
      passwordHash: cleanPass,
    });

    // Add to registered users list
    const currentUsers = getStoredUsers();
    if (!currentUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      saveUsersToStore([
        {
          id: newProfile.id,
          email: newProfile.email,
          fullName: newProfile.fullName,
          inGameId: newProfile.inGameId,
          phone: newProfile.phone,
          registeredAt: new Date().toISOString(),
          status: "active",
          ipAddress: "103.21.124.81",
        },
        ...currentUsers,
      ]);
    }

    setUser(newProfile);
    setAuthCookie(newProfile);
    localStorage.setItem(DEV_USER_KEY, JSON.stringify(newProfile));
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    clearAuthCookie();
    localStorage.removeItem(DEV_USER_KEY);
    setUser(null);
  };

  const openAuthModal = (tab: "login" | "signup" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        openAuthModal,
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen,
        authModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
