import { HydratedDocument, QueryFilter } from "mongoose"
import { ICreateProjectPayload, ISearchProjectPayload, IUpdateProjectPayload } from "./validators"
import { IProject, ProjectModel } from "./model"
import { connectDB } from "@/lib/db/db"
import { DBRepository } from "@/lib/db/db.repository"
import { ApiError } from "@/lib/api/error"
import { cloudinaryService } from "@/lib/cloudinary"

type ProjectDocument = HydratedDocument<IProject>

export class ProjectService extends DBRepository {
  private populate: any[] = []

  constructor() {
    super()
    this.populate = []
  }

  //1: get
  static async get(id: string) {
    await connectDB()
    if (!id) {
      throw new ApiError(400, "Project ID is required")
    }
    const entity = await ProjectModel.findById(id)
    return entity
  }

  static async search(filters: ISearchProjectPayload): Promise<{ count: number; items: ProjectDocument[] }> {
    await connectDB()
    let where: QueryFilter<IProject> = {}

    if (filters.category) {
      where.category = filters.category as any
    }
    if (filters.status) {
      where.status = filters.status as any
    }
    const countPromise = ProjectModel.countDocuments(where)
    const itemsPromise = ProjectModel.find(where)

    const [count, items] = await Promise.all([countPromise, itemsPromise])

    console.log("count", count)
    console.log("items", items)
    return { count, items }
  }

  // Copies only the fields present on `payload` onto `entity`. Undefined fields
  // are skipped, so it works for both full creates and partial updates.
  static set(payload: any, entity: IProject): IProject {
    if (payload?.title !== undefined) entity.title = payload.title
    if (payload?.description !== undefined) entity.description = payload.description
    if (payload?.img !== undefined) entity.img = payload.img
    // Skills are stored as an array of strings; tolerate a comma-separated string too.
    if (payload?.skills !== undefined) {
      entity.skills = Array.isArray(payload.skills)
        ? payload.skills
        : String(payload.skills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
    }
    if (payload?.category !== undefined) entity.category = payload.category
    if (payload?.live !== undefined) entity.live = payload.live
    if (payload?.github !== undefined) entity.github = payload.github
    if (payload?.isFeatured !== undefined) entity.isFeatured = payload.isFeatured
    if (payload?.status !== undefined) entity.status = payload.status
    return entity
  }

  static async create(payload: ICreateProjectPayload) {
    await connectDB()
    const entity = new ProjectModel()
    this.set(payload, entity)
    await entity.save()
    return entity
  }

  static async update(id: string, payload: IUpdateProjectPayload) {
    await connectDB()
    if (!id) {
      throw new ApiError(400, "Project ID is required")
    }
    const entity = await ProjectModel.findById(id)
    if (!entity) {
      throw new ApiError(404, "Project not found")
    }
    this.set(payload, entity)
    await entity.save()
    return entity
  }

  // Permanently deletes a project: first removes its Cloudinary asset (from
  // img.id), then deletes the document itself. Irreversible.
  static async remove(id: string) {
    await connectDB()
    if (!id) {
      throw new ApiError(400, "Project ID is required")
    }
    const entity = await ProjectModel.findById(id)
    if (!entity) {
      throw new ApiError(404, "Project not found")
    }

    if (entity.img?.id) {
      await cloudinaryService.delete(entity.img.id)
    }

    await entity.deleteOne()
    return entity
  }
}
