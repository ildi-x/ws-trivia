"use server";

import {
  getArticlesPage,
  type ArticleListItem,
} from "@/lib/admin/article-queries";

export async function fetchMoreArticles(
  category: string | undefined,
  cursor: string,
): Promise<{
  articles: ArticleListItem[];
  hasMore: boolean;
  nextCursor: string | null;
}> {
  return getArticlesPage(category, cursor);
}
