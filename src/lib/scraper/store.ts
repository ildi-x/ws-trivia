import { db } from "@/lib/db";
import type { ParsedArticle } from "./parser";

export type UpsertResult = "created" | "updated" | "skipped";

export async function upsertArticle(
  article: ParsedArticle,
  sitemapLastmod: Date | null,
  force = false,
): Promise<UpsertResult> {
  const existing = await db.article.findUnique({
    where: { externalId: article.externalId },
  });

  if (!existing) {
    await db.article.create({
      data: {
        externalId: article.externalId,
        title: article.title,
        url: article.url,
        category: article.category,
        section: article.section,
        rawHtml: article.rawHtml,
        markdown: article.markdown,
        links: article.links,
        lastModified: article.lastModified ?? sitemapLastmod,
        status: "imported",
      },
    });
    return "created";
  }

  const effectiveLastmod = article.lastModified ?? sitemapLastmod;
  const shouldUpdate =
    force ||
    (effectiveLastmod &&
      (!existing.lastModified || effectiveLastmod > existing.lastModified));

  if (!shouldUpdate) {
    return "skipped";
  }

  await db.article.update({
    where: { externalId: article.externalId },
    data: {
      title: article.title,
      url: article.url,
      category: article.category,
      section: article.section,
      rawHtml: article.rawHtml,
      markdown: article.markdown,
      links: article.links,
      lastModified: effectiveLastmod,
    },
  });

  return "updated";
}

export async function getExistingLastModifiedMap(): Promise<Map<string, Date | null>> {
  const articles = await db.article.findMany({
    select: { externalId: true, lastModified: true },
  });

  return new Map(articles.map((a) => [a.externalId, a.lastModified]));
}
