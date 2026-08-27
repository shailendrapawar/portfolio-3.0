import { useEffect, useState } from "react"

import { useAuthStore } from "../store"

/**
 * Read-only view of the auth state for gating auth-only UI. Verifies the real
 * httpOnly session cookie via /api/auth/session rather than trusting the
 * persisted client store, which stays `true` after the JWT expires. When the
 * cookie is gone, the stale store is cleared. Never redirects.
 *
 * `isReady` is false until the server check resolves, so the gated UI (e.g. the
 * Navbar admin link) doesn't flash for an expired session.
 */
export function useAuthState() {
  const user = useAuthStore((state) => state.user)

  const [isReady, setIsReady] = useState(false)
  const [sessionValid, setSessionValid] = useState(false)

  useEffect(() => {
    let active = true

    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((body) => {
        if (!active) return
        const valid = Boolean(body?.data?.authenticated)
        setSessionValid(valid)
        // Drop stale persisted auth state once the cookie session is gone.
        if (!valid && useAuthStore.getState().isAuthenticated) {
          useAuthStore.getState().logout()
        }
      })
      .catch(() => {
        if (active) setSessionValid(false)
      })
      .finally(() => {
        if (active) setIsReady(true)
      })

    return () => {
      active = false
    }
  }, [])

  return { isReady, isAuthenticated: isReady && sessionValid, user }
}
