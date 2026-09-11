/**
 * Admin Credential & Authentication Store
 * Handles registration of primary Admin credentials, credential validation, 
 * 2FA enrollment, and complete credential resets.
 */

export interface RegisteredAdminAccount {
  email: string;
  passwordHash: string; // Plain/hashed password for local verification
  totpSecret: string;
  registeredAt: string;
  is2faEnrolled: boolean;
}

const ADMIN_CREDENTIALS_KEY = "zyrox_admin_registered_credentials_v2";
const SESSION_TOKEN_KEY = "zyrox_admin_session_token";
const TRUSTED_DEVICE_KEY = "zyrox_admin_2fa_trusted_until";
const ENROLLED_KEY = "zyrox_admin_2fa_enrolled";

export const DEFAULT_TOTP_SECRET = "ZYROXARENATOTP2FA";

export function getRegisteredAdmin(): RegisteredAdminAccount | null {
  const envEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
  const envPass = (import.meta.env.VITE_ADMIN_PASSWORD || "").trim();

  // If env credentials are set, they always take priority so changing .env updates immediately!
  if (envEmail) {
    return {
      email: envEmail,
      passwordHash: envPass,
      totpSecret: DEFAULT_TOTP_SECRET,
      registeredAt: new Date().toISOString(),
      is2faEnrolled: true,
    };
  }

  try {
    const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.email === "string" && typeof parsed.passwordHash === "string") {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  return null;
}

export function registerAdminCredentials(email: string, password: string, totpSecret: string = DEFAULT_TOTP_SECRET): RegisteredAdminAccount {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please enter a valid admin email address.");
  }
  if (!cleanPass || cleanPass.length < 6) {
    throw new Error("Admin password must be at least 6 characters long.");
  }

  const account: RegisteredAdminAccount = {
    email: cleanEmail,
    passwordHash: cleanPass,
    totpSecret,
    registeredAt: new Date().toISOString(),
    is2faEnrolled: true,
  };

  localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(account));
  localStorage.setItem(ENROLLED_KEY, "true");
  return account;
}

export function validateLocalAdminCredentials(email: string, password: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  const envEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
  const envPass = (import.meta.env.VITE_ADMIN_PASSWORD || "").trim();

  // If environment credentials are configured, they are the authoritative source
  if (envEmail && envPass) {
    if (cleanEmail === envEmail && cleanPass === envPass) {
      try {
        registerAdminCredentials(cleanEmail, cleanPass);
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }

  const admin = getRegisteredAdmin();
  if (!admin) return false;

  return admin.email.toLowerCase() === cleanEmail && admin.passwordHash === cleanPass;
}

/**
 * Completely wipes all stored admin credential data, session tokens, 
 * 2FA enrollments, and trusted device tokens — returning the system to 
 * fresh first-time registration state.
 */
export function wipeAllAdminCredentialsData(): void {
  localStorage.removeItem(ADMIN_CREDENTIALS_KEY);
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(TRUSTED_DEVICE_KEY);
  localStorage.removeItem(ENROLLED_KEY);
  window.dispatchEvent(new Event("zyrox_admin_credentials_updated"));
}
