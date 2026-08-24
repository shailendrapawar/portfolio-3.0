export const ENV = {
  db: {
    uri: process.env.MONGODB_URI || "",
    name: process.env.MONGODB_NAME || "",
  },
  app: {
    name: process.env.APP_NAME || "Portfolio",
  },
}
