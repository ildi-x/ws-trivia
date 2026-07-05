"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { fetchMoreArticles } from "@/app/admin/(dashboard)/articles/actions";
import type { ArticleListItem } from "@/lib/admin/article-queries";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ArticlesInfiniteListProps = {
  initialArticles: ArticleListItem[];
  initialHasMore: boolean;
  initialNextCursor: string | null;
  category?: string;
  totalCount: number;
};

export function ArticlesInfiniteList({
  initialArticles,
  initialHasMore,
  initialNextCursor,
  category,
  totalCount,
}: ArticlesInfiniteListProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setArticles(initialArticles);
    setHasMore(initialHasMore);
    setNextCursor(initialNextCursor);
  }, [initialArticles, initialHasMore, initialNextCursor, category]);

  const loadMore = useCallback(() => {
    if (!hasMore || isPending || !nextCursor) return;

    startTransition(async () => {
      const result = await fetchMoreArticles(category, nextCursor);
      setArticles((prev) => [...prev, ...result.articles]);
      setHasMore(result.hasMore);
      setNextCursor(result.nextCursor);
    });
  }, [category, hasMore, isPending, nextCursor]);

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
    <div className="space-y-3">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground py-8 text-center">
                  No articles yet. Run <code className="text-xs">npm run scrape</code> to import.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="font-medium hover:underline"
                    >
                      {article.title}
                    </Link>
                  </TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    <Badge variant={article.status === "processed" ? "default" : "secondary"}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {article.lastModified
                      ? new Date(article.lastModified).toLocaleDateString("en-CA")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {articles.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-2">
          <p className="text-muted-foreground text-sm">
            Showing {articles.length.toLocaleString()} of {totalCount.toLocaleString()}
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
