import { config } from "dotenv"

config({ path: ".env.local" })

export const ENV = {
  db: {
    uri: process.env.MONGODB_URI || "http://localhost:27017/portfolio",
    name: process.env.MONGODB_NAME || "portfolio",
  },
  app: {
    name: process.env.APP_NAME || "Portfolio",
  },
  auth: {
    saltRounds: process.env.AUTH_SALT_ROUNDS || 10,
    // Secrets have no in-source defaults — set them in .env.local.
    secret: process.env.AUTH_SECRET || "",

    seedAdmin: {
      name: process.env.SEED_ADMIN_NAME || "",
      email: process.env.SEED_ADMIN_EMAIL || "",
      password: process.env.SEED_ADMIN_PASSWORD || "",
    },
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    folder: process.env.CLOUDINARY_FOLDER || "portfolio",
  },
}
