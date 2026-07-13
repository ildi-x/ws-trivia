"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type QuestionsToolbarProps = {
  categories: string[];
  activeCategory?: string;
  search: string;
};

function buildQuestionsHref(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search?.trim()) params.set("q", search.trim());
  const query = params.toString();
  return query ? `/admin/questions?${query}` : "/admin/questions";
}

export function QuestionsToolbar({
  categories,
  activeCategory,
  search,
}: QuestionsToolbarProps) {
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  return (
    <div className="space-y-4">
      <form action="/admin/questions" method="get" className="flex flex-col gap-2 sm:flex-row">
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
          <ButtonLink href="/admin/questions" variant="outline">
            Clear filters
          </ButtonLink>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        <Link href={buildQuestionsHref(undefined, search)}>
          <Badge variant={!activeCategory ? "default" : "outline"}>All</Badge>
        </Link>
        {categories.map((category) => (
          <Link key={category} href={buildQuestionsHref(category, search)}>
            <Badge variant={activeCategory === category ? "default" : "outline"}>
              {category}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
