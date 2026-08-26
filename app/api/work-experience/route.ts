import { WorkExperienceService } from "@/features/experience/service"
import { createWorkExperiencePayload } from "@/features/experience/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

export async function GET() {
  try {
    const { count, items } = await WorkExperienceService.search()

    return sendResponse(200, "Work experiences fetched successfully", { items, count })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const body = await request.json().catch(() => null)

    const parsed = createWorkExperiencePayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const item = await WorkExperienceService.create(parsed.data)

    return sendResponse(201, "Work experience created successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}
