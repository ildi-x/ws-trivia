# Wealthsimple Trivia

Interactive trivia game built from real Wealthsimple Help Center content.

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies and set up the database:
   ```bash
   npm install
   npx playwright install chromium
   npm run db:push
   ```

3. **Start the database** (required before the app or scripts can connect):
   ```bash
   npm run db:start
   ```
   Keep this terminal open. Check status anytime with `npm run db:status`.

   If you use Docker instead of Prisma Dev: `docker compose up -d` and set `DATABASE_URL` to `postgresql://ws:ws@localhost:5432/wealthsimple_trivia`.

4. Scrape Help Center articles:
   ```bash
   npm run scrape
   ```

5. Run the dev server (in a **separate** terminal, after the database is running):
   ```bash
   npm run dev
   ```

   If you see `Connection terminated unexpectedly`, the database is probably not running — start it with `npm run db:start`, then restart `npm run dev`.

   If `db:status` shows **running** but connections still fail, Prisma Dev may be stuck. Restart it:
   ```bash
   npm run db:restart
   npm run db:check
   ```
   Then restart `npm run dev`.

## Pipeline Scripts

| Command | Description |
|---|---|
| `npm run scrape` | Scrape Wealthsimple Help Center articles |
| `npm run extract-facts` | Extract facts from articles via OpenAI |
| `npm run generate-questions` | Generate trivia questions from facts |
| `npm run publish-questions` | Bulk publish approved questions |
| `npm run import-articles` | Import articles from JSON export |

### Script flags

- `--limit N` — process only N records
- `--force` — regenerate even if content exists
- `--full` — force re-fetch all articles (scraper)
- `--article-id <id>` — process a single article

## Admin

Visit `/admin` (default password: `changeme`, set via `ADMIN_PASSWORD`).

## Public Quiz

Visit `/` to play trivia using published questions.
