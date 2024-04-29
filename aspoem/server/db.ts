import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const db = globalForPrisma ?? new PrismaClient({
    log: ["query", "error", "warn"]
})


