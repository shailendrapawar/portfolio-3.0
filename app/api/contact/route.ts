import { MessageService } from "@/features/message/service"
import {
  createMessagePayload,
  searchMessagePayload,
  type ICreateMessagePayload,
} from "@/features/message/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"
import { mailer } from "@/lib/providers/mailer"
import { CONTACT_TEMPLATE_KEY } from "@/lib/templates/email"

// Public — anyone submitting the contact form creates a message.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)

    const parsed = createMessagePayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const item = await MessageService.create(parsed.data)

    // Notify the site owner. The message is already saved, so a mail failure
    // must not fail the request — log it and still return success.
    await notifyOwner(parsed.data).catch((error) => {
      console.error("Contact notification email failed:", error)
    })

    return sendResponse(201, "Message sent successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}

// Sends the contact-form submission to the owner's inbox via the "contact"
// template, with the sender set as reply-to so a reply goes straight to them.
function notifyOwner(payload: ICreateMessagePayload) {
  return mailer.send({
    type: "auto",
    templateKey: CONTACT_TEMPLATE_KEY,
    data: payload,
    replyTo: payload.email,
  })
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
