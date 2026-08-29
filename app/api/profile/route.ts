import { revalidatePath } from "next/cache"

import { AuthService } from "@/features/auth/service"
import { updateProfilePayload } from "@/features/auth/validators"
import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"

export const runtime = "nodejs"

// Admin-only — updates the signed-in user's profile (name, designation, bio,
// and/or profile picture).
export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const body = await request.json().catch(() => null)

    const parsed = updateProfilePayload.safeParse(body)
    if (!parsed.success) {
      return sendResponse(400, "Validation failed", parsed.error.flatten())
    }

    const user = await AuthService.updateProfile(auth.session.sub, parsed.data)

    // Bust the ISR cache so the new name/picture/bio show immediately instead
    // of waiting for the 60s revalidate window. The home page uses the full
    // profile; every public page shows the name in the footer, so revalidate
    // the whole public layout tree.
    revalidatePath("/", "layout")

    return sendResponse(200, "Profile updated", { user })
  } catch (error) {
    return handleError(error)
  }
}
