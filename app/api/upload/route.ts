import { requireAuth } from "@/lib/auth/guard"
import { sendResponse, handleError } from "@/lib/api/response"
import { ApiError } from "@/lib/api/error"
import { cloudinaryService } from "@/lib/providers/cloudinary"
import { UploadService } from "@/features/upload/service"

export const runtime = "nodejs"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    const auth = await requireAuth()
    if (!auth.authorized) return auth.response

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      throw new ApiError(400, "No image file provided")
    }
    if (!file.type.startsWith("image/")) {
      throw new ApiError(400, "Only image files are allowed")
    }
    if (file.size > MAX_SIZE) {
      throw new ApiError(400, "Image must be 5MB or smaller")
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const image = await cloudinaryService.upload(buffer)

    // Track the asset as "pending" until a project claims it on create.
    await UploadService.create(image)

    return sendResponse(200, "Image uploaded successfully", { image })
  } catch (error) {
    return handleError(error)
  }
}
