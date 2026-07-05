import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const total = await client.query('SELECT count(*)::int AS n FROM "Article"');
const byCategory = await client.query(`
  SELECT category, count(*)::int AS n
  FROM "Article"
  WHERE url LIKE '%promotions.wealthsimple.com%'
  GROUP BY category
  ORDER BY category
`);

console.log("Total articles:", total.rows[0].n);
console.log("Promotions host by category:", byCategory.rows);

await client.end();
