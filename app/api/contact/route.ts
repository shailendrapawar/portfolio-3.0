import { MessageService } from "@/features/message/service"
import {
  createMessagePayload,
  searchMessagePayload,
} from "@/features/message/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

// Public — anyone submitting the contact form creates a message.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)

    const parsed = createMessagePayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const item = await MessageService.create(parsed.data)

    return sendResponse(201, "Message sent successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}

// Admin-only — lists submitted messages for the dashboard.
export async function GET(request: Request) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const url = new URL(request.url)
    const statusParam = url.searchParams.get("status")
    const emailParam = url.searchParams.get("email")
    const fromParam = url.searchParams.get("from")
    const toParam = url.searchParams.get("to")

    const parsed = searchMessagePayload.safeParse({
      status: statusParam === null ? undefined : statusParam,
      email: emailParam === null ? undefined : emailParam,
      from: fromParam === null ? undefined : fromParam,
      to: toParam === null ? undefined : toParam,
    })
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const { count, unread, items } = await MessageService.search(parsed.data)

    return sendResponse(200, "Messages fetched successfully", {
      items,
      count,
      unread,
    })
  } catch (error) {
    return handleError(error)
  }
}
