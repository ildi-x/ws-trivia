"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { fetchMoreFacts } from "@/app/admin/(dashboard)/facts/actions";
import type { FactListItem } from "@/lib/admin/fact-queries";
import { FactEditor } from "@/components/admin/fact-editor";

type FactsInfiniteListProps = {
  initialFacts: FactListItem[];
  initialHasMore: boolean;
  initialNextCursor: string | null;
  totalCount: number;
  category?: string;
  search?: string;
};

export function FactsInfiniteList({
  initialFacts,
  initialHasMore,
  initialNextCursor,
  totalCount,
  category,
  search,
}: FactsInfiniteListProps) {
  const [facts, setFacts] = useState(initialFacts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFacts(initialFacts);
    setHasMore(initialHasMore);
    setNextCursor(initialNextCursor);
  }, [initialFacts, initialHasMore, initialNextCursor, category, search]);

  const removeFact = useCallback((id: string) => {
    setFacts((prev) => prev.filter((fact) => fact.id !== id));
  }, []);

  const updateFact = useCallback((id: string, text: string, importance: number) => {
    setFacts((prev) =>
      prev.map((fact) => (fact.id === id ? { ...fact, text, importance } : fact)),
    );
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || isPending || !nextCursor) return;

    startTransition(async () => {
      const result = await fetchMoreFacts({ category, search }, nextCursor);
      setFacts((prev) => [...prev, ...result.facts]);
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

  if (facts.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {category || search
          ? "No facts match your filters."
          : "No facts yet. Generate facts from an article in the Articles section."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <FactEditor facts={facts} onRemove={removeFact} onUpdate={updateFact} />

      <div className="flex flex-col items-center gap-2 py-2">
        <p className="text-muted-foreground text-sm">
          Showing {facts.length.toLocaleString()} of {totalCount.toLocaleString()}
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
