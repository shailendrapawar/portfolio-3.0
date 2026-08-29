import { revalidatePath } from "next/cache"

import { WorkExperienceService } from "@/features/experience/service"
import { updateWorkExperiencePayload } from "@/features/experience/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params

    const item = await WorkExperienceService.get(id)
    if (!item) {
      return sendResponse(404, "Work experience not found")
    }

    return sendResponse(200, "Work experience fetched successfully", { item })
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

    const parsed = updateWorkExperiencePayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const item = await WorkExperienceService.update(id, parsed.data)

    // Bust the ISR cache so the edit shows immediately (/ = latest two,
    // /experience = full timeline).
    revalidatePath("/")
    revalidatePath("/experience")

    return sendResponse(200, "Work experience updated successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const { id } = await params

    const item = await WorkExperienceService.remove(id)

    // Bust the ISR cache so the removal shows immediately (/ = latest two,
    // /experience = full timeline).
    revalidatePath("/")
    revalidatePath("/experience")

    return sendResponse(200, "Work experience deleted permanently", { item })
  } catch (error) {
    return handleError(error)
  }
}
