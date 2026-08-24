import { NextResponse } from "next/server"
import { getSession } from "./session"
import type { AuthTokenPayload } from "./jwt"
import { sendResponse } from "@/lib/api/response"

type AuthGuardResult =
  | { authorized: true; session: AuthTokenPayload }
  | { authorized: false; response: NextResponse }

/**
 * Route-handler auth guard. Use in Node-runtime API routes:
 *
 *   const auth = await requireAuth()
 *   if (!auth.authorized) return auth.response
 *   // ...auth.session is available here
 */
export async function requireAuth(): Promise<AuthGuardResult> {
  const session = await getSession()

  if (!session) {
    return {
      authorized: false,
      response: sendResponse(401, "Unauthorized"),
    }
  }

  return { authorized: true, session }
}
