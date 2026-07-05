/**
 * Applies Prisma migrations to Supabase (schema only, no data).
 * Requires SUPABASE_DATABASE_URL in .env — use the DIRECT connection from Supabase
 * (Project Settings → Database → Connection string → URI, not the pooler).
 */
import { spawnSync } from "node:child_process";

const url = process.env.SUPABASE_DATABASE_URL;

if (!url) {
  console.error(
    "Missing SUPABASE_DATABASE_URL in .env\n\n" +
      "Supabase → Project Settings → Database → Connection string → URI (Direct)\n" +
      "Example: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres\n" +
      "Or: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres",
  );
  process.exit(1);
}

console.log("Applying migrations to Supabase…");

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  env: { ...process.env, DATABASE_URL: url },
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
