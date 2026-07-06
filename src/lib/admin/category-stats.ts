import { sortHelpCenterCategories } from "@/components/quiz/category-utils";
import { db } from "@/lib/db";

export type CategoryStatsRow = {
  category: string;
  articles: number;
  publishedArticles: number;
  facts: number;
  questions: number;
};

export async function getCategoryStats(): Promise<CategoryStatsRow[]> {
  const rows = await db.$queryRaw<CategoryStatsRow[]>`
    SELECT
      a.category,
      count(DISTINCT a.id)::int AS articles,
      count(DISTINCT a.id) FILTER (WHERE q.status = 'published')::int AS "publishedArticles",
      count(DISTINCT f.id)::int AS facts,
      count(DISTINCT q.id) FILTER (WHERE q.status = 'published')::int AS questions
    FROM "Article" a
    LEFT JOIN "Fact" f ON f."articleId" = a.id
    LEFT JOIN "Question" q ON q."factId" = f.id
    GROUP BY a.category
  `;

  const byCategory = new Map(rows.map((row) => [row.category, row]));
  const sortedCategories = sortHelpCenterCategories(rows.map((row) => row.category));

  return sortedCategories.map((category) => byCategory.get(category)!);
}

export function sumCategoryStats(rows: CategoryStatsRow[]) {
  return rows.reduce(
    (totals, row) => ({
      articles: totals.articles + row.articles,
      publishedArticles: totals.publishedArticles + row.publishedArticles,
      facts: totals.facts + row.facts,
      questions: totals.questions + row.questions,
    }),
    { articles: 0, publishedArticles: 0, facts: 0, questions: 0 },
  );
}
