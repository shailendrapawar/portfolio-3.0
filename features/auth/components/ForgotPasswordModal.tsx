"use client"

import { useState } from "react"
import { MailCheck } from "lucide-react"

import Modal from "@/components/Modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForgotPassword } from "../hooks/useForgotPassword"

/**
 * "Forgot password?" trigger + multi-step OTP modal. Manages only its own open
 * state (mirroring ResetPasswordButton); the flow logic lives in the hook. On
 * open, a code is emailed automatically to the admin address, so the modal
 * starts at the code-entry step.
 */
export default function ForgotPasswordModal() {
  const [open, setOpen] = useState(false)
  const {
    step,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    requestOtp,
    verifyOtp,
    resetPassword,
    reset,
  } = useForgotPassword()

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      // Send the code as soon as the modal opens; ignore the cooldown here since
      // a recently sent code is still valid.
      requestOtp({ silent: true })
    } else {
      // Reset the flow whenever the modal closes so it reopens clean.
      reset()
    }
  }

  const titles: Record<typeof step, string> = {
    otp: "Enter the code",
    password: "Set a new password",
    done: "Password updated",
  }

  const descriptions: Record<typeof step, string> = {
    otp: "Enter the 6-digit code to reset your password.",
    password: "Choose a new password for your account.",
    done: "Your password has been changed successfully.",
  }

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Forgot password?
      </button>

      <Modal
        open={open}
        onOpenChange={handleOpenChange}
        title={titles[step]}
        description={descriptions[step]}
      >
        {step === "otp" && (
          <form onSubmit={verifyOtp} className="flex flex-col items-center gap-5">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm">
              <MailCheck className="size-6" />
            </span>

            <div className="flex w-full flex-col gap-1.5">
              <Label htmlFor="fp-otp" className="sr-only">
                6-digit code
              </Label>
              <Input
                id="fp-otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="••••••"
                required
                autoFocus
                disabled={loading}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-12 text-center text-2xl font-semibold tracking-[0.5em] placeholder:tracking-[0.5em]"
              />
            </div>

            {error && (
              <p className="w-full text-center text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full rounded-full"
            >
              {loading ? "Verifying…" : "Verify code"}
            </Button>

            <button
              type="button"
              onClick={() => requestOtp()}
              disabled={loading}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              Resend code
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={resetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fp-new-password">New password</Label>
              <Input
                id="fp-new-password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                disabled={loading}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fp-confirm-password">Confirm password</Label>
              <Input
                id="fp-confirm-password"
                type="password"
                placeholder="Re-enter new password"
                autoComplete="new-password"
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="rounded-full">
              {loading ? "Saving…" : "Update password"}
            </Button>
          </form>
        )}

        {step === "done" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="rounded-full"
            >
              Back to sign in
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}
