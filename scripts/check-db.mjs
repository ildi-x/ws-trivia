import pg from "pg";

const url =
  process.argv[2] ??
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@127.0.0.1:51214/wealthsimple_trivia?sslmode=disable";

const client = new pg.Client({
  connectionString: url,
  ...(url.includes("supabase.co") ? { ssl: { rejectUnauthorized: false } } : {}),
});

try {
  await client.connect();
  const db = await client.query(
    "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname",
  );
  console.log("databases:", db.rows.map((r) => r.datname).join(", "));

  const count = await client.query('SELECT count(*)::int AS n FROM "Article"');
  console.log("articles:", count.rows[0].n);
} catch (error) {
  console.error("error:", error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
