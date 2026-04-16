import crypto from "crypto";

const ITERATIONS = 10000;
const KEY_LEN = 64;
const DIGEST = "sha512";

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST)
    .toString("hex");
  return { hash, salt };
}

export function verifyPassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  const checkHash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST)
    .toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(checkHash, "hex"),
    Buffer.from(hash, "hex")
  );
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getSessionExpiry(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}

export const SESSION_COOKIE = "user_session";
