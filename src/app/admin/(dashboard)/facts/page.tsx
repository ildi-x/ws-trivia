import { FactsInfiniteList } from "@/components/admin/facts-infinite-list";
import { FactsToolbar } from "@/components/admin/facts-toolbar";
import {
  getFactCategories,
  getFactsPage,
  getFactsTotalCount,
} from "@/lib/admin/fact-queries";

export const dynamic = "force-dynamic";

export default async function AdminFactsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const search = params.q?.trim() || undefined;
  const filters = { category, search };

  const [{ facts, hasMore, nextCursor }, totalCount, categories] = await Promise.all([
    getFactsPage(filters),
    getFactsTotalCount(filters),
    getFactCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facts</h1>
        <p className="text-muted-foreground text-sm">
          Atomic facts extracted from Help Center articles ({totalCount.toLocaleString()}
          {category || search ? " matching filters" : ""})
        </p>
      </div>

      <FactsToolbar
        categories={categories}
        activeCategory={category}
        search={search ?? ""}
      />

      <FactsInfiniteList
        key={`${category ?? "all"}-${search ?? ""}`}
        initialFacts={facts}
        initialHasMore={hasMore}
        initialNextCursor={nextCursor}
        totalCount={totalCount}
        category={category}
        search={search}
      />
    </div>
  );
}
