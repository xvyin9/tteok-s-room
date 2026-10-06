import { ownerCookie, ownerSecret, signOwnerToken, verifyOwnerToken } from "@/lib/owner-token";
import { cookies } from "next/headers";

const month = 60 * 60 * 24 * 30;

export async function isOwner() {
  const token = (await cookies()).get(ownerCookie)?.value ?? "";
  if (!token) return false;
  return verifyOwnerToken(token, ownerSecret());
}

export async function setOwnerCookie() {
  const expiresAt = Date.now() + month * 1000;
  const token = await signOwnerToken(ownerSecret(), expiresAt);
  (await cookies()).set(ownerCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: month,
  });
}

export async function clearOwnerCookie() {
  (await cookies()).set(ownerCookie, "", { httpOnly: true, path: "/", maxAge: 0 });
}
