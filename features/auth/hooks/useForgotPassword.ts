import { useState } from "react"

type ApiResponse = {
  success: boolean
  statusCode: number
  message: string
}

// otp → password → done. There's no email step — the code is always sent to the
// admin address server-side, so the flow opens straight at the code entry.
export type ForgotPasswordStep = "otp" | "password" | "done"

async function postJson(url: string, payload?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  })
  const body: ApiResponse | null = await res
    .json()
    .catch(() => null as unknown as ApiResponse)
  return { res, body }
}

/**
 * Owns the public forgot-password (OTP) flow: step machine, field state,
 * loading/error/info flags, and the POSTs (request code → verify code → set new
 * password). The code is emailed to the admin address by the server, so nothing
 * identifies the account from the client.
 */
export function useForgotPassword() {
  const [step, setStep] = useState<ForgotPasswordStep>("otp")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  // Ask the server to email a fresh code. Used on open (silent) and for "resend".
  // When `silent`, a cooldown (429) is ignored — a previously sent code is still
  // valid, so the user can just enter it without seeing an error.
  const requestOtp = async (opts?: { silent?: boolean }) => {
    if (loading) return
    setError("")
    setInfo("")
    setLoading(true)
    try {
      const { res, body } = await postJson("/api/auth/forgot-password")
      if (!res.ok || !body?.success) {
        if (opts?.silent && res.status === 429) return
        setError(body?.message || "Failed to send the reset code.")
        return
      }
    } catch {
      if (!opts?.silent) setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 1: verify the entered code.
  const verifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (loading) return
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code from your email.")
      return
    }
    setError("")
    setInfo("")
    setLoading(true)
    try {
      const { res, body } = await postJson("/api/auth/verify-otp", { otp })
      if (!res.ok || !body?.success) {
        setError(body?.message || "Incorrect code. Please try again.")
        return
      }
      setStep("password")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: set the new password (re-checks the code server-side).
  const resetPassword = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (loading) return
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setError("")
    setInfo("")
    setLoading(true)
    try {
      const { res, body } = await postJson("/api/auth/reset-password-otp", {
        otp,
        newPassword,
        confirmPassword,
      })
      if (!res.ok || !body?.success) {
        setError(body?.message || "Failed to reset password.")
        return
      }
      setStep("done")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Clear everything back to the first step (e.g. when the modal closes).
  const reset = () => {
    setStep("otp")
    setOtp("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
    setInfo("")
    setLoading(false)
  }

  return {
    step,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    info,
    requestOtp,
    verifyOtp,
    resetPassword,
    reset,
  }
}
