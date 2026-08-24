import { destroySession } from "@/lib/auth/session"
import { sendResponse, handleError } from "@/lib/api/response"

export async function POST() {
  try {
    await destroySession()
    return sendResponse(200, "Logged out successfully")
  } catch (error) {
    return handleError(error)
  }
}
