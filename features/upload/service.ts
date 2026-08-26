import { connectDB } from "@/lib/db/db"
import { DBRepository } from "@/lib/db/db.repository"
import { cloudinaryService } from "@/lib/providers/cloudinary"
import { UploadModel } from "./model"
import { UPLOAD_STATUS } from "./constant"

export class UploadService extends DBRepository {
  // Records a freshly uploaded asset. Defaults to status "pending" until a
  // project claims it (see `activate`).
  static async create(payload: { url: string; id: string }) {
    await connectDB()
    const entity = new UploadModel()
    entity.url = payload.url
    entity.id = payload.id
    await entity.save()
    return entity
  }

  // Finds the upload by its Cloudinary public_id and marks it active. Returns
  // null if no matching record exists (never throws — activation is best-effort).
  static async activate(publicId: string) {
    await connectDB()
    if (!publicId) return null
    const entity = await UploadModel.findOneAndUpdate(
      { id: publicId },
      { status: UPLOAD_STATUS.ACTIVE },
      { new: true }
    )
    return entity
  }

  // Cleans up orphaned uploads: every "pending" record is an asset that was
  // uploaded but never claimed by a project. Deletes each from Cloudinary
  // (by public_id) and removes the record. Meant to be run on a schedule.
  static async purgePending() {
    await connectDB()
    const pending = await UploadModel.find({ status: UPLOAD_STATUS.PENDING })

    let deleted = 0
    for (const upload of pending) {
      if (upload.id) {
        await cloudinaryService.delete(upload.id)
      }
      await upload.deleteOne()
      deleted++
    }

    return { scanned: pending.length, deleted }
  }
}
