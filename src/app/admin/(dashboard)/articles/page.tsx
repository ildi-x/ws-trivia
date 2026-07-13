import { ArticlesInfiniteList } from "@/components/admin/articles-infinite-list";
import { ArticlesToolbar } from "@/components/admin/articles-toolbar";
import { sortHelpCenterCategories } from "@/components/quiz/category-utils";
import { getArticlesPage, getArticlesTotalCount } from "@/lib/admin/article-queries";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const search = params.q?.trim() || undefined;
  const filters = { category, search };

  const [categoryRows, totalCount, initialPage] = await Promise.all([
    db.article.findMany({
      distinct: ["category"],
      select: { category: true },
    }),
    getArticlesTotalCount(filters),
    getArticlesPage(filters),
  ]);
  const categories = sortHelpCenterCategories(categoryRows.map((row) => row.category));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
        <p className="text-muted-foreground text-sm">
          {totalCount.toLocaleString()} articles
          {category || search ? " matching filters" : " in database"}
        </p>
      </div>

      <ArticlesToolbar
        categories={categories}
        activeCategory={category}
        search={search ?? ""}
      />

      <ArticlesInfiniteList
        key={`${category ?? "all"}-${search ?? ""}`}
        initialArticles={initialPage.articles}
        initialHasMore={initialPage.hasMore}
        initialNextCursor={initialPage.nextCursor}
        category={category}
        search={search}
        totalCount={totalCount}
      />
    </div>
  );
}
