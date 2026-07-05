"use server";

import {
  getArticlesPage,
  type ArticleListItem,
} from "@/lib/admin/article-queries";
import { requireAdmin } from "@/lib/auth";

export async function fetchMoreArticles(
  category: string | undefined,
  cursor: string,
): Promise<{
  articles: ArticleListItem[];
  hasMore: boolean;
  nextCursor: string | null;
}> {
  await requireAdmin();
  return getArticlesPage(category, cursor);
}
