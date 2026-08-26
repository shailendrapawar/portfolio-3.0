import { useEffect, useState } from "react"
import { IMessage } from "../model"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

// The DB _id isn't part of the inferred schema type; attach it for the UI.
export type MessageWithId = IMessage & { _id: string }

type SearchMessagesData = {
  items: MessageWithId[]
  count: number
  unread: number
}

/**
 * Loads contact messages from `GET /api/contact`. Pass a pre-built query string
 * (status/email/from/to) to filter server-side; refetches whenever it changes.
 */
export function useSearchMessages(query: string = "") {
  const [messages, setMessages] = useState<MessageWithId[]>([])
  const [count, setCount] = useState<number>(0)
  const [unread, setUnread] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const searchMessages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/contact?${query}`)
      const body: ApiResponse<SearchMessagesData> = await res.json()

      if (!res.ok || !body.success) {
        setError(body.message || "Failed to load messages")
        return
      }

      setMessages(body.data?.items ?? [])
      setCount(body.data?.count ?? 0)
      setUnread(body.data?.unread ?? 0)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    searchMessages()
  }, [query])

  return { messages, count, unread, error, isLoading, searchMessages }
}
