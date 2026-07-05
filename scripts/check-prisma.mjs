import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const prisma =
  url.startsWith("prisma+postgres://") || url.startsWith("prisma://")
    ? new PrismaClient({ accelerateUrl: url })
    : new PrismaClient({
        adapter: new PrismaPg({
          connectionString: url,
          max: 3,
          connectionTimeoutMillis: 5_000,
          idleTimeoutMillis: 300_000,
        }),
      });

try {
  for (let i = 1; i <= 5; i++) {
    const count = await prisma.article.count();
    console.log(`query ${i}: ${count} articles`);
  }
  console.log("ok");
} catch (error) {
  console.error("fail:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
