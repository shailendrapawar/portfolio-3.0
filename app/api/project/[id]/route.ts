import { ProjectService } from "@/features/project/service"
import { updateProjectPayload } from "@/features/project/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params

    const item = await ProjectService.get(id)
    if (!item) {
      return sendResponse(404, "Project not found")
    }

    return sendResponse(200, "Project fetched successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const { id } = await params
    const body = await request.json().catch(() => null)

    const parsed = updateProjectPayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const item = await ProjectService.update(id, parsed.data)

    return sendResponse(200, "Project updated successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}
