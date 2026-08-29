import { Schema, model, models, InferSchemaType } from "mongoose"

import { EMPLOYMENT_TYPE, WORK_MODE } from "./constant"

const workExperienceSchema = new Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  // Employment type: full-time or internship.
  type: {
    type: String,
    enum: Object.values(EMPLOYMENT_TYPE),
    required: true,
    default: EMPLOYMENT_TYPE.FULL_TIME,
  },
  // Work mode: on-site, hybrid, or remote.
  mode: {
    type: String,
    enum: Object.values(WORK_MODE),
    required: true,
    default: WORK_MODE.ON_SITE,
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
