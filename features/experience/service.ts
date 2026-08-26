import { HydratedDocument } from "mongoose"
import {
  ICreateWorkExperiencePayload,
  ISearchWorkExperiencePayload,
  IUpdateWorkExperiencePayload,
} from "./validators"
import { IWorkExperience, WorkExperienceModel } from "./model"
import { connectDB } from "@/lib/db/db"
import { DBRepository } from "@/lib/db/db.repository"
import { ApiError } from "@/lib/api/error"

type WorkExperienceDocument = HydratedDocument<IWorkExperience>

export class WorkExperienceService extends DBRepository {
  //1: get
  static async get(id: string) {
    await connectDB()
    if (!id) {
      throw new ApiError(400, "Work experience ID is required")
    }
    const entity = await WorkExperienceModel.findById(id)
    return entity
  }

  static async search(
    filters: ISearchWorkExperiencePayload = {}
  ): Promise<{ count: number; items: WorkExperienceDocument[] }> {
    await connectDB()
    const where: Record<string, unknown> = {}
    if (filters.isCurrent !== undefined) {
      where.isCurrent = filters.isCurrent
    }

    const countPromise = WorkExperienceModel.countDocuments(where)
    // Most recent first.
    const itemsPromise = WorkExperienceModel.find(where).sort({ startDate: -1 })

    const [count, items] = await Promise.all([countPromise, itemsPromise])
    return { count, items }
  }

  // Copies only the fields present on `payload` onto `entity`. Undefined fields
  // are skipped, so it works for both full creates and partial updates.
  static set(payload: any, entity: IWorkExperience): IWorkExperience {
    if (payload?.company !== undefined) entity.company = payload.company
    if (payload?.position !== undefined) entity.position = payload.position
    if (payload?.startDate !== undefined) entity.startDate = payload.startDate
    if (payload?.endDate !== undefined) entity.endDate = payload.endDate
    if (payload?.description !== undefined) entity.description = payload.description
    // Pointers and skills are arrays of strings; tolerate a string too.
    if (payload?.pointers !== undefined) {
      entity.pointers = Array.isArray(payload.pointers)
        ? payload.pointers
        : String(payload.pointers)
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
    }
    if (payload?.skills !== undefined) {
      entity.skills = Array.isArray(payload.skills)
        ? payload.skills
        : String(payload.skills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
    }
    if (payload?.credentials !== undefined) entity.credentials = payload.credentials
    if (payload?.linkedin !== undefined) entity.linkedin = payload.linkedin
    if (payload?.isCurrent !== undefined) entity.isCurrent = payload.isCurrent
    return entity
  }

  // Only one experience may be the current role. Throws if another current
  // entry already exists (excluding `excludeId`, used on update).
  private static async assertSingleCurrent(isCurrent: boolean, excludeId?: string) {
    if (!isCurrent) return
    const where: Record<string, unknown> = { isCurrent: true }
    if (excludeId) where._id = { $ne: excludeId }
    const existing = await WorkExperienceModel.findOne(where)
    if (existing) {
      throw new ApiError(409, "A current role already exists. Only one is allowed.")
    }
  }

  static async create(payload: ICreateWorkExperiencePayload) {
    await connectDB()
    const entity = new WorkExperienceModel()
    this.set(payload, entity)
    await this.assertSingleCurrent(entity.isCurrent)
    await entity.save()
    return entity
  }

  static async update(id: string, payload: IUpdateWorkExperiencePayload) {
    const entity = await this.get(id)
    if (!entity) {
      throw new ApiError(404, "Work experience not found")
    }
    this.set(payload, entity)
    await this.assertSingleCurrent(entity.isCurrent, id)
    await entity.save()
    return entity
  }

  // Permanently deletes a work experience entry.
  static async remove(id: string) {
    const entity = await this.get(id)
    if (!entity) {
      throw new ApiError(404, "Work experience not found")
    }
    await entity.deleteOne()
    return entity
  }
}
