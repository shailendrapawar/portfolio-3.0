import { useState } from "react"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

export type UploadedImage = { url: string; id: string }

/** Uploads an image file to `/api/upload` and returns its Cloudinary URL + id. */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const upload = async (file: File): Promise<UploadedImage | null> => {
    setError("")
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", { method: "POST", body: formData })

      const body: ApiResponse<{ image: UploadedImage }> = await res
        .json()
        .catch(() => null as unknown as ApiResponse<{ image: UploadedImage }>)

      if (!res.ok || !body?.success || !body.data?.image) {
        setError(
          typeof body?.message === "string" ? body.message : "Failed to upload image"
        )
        return null
      }

      return body.data.image
    } catch {
      setError("Something went wrong while uploading.")
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error }
}
