export const ownerCookie = "room_owner";

export function ownerSecret() {
  return process.env.OWNER_SECRET || "tteok-memory-room-owner-key";
}

function bytesToHex(bytes: Uint8Array) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToHex(new Uint8Array(signature));
}

export async function signOwnerToken(secret: string, expiresAt: number) {
  const payload = `owner.${expiresAt}`;
  const mac = await hmac(secret, payload);
  return `${payload}.${mac}`;
}

export async function verifyOwnerToken(token: string, secret: string) {
  const [role, exp, mac] = token.split(".");
  if (role !== "owner" || !exp || !mac) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = await hmac(secret, `owner.${exp}`);
  if (expected.length !== mac.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ mac.charCodeAt(i);
  }
  return mismatch === 0;
}
