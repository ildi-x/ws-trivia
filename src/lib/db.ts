import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const log =
    process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);

  // Prisma Dev: use the prisma+postgres URL from `npx prisma dev ls`
  if (
    connectionString.startsWith("prisma+postgres://") ||
    connectionString.startsWith("prisma://")
  ) {
    return new PrismaClient({ accelerateUrl: connectionString, log: [...log] });
  }

  const adapter = new PrismaPg({
    connectionString,
    max: 3,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 300_000,
    ...(connectionString.includes("supabase.co")
      ? { ssl: { rejectUnauthorized: false } }
      : {}),
  });

  return new PrismaClient({ adapter, log: [...log] });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export async function disconnectDb() {
  await db.$disconnect();
}
