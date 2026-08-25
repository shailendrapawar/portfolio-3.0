import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { useAuthStore, type AuthUser } from "../store"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

type LoginData = {
  user: AuthUser
}

export function useLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore((state) => state.login)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const body: ApiResponse<LoginData> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<LoginData>)

      if (!res.ok || !body?.success) {
        setError(
          typeof body?.message === "string" ? body.message : "Invalid email or password"
        )
        return
      }

      // Only store the auth state after a successful login.
      if (body.data?.user) {
        login(body.data.user)
      }

      const from = searchParams.get("from") || "/admin"
      router.push(from)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  }
}
