export const UPLOAD_STATUS = {
  // Uploaded to Cloudinary but not yet attached to a project.
  PENDING: "pending",
  // Attached to a successfully created project.
  ACTIVE: "active",
} as const
