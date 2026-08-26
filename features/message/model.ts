import { Schema, model, models, InferSchemaType } from "mongoose"

// A submission is unread until the admin opens/marks it.
export const MESSAGE_STATUS = ["unread", "read"] as const
export type MessageStatus = (typeof MESSAGE_STATUS)[number]

const messageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // Reason the sender reached out (e.g. "Freelance Inquiry").
    purpose: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: MESSAGE_STATUS,
      default: "unread",
    },
  },
  // Adds createdAt / updatedAt.
  { timestamps: true }
)

export const MessageModel = models.Message || model("Message", messageSchema)

// InferSchemaType omits the timestamp fields, so add them explicitly.
export type IMessage = InferSchemaType<typeof messageSchema> & {
  createdAt: Date
  updatedAt: Date
}
