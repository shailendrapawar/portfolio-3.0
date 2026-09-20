import { AuthService } from "@/features/auth/service"
import { sendResponse, handleError } from "@/lib/api/response"
import { rateLimit, getClientIp } from "@/lib/api/rate-limit"

export const runtime = "nodejs"

// Public — starts the OTP password-reset flow. The code is always emailed to the
// admin address (SEED_ADMIN_EMAIL), so no email is accepted from the client.
// Throttled per IP so it can't be used to spam the inbox or brute the endpoint.
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`forgot-password:ip:${ip}`, {
      limit: 5,
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

    await AuthService.requestPasswordReset()

    return sendResponse(200, "A reset code has been sent to your email.")
  } catch (error) {
    return handleError(error)
  }
}
