import Link from "next/link";
import { PublishedInfiniteList } from "@/components/admin/published-infinite-list";
import {
  getPublishedQuestionsPage,
  getPublishedQuestionsTotalCount,
} from "@/lib/admin/published-question-queries";

export const dynamic = "force-dynamic";

export default async function AdminPublishedPage() {
  const [{ questions, hasMore, nextCursor }, totalCount] = await Promise.all([
    getPublishedQuestionsPage(),
    getPublishedQuestionsTotalCount(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Published</h1>
        <p className="text-muted-foreground text-sm">
          Live questions in the public quiz ({totalCount.toLocaleString()}). Unpublish to send back
          to the draft queue, or delete permanently.
        </p>
      </div>

      {totalCount === 0 ? (
        <p className="text-muted-foreground text-sm">No published questions yet.</p>
      ) : (
        <PublishedInfiniteList
          initialQuestions={questions}
          initialHasMore={hasMore}
          initialNextCursor={nextCursor}
          totalCount={totalCount}
        />
      )}

      <Link href="/" className="text-sm hover:underline">
        Test in public quiz →
      </Link>
    </div>
  );
}
