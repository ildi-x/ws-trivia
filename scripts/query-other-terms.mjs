import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const rows = await client.query(`
  SELECT title, category, section, url
  FROM "Article"
  WHERE category = 'Other terms'
  ORDER BY title
`);

for (const row of rows.rows) {
  console.log(JSON.stringify(row));
}

await client.end();
