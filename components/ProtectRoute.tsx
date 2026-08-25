"use client"

import { useProtectRoute } from "@/features/auth/hooks/useProtectRoute"

type ProtectRouteProps = {
  children: React.ReactNode
  /** Optional UI to show while the auth state is being resolved. */
  fallback?: React.ReactNode
}

/**
 * Wraps private UI and renders `children` only when the auth state exists.
 * While the persisted store rehydrates it shows `fallback`; if there is no
 * auth state the hook redirects to `/auth` and nothing is rendered.
 */
export default function ProtectRoute({ children, fallback = null }: ProtectRouteProps) {
  const { isReady, isAuthenticated } = useProtectRoute()

  if (!isReady || !isAuthenticated) return <>{fallback}</>

  return <>{children}</>
}
