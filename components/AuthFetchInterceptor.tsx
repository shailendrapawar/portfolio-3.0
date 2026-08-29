"use client"

import { useEffect } from "react"

import { useAuthStore } from "@/features/auth/store"

// Endpoints where a 401 is expected/handled locally and must NOT bounce the
// user to login: login itself (401 = bad credentials), logout, and the session
// probe used to read auth state.
const EXCLUDED = ["/api/auth/login", "/api/auth/logout", "/api/auth/session"]

function urlFrom(input: RequestInfo | URL): string {
  if (typeof input === "string") return input
  if (input instanceof URL) return input.toString()
  return input.url
}

/**
 * Global 401 interceptor. Patches `window.fetch` once so that ANY authenticated
 * request whose session has expired clears the stale client store and redirects
 * to `/auth` (preserving where the user was). Mounted once in the root layout.
 */
export default function AuthFetchInterceptor() {
  useEffect(() => {
    const original = window.fetch

    // Guard against double-patching across Fast Refresh / re-mounts.
    if ((original as unknown as { __authPatched?: boolean }).__authPatched) {
      return
    }

    const patched: typeof window.fetch = async (input, init) => {
      const res = await original(input, init)

      if (res.status === 401) {
        const url = urlFrom(input)
        const excluded = EXCLUDED.some((path) => url.includes(path))
        const onLogin = window.location.pathname.startsWith("/auth")

        if (!excluded && !onLogin) {
          try {
            useAuthStore.getState().logout()
          } catch {
            // Store may be unavailable; the redirect below is what matters.
          }
          const from = encodeURIComponent(window.location.pathname)
          window.location.href = `/auth?from=${from}`
        }
      }

      return res
    }

    ;(patched as unknown as { __authPatched?: boolean }).__authPatched = true
    window.fetch = patched

    return () => {
      window.fetch = original
    }
  }, [])

  return null
}
