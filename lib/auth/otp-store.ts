import crypto from "crypto"

/**
 * In-memory, dependency-free OTP cache (temporary caching instead of an OTP
 * collection). State lives in module memory, so it's per server instance — the
 * same trade-off as `lib/api/rate-limit.ts`: solid on a single long-lived
 * server, best-effort on serverless (each instance/cold start has its own map).
 *
 * Codes are stored hashed (sha256) with a short TTL and a hard attempt cap, so
 * a leaked memory dump doesn't reveal live codes and brute-forcing is bounded.
 */

type OtpEntry = {
  codeHash: string
  createdAt: number
  expiresAt: number
  attempts: number
}

const store = new Map<string, OtpEntry>()

const MAX_ATTEMPTS = 5

function keyFor(email: string) {
  return email.trim().toLowerCase()
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex")
}

// Drop expired entries so the map can't grow unbounded.
function sweep(now: number) {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key)
  }
}

/** Generates a zero-padded 6-digit numeric OTP using a CSPRNG. */
export function generateOtp(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0")
}

/** Stores (overwriting any previous) a fresh OTP for `email`, valid for `ttlMs`. */
export function setOtp(email: string, code: string, ttlMs: number) {
  const now = Date.now()
  if (store.size > 1000) sweep(now)
  store.set(keyFor(email), {
    codeHash: hashCode(code),
    createdAt: now,
    expiresAt: now + ttlMs,
    attempts: 0,
  })
}

/**
 * Milliseconds remaining before a fresh OTP may be issued for `email`, given a
 * `cooldownMs` window since the last one was set. Returns 0 when a new code is
 * allowed (no active code, or the cooldown has elapsed).
 */
export function msUntilResend(email: string, cooldownMs: number): number {
  const entry = store.get(keyFor(email))
  if (!entry) return 0
  const elapsed = Date.now() - entry.createdAt
  return Math.max(0, cooldownMs - elapsed)
}

export type OtpFailureReason =
  | "missing"
  | "expired"
  | "too_many_attempts"
  | "mismatch"

export type OtpCheck = { ok: true } | { ok: false; reason: OtpFailureReason }

/**
 * Verifies `code` for `email` WITHOUT consuming it, so the same code can pass a
 * verify step and then the final reset step. Wrong guesses increment the attempt
 * counter; the entry is dropped once expired or the attempt cap is hit.
 */
export function checkOtp(email: string, code: string): OtpCheck {
  const key = keyFor(email)
  const entry = store.get(key)
  const now = Date.now()

  if (!entry) return { ok: false, reason: "missing" }

  if (entry.expiresAt <= now) {
    store.delete(key)
    return { ok: false, reason: "expired" }
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key)
    return { ok: false, reason: "too_many_attempts" }
  }

  if (!timingSafeEqualHex(entry.codeHash, hashCode(code))) {
    entry.attempts += 1
    return { ok: false, reason: "mismatch" }
  }

  return { ok: true }
}

/** Invalidates any OTP for `email` (call after a successful reset). */
export function clearOtp(email: string) {
  store.delete(keyFor(email))
}

function timingSafeEqualHex(a: string, b: string) {
  const bufA = Buffer.from(a, "hex")
  const bufB = Buffer.from(b, "hex")
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}
