import { QuestionsInfiniteList } from "@/components/admin/questions-infinite-list";
import { QuestionsToolbar } from "@/components/admin/questions-toolbar";
import {
  getDraftQuestionCategories,
  getDraftQuestionsPage,
  getDraftQuestionsTotalCount,
} from "@/lib/admin/draft-question-queries";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const search = params.q?.trim() || undefined;
  const filters = { category, search };

  const [{ questions, hasMore, nextCursor }, totalCount, categories] = await Promise.all([
    getDraftQuestionsPage(undefined, filters),
    getDraftQuestionsTotalCount(filters),
    getDraftQuestionCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pending Questions</h1>
        <p className="text-muted-foreground text-sm">
          Publish, edit, or delete draft questions before they go live (
          {totalCount.toLocaleString()}
          {category || search ? " matching filters" : " in queue"})
        </p>
      </div>

      <QuestionsToolbar
        categories={categories}
        activeCategory={category}
        search={search ?? ""}
      />

      <QuestionsInfiniteList
        key={`${category ?? "all"}-${search ?? ""}`}
        initialQuestions={questions}
        initialHasMore={hasMore}
        initialNextCursor={nextCursor}
        totalCount={totalCount}
        category={category}
        search={search}
      />
    </div>
  );
}
