import { revalidatePath } from "next/cache"

import { WorkExperienceService } from "@/features/experience/service"
import {
  createWorkExperiencePayload,
  searchWorkExperiencePayload,
} from "@/features/experience/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const isCurrentParam = url.searchParams.get("isCurrent")

    const parsed = searchWorkExperiencePayload.safeParse({
      // Only apply the filter when the param is explicitly true/false.
      isCurrent:
        isCurrentParam === null ? undefined : isCurrentParam === "true",
    })

    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const { count, items } = await WorkExperienceService.search(parsed.data)

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

    // Bust the ISR cache so the new entry shows immediately (/ = latest two,
    // /experience = full timeline).
    revalidatePath("/")
    revalidatePath("/experience")

    return sendResponse(201, "Work experience created successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}
