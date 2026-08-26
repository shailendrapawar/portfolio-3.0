import { useEffect, useState } from "react"

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms have
 * elapsed without `value` changing. Use for search inputs so the derived work
 * (a fetch, or filtering a large list) runs once the user pauses typing rather
 * than on every keystroke — while the input itself stays bound to the live
 * value and feels responsive.
 *
 *   const debouncedSearch = useDebounce(search, 2000)
 *   // build the query / filter from `debouncedSearch`, not `search`
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
