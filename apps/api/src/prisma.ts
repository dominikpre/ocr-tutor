import { PrismaClient } from "@prisma/client";
import { config } from "./config.js";

// Use the resolved runtime config directly so the service can boot without a
// .env file when the local Compose defaults are acceptable.
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
});
