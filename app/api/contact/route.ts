import { MessageService } from "@/features/message/service"
import {
  createMessagePayload,
  searchMessagePayload,
  type ICreateMessagePayload,
} from "@/features/message/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"
import { rateLimit, getClientIp } from "@/lib/api/rate-limit"
import { mailer } from "@/lib/providers/mailer"
import {
  CONTACT_TEMPLATE_KEY,
  CONTACT_ACK_TEMPLATE_KEY,
} from "@/lib/templates/email"

// Public — anyone submitting the contact form creates a message.
export async function POST(request: Request) {
  try {
    // Throttle per IP before any parsing/DB/mail work, so a flood is cheap
    // to reject. 5 submissions per minute is generous for a human.
    const ip = getClientIp(request)
    const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!limit.ok) {
      const response = sendResponse(
        429,
        "Too many requests. Please wait a moment and try again."
      )
      response.headers.set("Retry-After", String(limit.retryAfterSec))
      return response
    }

    const body = await request.json().catch(() => null)

    const parsed = createMessagePayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const item = await MessageService.create(parsed.data)

    // Fire both notifications. The message is already saved, so mail failures
    // must not fail the request — they're logged and swallowed independently.
    await sendContactEmails(parsed.data)

    return sendResponse(201, "Message sent successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Sends two emails on a new submission: a notification to the site owner and an
 * acknowledgement to the person who enquired. Each is best-effort — a failure
 * in one is logged and never blocks the other or the response.
 */
async function sendContactEmails(payload: ICreateMessagePayload) {
  const { name, email, purpose, message } = payload

  // 1) Notify the owner (delivered to MAIL_TO); reply-to is the enquirer so a
  //    reply reaches them.
  const notifyOwner = mailer
    .send({
      type: "auto",
      templateKey: CONTACT_TEMPLATE_KEY,
      data: payload,
      replyTo: email,
    })
    .catch((error) => {
      console.error("Contact notification email failed:", error)
    })

  // 2) Acknowledge the enquirer.
  const acknowledge = mailer
    .send({
      to: email,
      type: "auto",
      templateKey: CONTACT_ACK_TEMPLATE_KEY,
      data: { name, purpose, message },
    })
    .catch((error) => {
      console.error("Contact acknowledgement email failed:", error)
    })

  await Promise.all([notifyOwner, acknowledge])
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
