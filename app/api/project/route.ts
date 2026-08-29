import { revalidatePath } from "next/cache"

import { ProjectService } from "@/features/project/service"
import { createProjectPayload, searchProjectPayload } from "@/features/project/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)

    const isFeaturedParam = url.searchParams.get("isFeatured")

    const parsed = searchProjectPayload.safeParse({
      category: url.searchParams.get("category") || undefined,
      status: url.searchParams.get("status") || undefined,
      // Only apply the filter when the param is explicitly true/false.
      isFeatured: isFeaturedParam === null ? undefined : isFeaturedParam === "true",
    })

    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const { count, items } = await ProjectService.search(parsed.data)

    return sendResponse(200, "Projects fetched successfully", { items, count })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const body = await request.json().catch(() => null)

    const parsed = createProjectPayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const item = await ProjectService.create(parsed.data)

    // Bust the ISR cache so the new project shows immediately instead of
    // waiting for the revalidate window (/ = featured, /projects = full list).
    revalidatePath("/")
    revalidatePath("/projects")

    return sendResponse(201, "Project created successfully", { item })
  } catch (error) {
    return handleError(error)
  }
}
