import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const AUTH_COOKIE = "auth_token"

// Kept self-contained (no lib/env import) so this stays Edge-runtime safe.
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "")

async function isAuthenticated(token: string | undefined): Promise<boolean> {
  if (!token) return false
  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] })
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE)?.value
  const authed = await isAuthenticated(token)

  const isLoginPage = pathname === "/auth"

  // Already signed in but visiting the login page -> send to the admin area.
  if (isLoginPage) {
    if (authed) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }

  // Protected area: require a valid session, else redirect to login.
  if (!authed) {
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Guard the admin area and the login page (for the signed-in redirect).
  matcher: ["/admin", "/admin/:path*", "/auth"],
}
