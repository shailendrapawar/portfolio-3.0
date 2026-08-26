import { UploadService } from "@/features/upload/service"
import { sendResponse, handleError } from "@/lib/api/response"
import { ENV } from "@/lib/env"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Daily cleanup of orphaned uploads. Runs on the Vercel Cron schedule in
 * `vercel.json`; Vercel sends `Authorization: Bearer $CRON_SECRET`, which we
 * verify so the endpoint can't be triggered by anyone else.
 */
export async function GET(request: Request) {
  try {
    const secret = ENV.cron.secret
    const authHeader = request.headers.get("authorization")

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return sendResponse(401, "Unauthorized")
    }

    const result = await UploadService.purgePending()

    return sendResponse(200, "Pending uploads cleaned up", result)
  } catch (error) {
    return handleError(error)
  }
}
