"use server";

import {
  getArticlesPage,
  type ArticleFilters,
  type ArticleListItem,
} from "@/lib/admin/article-queries";
import { requireAdmin } from "@/lib/auth";

export async function fetchMoreArticles(
  filters: ArticleFilters,
  cursor: string,
): Promise<{
  articles: ArticleListItem[];
  hasMore: boolean;
  nextCursor: string | null;
}> {
  await requireAdmin();
  return getArticlesPage(filters, cursor);
}
