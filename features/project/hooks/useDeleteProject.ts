import { useState } from "react"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

/**
 * Permanently deletes a project (and its Cloudinary asset) via
 * `DELETE /api/project/[id]`. Owns the request + loading/error state; the
 * component only triggers `deleteProject` and reads the flags.
 */
export function useDeleteProject(onSuccess?: () => void) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  const deleteProject = async (id: string): Promise<boolean> => {
    setError("")
    setDeleting(true)

    try {
      const res = await fetch(`/api/project/${id}`, { method: "DELETE" })

      const body: ApiResponse<unknown> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<unknown>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string" ? body.message : "Failed to delete project"
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

  return { deleteProject, deleting, error }
}
