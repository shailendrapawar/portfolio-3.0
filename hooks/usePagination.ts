import { useEffect, useMemo, useState } from "react"

export type PaginationControls = {
  page: number
  pageCount: number
  total: number
  limit: number
  setLimit: (n: number) => void
  next: () => void
  prev: () => void
  canNext: boolean
  canPrev: boolean
}

/**
 * Client-side pagination over an in-memory list. Slices `items` into the
 * current page. Resets to page 1 whenever the input list changes (e.g. after a
 * filter), and clamps the page if the list shrinks.
 */
export function usePagination<T>(
  items: T[],
  initialLimit = 5
): { pageItems: T[] } & PaginationControls {
  const [limit, setLimitState] = useState(initialLimit)
  const [page, setPage] = useState(1)

  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / limit))

  // A new list (filter change / refetch) starts back at page 1.
  useEffect(() => {
    setPage(1)
  }, [items])

  // Keep the page in range if the list shrinks below the current page.
  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  const pageItems = useMemo(() => {
    const start = (page - 1) * limit
    return items.slice(start, start + limit)
  }, [items, page, limit])

  const setLimit = (n: number) => {
    setLimitState(n)
    setPage(1)
  }

  return {
    pageItems,
    page,
    pageCount,
    total,
    limit,
    setLimit,
    next: () => setPage((p) => Math.min(pageCount, p + 1)),
    prev: () => setPage((p) => Math.max(1, p - 1)),
    canNext: page < pageCount,
    canPrev: page > 1,
  }
}
