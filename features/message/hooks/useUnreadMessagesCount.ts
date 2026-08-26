import { useEffect, useState } from "react"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

// The search response always reports the unread total, so we only read that.
type MessagesData = { unread: number }

/**
 * Fetches just the unread-messages total for the admin nav badge.
 * Returns `refresh` so callers can re-sync after messages are read/deleted.
 */
export function useUnreadMessagesCount() {
  const [unread, setUnread] = useState<number>(0)

  const refresh = async () => {
    try {
      const res = await fetch("/api/contact?status=unread")
      const body: ApiResponse<MessagesData> = await res.json()
      if (res.ok && body.success) {
        setUnread(body.data?.unread ?? 0)
      }
    } catch {
      // Badge is best-effort; ignore transient failures.
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return { unread, refresh }
}
