import { AuthService } from "@/features/auth/service"
import { loginPayload } from "@/features/auth/validators"
import { createSession } from "@/lib/auth/session"
import { sendResponse, handleError } from "@/lib/api/response"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)

    const parsed = loginPayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const user = await AuthService.login(parsed.data)

    await createSession({ sub: String(user._id), email: user.email })

    return sendResponse(200, "Logged in successfully", { user })
  } catch (error) {
    return handleError(error)
  }
}
