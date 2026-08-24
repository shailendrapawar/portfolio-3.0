import { HydratedDocument, QueryFilter } from "mongoose"
import { ICreateProjectPayload, ISearchProjectPayload, IUpdateProjectPayload } from "./validators"
import { IProject, ProjectModel } from "./model"
import { connectDB } from "@/lib/db/db"
import { DBRepository } from "@/lib/db/db.repository"
import { ApiError } from "@/lib/api/error"

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

  static async create(payload: ICreateProjectPayload) {
    await connectDB()
    const entity = await ProjectModel.create(payload)
    return entity
  }

  static async update(id: string, payload: IUpdateProjectPayload) {
    await connectDB()
    if (!id) {
      throw new ApiError(400, "Project ID is required")
    }
    const entity = await ProjectModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    })
    if (!entity) {
      throw new ApiError(404, "Project not found")
    }
    return entity
  }
}
