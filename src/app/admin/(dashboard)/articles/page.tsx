import Link from "next/link";
import { ArticlesInfiniteList } from "@/components/admin/articles-infinite-list";
import { sortHelpCenterCategories } from "@/components/quiz/category-utils";
import { getArticlesPage, getArticlesTotalCount } from "@/lib/admin/article-queries";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;

  const [categoryRows, totalCount, initialPage] = await Promise.all([
    db.article.findMany({
      distinct: ["category"],
      select: { category: true },
    }),
    getArticlesTotalCount(category),
    getArticlesPage(category),
  ]);
  const categories = sortHelpCenterCategories(categoryRows.map((row) => row.category)).map(
    (name) => ({ category: name }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
        <p className="text-muted-foreground text-sm">
          {totalCount.toLocaleString()} articles in database
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/articles">
          <Badge variant={!category ? "default" : "outline"}>All</Badge>
        </Link>
        {categories.map((c) => (
          <Link
            key={c.category}
            href={`/admin/articles?category=${encodeURIComponent(c.category)}`}
          >
            <Badge variant={category === c.category ? "default" : "outline"}>
              {c.category}
            </Badge>
          </Link>
        ))}
      </div>

      <ArticlesInfiniteList
        key={category ?? "all"}
        initialArticles={initialPage.articles}
        initialHasMore={initialPage.hasMore}
        initialNextCursor={initialPage.nextCursor}
        category={category}
        totalCount={totalCount}
      />
    </div>
  );
}
