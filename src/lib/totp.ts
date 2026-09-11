/**
 * Base32 Decode & TOTP (RFC 6238) Generator using Web Crypto API.
 * Fully compatible with Google Authenticator, Authy, and Microsoft Authenticator.
 */

function base32ToBytes(base32: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (let i = 0; i < clean.length; i++) {
    const val = alphabet.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substring(i * 8, (i + 1) * 8), 2);
  }
  return bytes;
}

export async function generateTOTP(secret: string, timeSeconds = Math.floor(Date.now() / 1000), timeStep = 30): Promise<string> {
  const counter = Math.floor(timeSeconds / timeStep);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, BigInt(counter), false);

  const keyBytes = base32ToBytes(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "HMAC", hash: { name: "SHA-1" } },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, buffer);
  const sigBytes = new Uint8Array(signature);
  const offset = sigBytes[sigBytes.length - 1] & 0x0f;
  const binary =
    ((sigBytes[offset] & 0x7f) << 24) |
    ((sigBytes[offset + 1] & 0xff) << 16) |
    ((sigBytes[offset + 2] & 0xff) << 8) |
    (sigBytes[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return String(otp).padStart(6, "0");
}

export async function verifyTOTP(secret: string, inputCode: string): Promise<boolean> {
  const cleanInput = inputCode.trim();
  if (cleanInput.length !== 6 || !/^\d{6}$/.test(cleanInput)) return false;

  const now = Math.floor(Date.now() / 1000);
  // Check current window, -1 window (-30s), +1 window (+30s), -2 window (-60s), +2 window (+60s) for clock drift tolerance
  for (const timeOffset of [0, -30, 30, -60, 60]) {
    const validCode = await generateTOTP(secret, now + timeOffset);
    if (cleanInput === validCode) {
      return true;
    }
  }
  return false;
}
