import { v2 as cloudinary } from "cloudinary"

import { ENV } from "./env"

export type UploadedImage = { url: string; id: string }

/**
 * Server-side Cloudinary access. Configured once in the constructor; exposed as
 * a singleton (`cloudinaryService`) so the SDK is set up on first import only.
 */
class CloudinaryService {
  private readonly folder: string

  constructor() {
    cloudinary.config({
      cloud_name: ENV.cloudinary.cloudName,
      api_key: ENV.cloudinary.apiKey,
      api_secret: ENV.cloudinary.apiSecret,
    })
    this.folder = ENV.cloudinary.folder
  }

  /** Uploads an image buffer and returns its public URL + id. */
  upload(buffer: Buffer): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: this.folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"))
            return
          }
          resolve({ url: result.secure_url, id: result.public_id })
        }
      )
      stream.end(buffer)
    })
  }

  /** Removes a previously uploaded image by its public id. */
  async delete(publicId: string): Promise<void> {
    if (!publicId) return
    await cloudinary.uploader.destroy(publicId)
  }
}

/** Singleton Cloudinary service — configured once on first import. */
export const cloudinaryService = new CloudinaryService()

export { cloudinary }
