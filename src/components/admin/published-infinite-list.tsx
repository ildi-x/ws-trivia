"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { fetchMorePublishedQuestions } from "@/app/admin/(dashboard)/published/actions";
import type { PublishedQuestionRow } from "@/lib/admin/published-question-queries";
import { PublishedQuestionItem } from "@/components/admin/published-question-item";

type PublishedInfiniteListProps = {
  initialQuestions: PublishedQuestionRow[];
  initialHasMore: boolean;
  initialNextCursor: string | null;
  totalCount: number;
};

export function PublishedInfiniteList({
  initialQuestions,
  initialHasMore,
  initialNextCursor,
  totalCount,
}: PublishedInfiniteListProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuestions(initialQuestions);
    setHasMore(initialHasMore);
    setNextCursor(initialNextCursor);
  }, [initialQuestions, initialHasMore, initialNextCursor]);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || isPending || !nextCursor) return;

    startTransition(async () => {
      const result = await fetchMorePublishedQuestions(nextCursor);
      setQuestions((prev) => [...prev, ...result.questions]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    });
  }, [hasMore, isPending, nextCursor]);

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

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <PublishedQuestionItem
          key={question.id}
          question={question}
          disabled={isPending}
          onRemove={removeQuestion}
        />
      ))}

      {questions.length > 0 && (
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
      )}
    </div>
  );
}
