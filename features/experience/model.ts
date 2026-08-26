import { Schema, model, models, InferSchemaType } from "mongoose"

const workExperienceSchema = new Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  // Omitted while the role is current.
  endDate: {
    type: Date,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  // Bullet points describing the role.
  pointers: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    required: true,
  },
  // Google Drive link to this company's credentials.
  credentials: {
    type: String,
    required: false,
  },
  // Optional LinkedIn URL/handle for the company.
  linkedin: {
    type: String,
    required: false,
  },
  isCurrent: {
    type: Boolean,
    required: true,
  },
})

export const WorkExperienceModel =
  models.WorkExperience || model("WorkExperience", workExperienceSchema)
export type IWorkExperience = InferSchemaType<typeof workExperienceSchema>
