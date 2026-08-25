import { useState } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "../store"

type ApiResponse = {
  success: boolean
  statusCode: number
  message: string
}

export function useLogout() {
  const router = useRouter()
  const clearAuth = useAuthStore((state) => state.logout)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })

      const body: ApiResponse = await res
        .json()
        .catch(() => null as unknown as ApiResponse)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string" ? body.message : "Failed to log out"
        )
        return
      }

      // Only clear the auth state after a successful logout.
      clearAuth()

      router.push("/auth")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return {
    error,
    loading,
    handleLogout,
  }
}
