import { useEffect, useState } from "react"

import { useAuthStore } from "../store"

/**
 * Read-only, hydration-aware view of the auth state. `isAuthenticated` stays
 * false until the persisted store rehydrates, so UI gated on it doesn't flash
 * on refresh. Unlike `useProtectRoute`, this never redirects.
 */
export function useAuthState() {
  const user = useAuthStore((state) => state.user)
  const authed = useAuthStore((state) => state.isAuthenticated)

  const [isReady, setIsReady] = useState(() => useAuthStore.persist.hasHydrated())

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setIsReady(true))
    if (useAuthStore.persist.hasHydrated()) setIsReady(true)
    return unsub
  }, [])

  return { isReady, isAuthenticated: isReady && authed, user }
}
