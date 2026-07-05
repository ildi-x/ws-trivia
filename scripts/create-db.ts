import { Client } from "pg";

const ADMIN_URL =
  process.env.ADMIN_DATABASE_URL ??
  "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

const DB_NAME = "wealthsimple_trivia";

async function main() {
  const client = new Client({ connectionString: ADMIN_URL });
  await client.connect();

  const existing = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [DB_NAME],
  );

  if (existing.rowCount === 0) {
    await client.query(`CREATE DATABASE ${DB_NAME}`);
    console.log(`Created database: ${DB_NAME}`);
  } else {
    console.log(`Database already exists: ${DB_NAME}`);
  }

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
