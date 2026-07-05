/**
 * Verify Supabase connection and row counts.
 */
import pg from "pg";

const url = process.env.SUPABASE_DATABASE_URL;

if (!url) {
  console.error("Missing SUPABASE_DATABASE_URL in .env");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ...(url.includes("supabase.co") ? { ssl: { rejectUnauthorized: false } } : {}),
});

try {
  await client.connect();
  const tables = ["Article", "Fact", "Question", "QuizResult"];
  for (const table of tables) {
    const { rows } = await client.query(`SELECT count(*)::int AS n FROM "${table}"`);
    console.log(`${table}: ${rows[0].n}`);
  }
} catch (error) {
  console.error("error:", error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
