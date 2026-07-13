"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PublishedQuestionsToolbarProps = {
  categories: string[];
  activeCategory?: string;
  search: string;
};

function buildPublishedHref(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search?.trim()) params.set("q", search.trim());
  const query = params.toString();
  return query ? `/admin/published?${query}` : "/admin/published";
}

export function PublishedQuestionsToolbar({
  categories,
  activeCategory,
  search,
}: PublishedQuestionsToolbarProps) {
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  return (
    <div className="space-y-4">
      <form action="/admin/published" method="get" className="flex flex-col gap-2 sm:flex-row">
        {activeCategory && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <Input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions and answers"
          className="sm:max-w-md"
        />
        <Button type="submit">Search</Button>
        {(search || activeCategory) && (
          <ButtonLink href="/admin/published" variant="outline">
            Clear filters
          </ButtonLink>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        <Link href={buildPublishedHref(undefined, search)}>
          <Badge variant={!activeCategory ? "default" : "outline"}>All</Badge>
        </Link>
        {categories.map((category) => (
          <Link key={category} href={buildPublishedHref(category, search)}>
            <Badge variant={activeCategory === category ? "default" : "outline"}>
              {category}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
