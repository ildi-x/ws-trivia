"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { fetchMoreDraftQuestions } from "@/app/admin/(dashboard)/questions/actions";
import type { DraftQuestionRow } from "@/lib/admin/draft-question-queries";
import { QuestionReviewCard } from "@/components/admin/question-review-card";

type QuestionsInfiniteListProps = {
  initialQuestions: DraftQuestionRow[];
  initialHasMore: boolean;
  initialNextCursor: string | null;
  totalCount: number;
  category?: string;
  search?: string;
};

export function QuestionsInfiniteList({
  initialQuestions,
  initialHasMore,
  initialNextCursor,
  totalCount,
  category,
  search,
}: QuestionsInfiniteListProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuestions(initialQuestions);
    setHasMore(initialHasMore);
    setNextCursor(initialNextCursor);
  }, [initialQuestions, initialHasMore, initialNextCursor, category, search]);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  }, []);

  const updateQuestion = useCallback((updated: DraftQuestionRow) => {
    setQuestions((prev) =>
      prev.map((question) => (question.id === updated.id ? updated : question)),
    );
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || isPending || !nextCursor) return;

    startTransition(async () => {
      const result = await fetchMoreDraftQuestions({ category, search }, nextCursor);
      setQuestions((prev) => [...prev, ...result.questions]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    });
  }, [category, hasMore, isPending, nextCursor, search]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (questions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {category || search
          ? "No draft questions match your filters."
          : "No draft questions. Generate questions from articles with facts."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <QuestionReviewCard
        questions={questions}
        onRemove={removeQuestion}
        onUpdate={updateQuestion}
      />

      <div className="flex flex-col items-center gap-2 py-2">
        <p className="text-muted-foreground text-sm">
          Showing {questions.length.toLocaleString()} of {totalCount.toLocaleString()}
        </p>
        {hasMore && (
          <div ref={sentinelRef} className="text-muted-foreground text-xs">
            {isPending ? "Loading more…" : "Scroll for more"}
          </div>
        )}
      </div>
    </div>
  );
}
