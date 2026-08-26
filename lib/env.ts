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
  cron: {
    secret: process.env.CRON_SECRET || "",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    folder: process.env.CLOUDINARY_FOLDER || "portfolio",
  },
  mail: {
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    // Secure (implicit TLS) is used for port 465; STARTTLS otherwise.
    secure: process.env.MAIL_SECURE === "true",
    user: process.env.MAIL_USER || "",
    password: process.env.MAIL_PASSWORD || "",
    // Address shown in the From header; defaults to the auth user.
    from: process.env.MAIL_FROM || process.env.MAIL_USER || "",
    // Where contact-form notifications are delivered; defaults to the auth user.
    to: process.env.MAIL_TO || process.env.MAIL_USER || "",
  },
}
