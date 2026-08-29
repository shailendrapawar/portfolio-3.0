import { useEffect, useState } from "react"

// Matches Tailwind's `md` breakpoint (the mobile/desktop line used across the
// UI, e.g. the Navbar's `md:hidden` / `md:flex`). Screens narrower than this
// are treated as mobile.
const MOBILE_BREAKPOINT = 768

/**
 * Tells whether the app is being viewed on a mobile-sized screen (`true`) or a
 * larger web/desktop screen (`false`). Reactive: it updates on resize and
 * orientation change.
 *
 * SSR-safe: returns `false` until mounted (the server has no viewport), so
 * guard render-critical branches with it only on the client, or accept the
 * desktop-first default for the first paint.
 *
 *   const isMobile = useIsMobile()
 *   return isMobile ? <MobileMenu /> : <DesktopNav />
 *
 * Pass a custom breakpoint to override the default:
 *   const isSmall = useIsMobile(640)
 */
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setIsMobile(query.matches)

    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [breakpoint])

  return isMobile
}
