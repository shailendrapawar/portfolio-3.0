import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

import { useAuthStore } from "../store"

/**
 * Guards a private route on the client: waits for the persisted auth store to
 * rehydrate, then redirects to `/auth` when there is no auth state.
 *
 * `isReady` is false until rehydration completes so the UI can avoid a flash
 * of protected content (or a wrongful redirect) on refresh.
 */
export function useProtectRoute() {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [isReady, setIsReady] = useState(() => useAuthStore.persist.hasHydrated())

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setIsReady(true))
    if (useAuthStore.persist.hasHydrated()) setIsReady(true)
    return unsub
  }, [])

  useEffect(() => {
    if (!isReady) return
    if (!isAuthenticated) {
      const loginUrl = `/auth?from=${encodeURIComponent(pathname)}`
      router.replace(loginUrl)
    }
  }, [isReady, isAuthenticated, pathname, router])

  return { isReady, isAuthenticated }
}
