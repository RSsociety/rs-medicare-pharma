import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "rsm_admin";
const MAX_AGE = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "rs-medicare-pharma-dev-session-secret";
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "RSMedicare@2026";
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL || "admin@rsmedicarepharma.com";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createAdminToken() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `${adminEmail()}:${expires}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const expected = sign(payload);
  if (
    expected.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return false;
  }
  const [, expiresRaw] = payload.split(":");
  const expires = Number(expiresRaw);
  return Number.isFinite(expires) && expires > Date.now();
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
