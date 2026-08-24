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
    secret: process.env.AUTH_SECRET || "",

    seedAdmin: {
      name: process.env.SEED_ADMIN_NAME || "shailendra pawar",
      email: process.env.SEED_ADMIN_EMAIL || "shailendrapawar.dev@gmail.com",
      password: process.env.SEED_ADMIN_PASSWORD || "uk04ac2006",
    },
  },
}
