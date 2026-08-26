import { HydratedDocument } from "mongoose"
import { ICreateWorkExperiencePayload, IUpdateWorkExperiencePayload } from "./validators"
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

  static async search(): Promise<{ count: number; items: WorkExperienceDocument[] }> {
    await connectDB()
    const countPromise = WorkExperienceModel.countDocuments({})
    const itemsPromise = WorkExperienceModel.find({})

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
    if (payload?.isCurrent !== undefined) entity.isCurrent = payload.isCurrent
    return entity
  }

  static async create(payload: ICreateWorkExperiencePayload) {
    await connectDB()
    const entity = new WorkExperienceModel()
    this.set(payload, entity)
    await entity.save()
    return entity
  }

  static async update(id: string, payload: IUpdateWorkExperiencePayload) {
    await connectDB()
    if (!id) {
      throw new ApiError(400, "Work experience ID is required")
    }
    const entity = await WorkExperienceModel.findById(id)
    if (!entity) {
      throw new ApiError(404, "Work experience not found")
    }
    this.set(payload, entity)
    await entity.save()
    return entity
  }

  // Permanently deletes a work experience entry.
  static async remove(id: string) {
    await connectDB()
    if (!id) {
      throw new ApiError(400, "Work experience ID is required")
    }
    const entity = await WorkExperienceModel.findById(id)
    if (!entity) {
      throw new ApiError(404, "Work experience not found")
    }
    await entity.deleteOne()
    return entity
  }
}
