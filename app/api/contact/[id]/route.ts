import { MessageService } from "@/features/message/service"
import { updateMessagePayload } from "@/features/message/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

type RouteContext = { params: Promise<{ id: string }> }

// Admin-only — mark a message read/unread.
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const { id } = await params
    const body = await request.json().catch(() => null)

    const parsed = updateMessagePayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const item = await MessageService.update(id, parsed.data)

    return sendResponse(200, "Message updated successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}

// Admin-only — permanently delete a message.
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const { id } = await params

    const item = await MessageService.remove(id)

    return sendResponse(200, "Message deleted permanently", { item })
  } catch (error) {
    return handleError(error)
  }
}
