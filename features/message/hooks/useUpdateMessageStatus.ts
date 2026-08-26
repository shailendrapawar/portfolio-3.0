import { useState } from "react"
import type { MessageStatus } from "../model"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

/**
 * Flips a message's read/unread status via `PATCH /api/contact/[id]`.
 * Owns the request + loading/error state; the caller triggers `updateStatus`.
 */
export function useUpdateMessageStatus(onSuccess?: () => void) {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")

  const updateStatus = async (
    id: string,
    status: MessageStatus
  ): Promise<boolean> => {
    setError("")
    setUpdating(true)

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const body: ApiResponse<unknown> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<unknown>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string"
            ? body.message
            : "Failed to update message"
        )
        return false
      }

      onSuccess?.()
      return true
    } catch {
      setError("Something went wrong. Please try again.")
      return false
    } finally {
      setUpdating(false)
    }
  }

  return { updateStatus, updating, error }
}
