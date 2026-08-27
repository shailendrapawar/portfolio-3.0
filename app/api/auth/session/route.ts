import { getSession } from "@/lib/auth/session"
import { sendResponse, handleError } from "@/lib/api/response"

export const runtime = "nodejs"

// Reports whether the httpOnly session cookie is currently valid. Used by the
// client to gate auth-only UI (e.g. the Navbar admin link) against the real
// session rather than the persisted client store, which can go stale.
export async function GET() {
  try {
    const session = await getSession()
    return sendResponse(200, "ok", { authenticated: Boolean(session) })
  } catch (error) {
    return handleError(error)
  }
}
