import { createHash } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_EMAIL } from "./constants";

const secretKey = process.env.AUTH_SECRET || "fashunsenze-demo-secret-key-2024-change-in-production";
const key = new TextEncoder().encode(secretKey);

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export const DEFAULT_ADMIN_PASSWORD_HASH = hashPassword("fashun2024");

export async function createAdminSession() {
  const token = await new SignJWT({ email: ADMIN_EMAIL, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}
