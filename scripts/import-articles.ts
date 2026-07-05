import "dotenv/config";
import { readFileSync } from "node:fs";
import { db } from "@/lib/db";
import { logProgress, parseArgs } from "@/lib/pipeline/runner";
import type { ParsedArticle } from "@/lib/scraper/parser";

type ImportPayload = {
  articles: Array<
    ParsedArticle & {
      links: string[];
    }
  >;
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const file = typeof args.file === "string" ? args.file : "articles-export.json";

  logProgress(`Importing articles from ${file}...`);
  const raw = readFileSync(file, "utf-8");
  const payload = JSON.parse(raw) as ImportPayload;

  let imported = 0;
  for (const article of payload.articles) {
    await db.article.upsert({
      where: { externalId: article.externalId },
      create: {
        externalId: article.externalId,
        title: article.title,
        url: article.url,
        category: article.category,
        section: article.section,
        rawHtml: article.rawHtml,
        markdown: article.markdown,
        links: article.links,
        lastModified: article.lastModified,
        status: "imported",
      },
      update: {
        title: article.title,
        url: article.url,
        category: article.category,
        section: article.section,
        rawHtml: article.rawHtml,
        markdown: article.markdown,
        links: article.links,
        lastModified: article.lastModified,
      },
    });
    imported++;
  }

  logProgress(`Imported ${imported} articles.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
