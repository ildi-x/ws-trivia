import { db } from "@/lib/db";
import type { ArticleStatus } from "@/generated/prisma/client";

export const ARTICLES_PAGE_SIZE = 50;

export type ArticleListItem = {
  id: string;
  title: string;
  category: string;
  status: ArticleStatus;
  lastModified: string | null;
};

export async function getArticlesPage(category?: string, cursor?: string) {
  const where = category ? { category } : undefined;

  const batch = await db.article.findMany({
    where,
    orderBy: [{ lastModified: "desc" }, { id: "desc" }],
    take: ARTICLES_PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      lastModified: true,
    },
  });

  const hasMore = batch.length > ARTICLES_PAGE_SIZE;
  const items = hasMore ? batch.slice(0, ARTICLES_PAGE_SIZE) : batch;

  const articles: ArticleListItem[] = items.map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category,
    status: article.status,
    lastModified: article.lastModified?.toISOString() ?? null,
  }));

  return {
    articles,
    hasMore,
    nextCursor: articles.length > 0 ? articles[articles.length - 1]!.id : null,
  };
}

export async function getArticlesTotalCount(category?: string) {
  return db.article.count({
    where: category ? { category } : undefined,
  });
}
