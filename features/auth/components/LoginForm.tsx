"use client"

import { LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingOverlay from "@/components/LoadingOverlay"
import { useLogin } from "../hooks/useLogin"
import ForgotPasswordModal from "./ForgotPasswordModal"

export default function LoginForm() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } =
    useLogin()

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <LoadingOverlay show={loading} label="Signing in…" />
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm">
          <LogIn className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-accent sm:text-2xl">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-2 w-full rounded-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="flex justify-center border-t border-border pt-4">
        <ForgotPasswordModal />
      </div>
    </div>
  )
}
