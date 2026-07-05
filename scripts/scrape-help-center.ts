import "dotenv/config";
import pLimit from "p-limit";
import { closeBrowser, fetchPageHtml } from "@/lib/scraper/browser";
import { parseArticleHtml } from "@/lib/scraper/parser";
import { fetchSitemapEntries } from "@/lib/scraper/sitemap";
import { getExistingLastModifiedMap, upsertArticle } from "@/lib/scraper/store";
import { disconnectDb } from "@/lib/db";
import {
  createStats,
  getNumberArg,
  logError,
  logProgress,
  parseArgs,
  sleep,
} from "@/lib/pipeline/runner";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const force = Boolean(args.full || args.force);
  const limit = getNumberArg(args, "limit", Infinity);
  const concurrency = getNumberArg(
    args,
    "concurrency",
    Number.parseInt(process.env.SCRAPE_CONCURRENCY ?? "2", 10),
  );
  const delayMs = getNumberArg(
    args,
    "delay",
    Number.parseInt(process.env.SCRAPE_DELAY_MS ?? "500", 10),
  );

  logProgress("Fetching sitemaps (help + promotions)...");
  const sitemapEntries = await fetchSitemapEntries();
  logProgress(`Found ${sitemapEntries.length} en-ca articles across both help centers`);

  const existingMap = await getExistingLastModifiedMap();

  const toFetch = sitemapEntries.filter((entry) => {
    if (force) return true;
    const existing = existingMap.get(entry.externalId);
    if (!existing) return true;
    if (!entry.lastmod || !existing) return true;
    return entry.lastmod > existing;
  });

  const targets = toFetch.slice(0, limit === Infinity ? undefined : limit);
  logProgress(`Fetching ${targets.length} articles (${concurrency} concurrent)`);

  const stats = createStats();
  stats.skipped = sitemapEntries.length - toFetch.length;

  const limiter = pLimit(concurrency);

  await Promise.all(
    targets.map((entry, index) =>
      limiter(async () => {
        stats.processed++;
        const prefix = `[${index + 1}/${targets.length}]`;

        try {
          const html = await fetchPageHtml(entry.url);
          const parsed = parseArticleHtml(html, entry.url);
          const result = await upsertArticle(parsed, entry.lastmod, force);

          if (result === "created") stats.succeeded++;
          else if (result === "updated") stats.succeeded++;
          else stats.skipped++;

          logProgress(`${prefix} ${result}: ${parsed.title}`);
        } catch (error) {
          stats.failed++;
          logError(`${prefix} Failed ${entry.url}`, error);
        }

        if (delayMs > 0) await sleep(delayMs);
      }),
    ),
  );

  await closeBrowser();
  await disconnectDb();

  logProgress("\n--- Scrape Summary ---");
  logProgress(`Created/Updated: ${stats.succeeded}`);
  logProgress(`Skipped: ${stats.skipped}`);
  logProgress(`Failed: ${stats.failed}`);

  const failureRate = stats.processed > 0 ? stats.failed / stats.processed : 0;
  if (failureRate > 0.05) {
    logError(`Failure rate ${(failureRate * 100).toFixed(1)}% exceeds 5% threshold`);
    process.exit(1);
  }
}

main().catch(async (error) => {
  logError("Scrape failed", error);
  await disconnectDb().catch(() => undefined);
  process.exit(1);
});
