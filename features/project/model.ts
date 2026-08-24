import { Schema, model, models, InferSchemaType } from "mongoose"
import { PROJECT_STATUS, PROJECT_CATEGORY } from "./constant"

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(PROJECT_CATEGORY),
    required: true,
  },
  live: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(PROJECT_STATUS),  
    required: true,
  },
})

export const ProjectModel = models.Project || model("Project", projectSchema)
export type IProject = InferSchemaType<typeof projectSchema>
