import { AuthService } from "@/features/auth/service"
import { resetPasswordWithOtpPayload } from "@/features/auth/validators"
import { sendResponse, handleError } from "@/lib/api/response"
import { rateLimit, getClientIp } from "@/lib/api/rate-limit"

export const runtime = "nodejs"

// Public — completes the OTP flow: re-checks the code and sets the new password.
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const limit = rateLimit(`reset-password-otp:ip:${ip}`, {
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

    const parsed = resetPasswordWithOtpPayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    await AuthService.resetPasswordWithOtp(parsed.data)

    return sendResponse(200, "Password updated. You can now sign in.")
  } catch (error) {
    return handleError(error)
  }
}
