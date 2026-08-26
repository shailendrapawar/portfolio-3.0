import { HydratedDocument } from "mongoose"
import {
  ICreateMessagePayload,
  ISearchMessagePayload,
  IUpdateMessagePayload,
} from "./validators"
import { IMessage, MessageModel } from "./model"
import { connectDB } from "@/lib/db/db"
import { DBRepository } from "@/lib/db/db.repository"
import { ApiError } from "@/lib/api/error"

type MessageDocument = HydratedDocument<IMessage>

export class MessageService extends DBRepository {
  static async get(id: string) {
    await connectDB()
    if (!id) {
      throw new ApiError(400, "Message ID is required")
    }
    const entity = await MessageModel.findById(id)
    return entity
  }

  static async search(
    filters: ISearchMessagePayload = {}
  ): Promise<{ count: number; unread: number; items: MessageDocument[] }> {
    await connectDB()
    const where: Record<string, unknown> = {}
    if (filters.status !== undefined) {
      where.status = filters.status
    }
    if (filters.email) {
      // Escape regex metacharacters so the raw input is matched literally.
      const escaped = filters.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      where.email = { $regex: escaped, $options: "i" }
    }
    if (filters.from || filters.to) {
      const createdAt: Record<string, Date> = {}
      if (filters.from) createdAt.$gte = filters.from
      if (filters.to) createdAt.$lte = filters.to
      where.createdAt = createdAt
    }

    const countPromise = MessageModel.countDocuments(where)
    // Always report the unread total for a dashboard badge, regardless of filter.
    const unreadPromise = MessageModel.countDocuments({ status: "unread" })
    // Most recent first.
    const itemsPromise = MessageModel.find(where).sort({ createdAt: -1 })

    const [count, unread, items] = await Promise.all([
      countPromise,
      unreadPromise,
      itemsPromise,
    ])
    return { count, unread, items }
  }

  // Stores a contact-form submission. Status defaults to "unread" via the schema.
  static async create(payload: ICreateMessagePayload) {
    await connectDB()
    const entity = new MessageModel({
      name: payload.name,
      email: payload.email,
      purpose: payload.purpose,
      message: payload.message,
    })
    await entity.save()
    return entity
  }

  // Flips the read/unread status.
  static async update(id: string, payload: IUpdateMessagePayload) {
    const entity = await this.get(id)
    if (!entity) {
      throw new ApiError(404, "Message not found")
    }
    entity.status = payload.status
    await entity.save()
    return entity
  }

  static async remove(id: string) {
    const entity = await this.get(id)
    if (!entity) {
      throw new ApiError(404, "Message not found")
    }
    await entity.deleteOne()
    return entity
  }
}
