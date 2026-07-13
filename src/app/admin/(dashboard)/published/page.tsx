import Link from "next/link";
import { PublishedInfiniteList } from "@/components/admin/published-infinite-list";
import { PublishedQuestionsToolbar } from "@/components/admin/published-questions-toolbar";
import {
  getPublishedQuestionCategories,
  getPublishedQuestionsPage,
  getPublishedQuestionsTotalCount,
} from "@/lib/admin/published-question-queries";

export const dynamic = "force-dynamic";

export default async function AdminPublishedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const search = params.q?.trim() || undefined;
  const filters = { category, search };

  const [{ questions, hasMore, nextCursor }, totalCount, categories] = await Promise.all([
    getPublishedQuestionsPage(undefined, filters),
    getPublishedQuestionsTotalCount(filters),
    getPublishedQuestionCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Published Questions</h1>
        <p className="text-muted-foreground text-sm">
          Questions available on the site ({totalCount.toLocaleString()}
          {category || search ? " matching filters" : ""}). Edit, unpublish, or delete as needed.
        </p>
      </div>

      <PublishedQuestionsToolbar
        categories={categories}
        activeCategory={category}
        search={search ?? ""}
      />

      {totalCount === 0 ? (
        <p className="text-muted-foreground text-sm">
          {category || search
            ? "No published questions match your filters."
            : "No published questions yet."}
        </p>
      ) : (
        <PublishedInfiniteList
          key={`${category ?? "all"}-${search ?? ""}`}
          initialQuestions={questions}
          initialHasMore={hasMore}
          initialNextCursor={nextCursor}
          totalCount={totalCount}
          category={category}
          search={search}
        />
      )}

      <Link href="/" className="text-sm hover:underline">
        Test in public quiz →
      </Link>
    </div>
  );
}
