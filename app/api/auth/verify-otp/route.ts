import { AuthService } from "@/features/auth/service"
import { verifyOtpPayload } from "@/features/auth/validators"
import { sendResponse, handleError } from "@/lib/api/response"
import { rateLimit, getClientIp } from "@/lib/api/rate-limit"

export const runtime = "nodejs"

// Public — verifies a reset code without consuming it, so the UI can advance to
// the new-password step. The code itself is re-checked when the password is set.
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`verify-otp:ip:${ip}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    })
    if (!limit.ok) {
      const response = sendResponse(
        429,
        "Too many requests. Please wait a moment and try again."
      )
      response.headers.set("Retry-After", String(limit.retryAfterSec))
      return response
    }

    const body = await request.json().catch(() => null)

    const parsed = verifyOtpPayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    await AuthService.verifyResetOtp(parsed.data)

    return sendResponse(200, "Code verified")
  } catch (error) {
    return handleError(error)
  }
}
