import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

import { useAuthStore } from "../store"

/**
 * Guards a private route on the client. Verifies the real httpOnly session
 * cookie via /api/auth/session (the source of truth) rather than the persisted
 * store, which stays `true` after the JWT expires. When there is no valid
 * session it clears the stale store and redirects to `/auth`.
 *
 * Re-checks on window focus so a session that expires while the tab sits open
 * also bounces the user to login the next time they return to it.
 *
 * `isReady` is false until the first check resolves, so protected content never
 * flashes (nor does a wrongful redirect fire) before the session is known.
 */
export function useProtectRoute() {
  const router = useRouter()
  const pathname = usePathname()

  const [isReady, setIsReady] = useState(false)
  const [sessionValid, setSessionValid] = useState(false)

  useEffect(() => {
    let active = true

    const check = () =>
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

    check()

    const onFocus = () => check()
    window.addEventListener("focus", onFocus)
    return () => {
      active = false
      window.removeEventListener("focus", onFocus)
    }
  }, [])

  useEffect(() => {
    if (!isReady) return
    if (!sessionValid) {
      router.replace(`/auth?from=${encodeURIComponent(pathname)}`)
    }
  }, [isReady, sessionValid, pathname, router])

  return { isReady, isAuthenticated: isReady && sessionValid }
}
