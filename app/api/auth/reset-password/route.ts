import { AuthService } from "@/features/auth/service"
import { resetPasswordPayload } from "@/features/auth/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

export const runtime = "nodejs"

// Admin-only — resets the signed-in user's password. The current password is
// not required; the httpOnly session cookie already proves identity.
export async function POST(request: Request) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const body = await request.json().catch(() => null)

    const parsed = resetPasswordPayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    await AuthService.resetPassword(auth.session.sub, parsed.data)

    return sendResponse(200, "Password updated")
  } catch (error) {
    return handleError(error)
  }
}
