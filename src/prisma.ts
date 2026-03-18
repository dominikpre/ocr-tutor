import { PrismaClient } from "@prisma/client";

// Reuse a single Prisma client in development so hot reloads do not create a
// new database connection pool on every file change.
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// Prefer the existing singleton when present; otherwise create the first client.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In production the process is long-lived and loaded once, so there is no need
// to stash the client on globalThis.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
