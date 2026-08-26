import { Schema, model, models, InferSchemaType } from "mongoose"
import { UPLOAD_STATUS } from "./constant"

const uploadSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    // Cloudinary public_id — used to look the record up when a project is created.
    id: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(UPLOAD_STATUS),
      default: UPLOAD_STATUS.PENDING,
    },
  },
  { timestamps: true }
)

export const UploadModel = models.Upload || model("Upload", uploadSchema)
export type IUpload = InferSchemaType<typeof uploadSchema>
