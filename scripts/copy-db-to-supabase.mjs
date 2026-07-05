/**
 * Copies all app data from local DATABASE_URL to SUPABASE_DATABASE_URL.
 * Local database is read-only — nothing is deleted locally.
 *
 * Run after: npm run db:supabase:schema
 */
import pg from "pg";

const SOURCE_URL =
  process.env.LOCAL_DATABASE_URL ?? process.env.DATABASE_URL;
const TARGET_URL = process.env.SUPABASE_DATABASE_URL;

const TABLES = ["Article", "Fact", "Question", "QuizResult"];

/** JSONB columns must be sent as JSON strings, not raw JS objects. */
function serializeCell(value) {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function requireUrl(name, url) {
  if (!url) {
    console.error(`Missing ${name} in .env`);
    process.exit(1);
  }
  if (url.startsWith("prisma+postgres://") || url.startsWith("prisma://")) {
    console.error(
      `${name} must be a plain postgres:// URL, not prisma+postgres.\n` +
        "Use the TCP URL from `npm run db:status` for local, or Supabase Direct URI for remote.",
    );
    process.exit(1);
  }
}

async function count(client, table) {
  const { rows } = await client.query(`SELECT count(*)::int AS n FROM "${table}"`);
  return rows[0].n;
}

async function copyTable(source, target, table) {
  const { rows } = await source.query(`SELECT * FROM "${table}"`);
  if (rows.length === 0) {
    console.log(`  ${table}: 0 rows (skipped)`);
    return 0;
  }

  const columns = Object.keys(rows[0]);
  const colList = columns.map((c) => `"${c}"`).join(", ");

  await target.query("BEGIN");
  try {
    await target.query(`DELETE FROM "${table}"`);

    const batchSize = 100;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const values = [];
      const placeholders = batch
        .map((row, rowIndex) => {
          const offset = rowIndex * columns.length;
          columns.forEach((col) => values.push(serializeCell(row[col])));
          const ph = columns.map((_, colIndex) => `$${offset + colIndex + 1}`).join(", ");
          return `(${ph})`;
        })
        .join(", ");

      await target.query(
        `INSERT INTO "${table}" (${colList}) VALUES ${placeholders}`,
        values,
      );
    }

    await target.query("COMMIT");
    console.log(`  ${table}: ${rows.length} rows copied`);
    return rows.length;
  } catch (error) {
    await target.query("ROLLBACK");
    throw error;
  }
}

requireUrl("DATABASE_URL (source)", SOURCE_URL);
requireUrl("SUPABASE_DATABASE_URL (target)", TARGET_URL);

if (SOURCE_URL === TARGET_URL) {
  console.error("Source and target URLs are the same — aborting.");
  process.exit(1);
}

const source = new pg.Client({
  connectionString: SOURCE_URL,
  ...(SOURCE_URL.includes("supabase.co") ? { ssl: { rejectUnauthorized: false } } : {}),
});
const target = new pg.Client({
  connectionString: TARGET_URL,
  ...(TARGET_URL.includes("supabase.co") ? { ssl: { rejectUnauthorized: false } } : {}),
});

try {
  console.log("Connecting…");
  await source.connect();
  await target.connect();

  console.log("\nSource counts:");
  for (const table of TABLES) {
    console.log(`  ${table}: ${await count(source, table)}`);
  }

  const targetArticles = await count(target, "Article");
  if (targetArticles > 0) {
    console.log(
      `\nTarget already has ${targetArticles} articles. Re-copy will replace Supabase data (local DB unchanged).`,
    );
  }

  console.log("\nCopying to Supabase…");
  for (const table of TABLES) {
    try {
      await copyTable(source, target, table);
    } catch (error) {
      throw new Error(`${table}: ${error.message}`);
    }
  }

  console.log("\nTarget counts:");
  for (const table of TABLES) {
    console.log(`  ${table}: ${await count(target, table)}`);
  }

  console.log("\nDone. Local database was not modified.");
} catch (error) {
  console.error("\nMigration failed:", error.message);
  process.exitCode = 1;
} finally {
  await source.end().catch(() => {});
  await target.end().catch(() => {});
}
