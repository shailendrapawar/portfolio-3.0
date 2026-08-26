import { useState } from "react"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

/**
 * Permanently deletes a message via `DELETE /api/contact/[id]`.
 * Owns the request + loading/error state; the component triggers `deleteMessage`.
 */
export function useDeleteMessage(onSuccess?: () => void) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const deleteMessage = async (id: string): Promise<boolean> => {
    setError("")
    setDeleting(true)

    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" })

      const body: ApiResponse<unknown> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<unknown>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string"
            ? body.message
            : "Failed to delete message"
        )
        return false
      }

      onSuccess?.()
      return true
    } catch {
      setError("Something went wrong. Please try again.")
      return false
    } finally {
      setDeleting(false)
    }
  }

  return { deleteMessage, deleting, error }
}
