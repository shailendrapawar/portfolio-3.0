import { cookies } from "next/headers"
import { signToken, verifyToken, type AuthTokenPayload } from "./jwt"

export const AUTH_COOKIE = "auth_token"
const MAX_AGE = 60 * 15 // 15 minutes

export async function createSession(payload: AuthTokenPayload) {
  const token = await signToken(payload, "15m")
  const cookieStore = await cookies()

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}
