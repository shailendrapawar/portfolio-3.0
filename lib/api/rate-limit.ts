/**
 * Lightweight, dependency-free rate limiter (fixed window, per key).
 *
 * State lives in module memory, so it's per server instance. On a single
 * long-lived server this is a solid guard against floods/spam. On serverless
 * (e.g. Vercel), each instance has its own memory and cold starts reset it —
 * so it blunts a single-source burst but isn't a distributed limiter. For
 * strict global limits across instances, swap the store for Upstash Redis
 * (@upstash/ratelimit) — the `rateLimit()` call sites stay the same.
 *
 * This is application-level abuse protection, NOT network-level DDoS defense.
 * A true DDoS is best absorbed at the edge (Cloudflare / your host's WAF).
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

// Drop expired buckets so the map can't grow unbounded under many distinct IPs.
function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitOptions = {
  /** Max requests allowed within the window. */
  limit: number
  /** Window length in milliseconds. */
  windowMs: number
}

export type RateLimitResult = {
  ok: boolean
  /** Requests left in the current window. */
  remaining: number
  /** Seconds until the window resets (for a Retry-After header). */
  retryAfterSec: number
}

export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  // New key, or the previous window has elapsed → start a fresh window.
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size > 5000) sweep(now)
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 }
  }

  bucket.count += 1
  const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000)

  return {
    ok: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSec,
  }
}

/**
 * Best-effort client IP from proxy headers. Behind Vercel/most hosts the real
 * client is the first entry in `x-forwarded-for`. Falls back to "unknown",
 * which buckets all header-less callers together (fine as a floor).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}
