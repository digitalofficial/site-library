import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "portfolio_admin";

// The cookie holds an HMAC of the password, never the password itself, so a
// leaked cookie can't be read back and rotating ADMIN_PASSWORD logs everyone out.
function token() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update("portfolio-admin-v1").digest("hex");
}

export function isAdmin() {
  const expected = token();
  const got = cookies().get(COOKIE)?.value;
  if (!expected || !got || got.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

export function checkPassword(candidate: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || candidate.length !== pw.length) return false;
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(pw));
}

export function setAdminCookie() {
  const t = token();
  if (!t) return;
  cookies().set(COOKIE, t, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE);
}
