"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FactsToolbarProps = {
  categories: string[];
  activeCategory?: string;
  search: string;
};

function buildFactsHref(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search?.trim()) params.set("q", search.trim());
  const query = params.toString();
  return query ? `/admin/facts?${query}` : "/admin/facts";
}

export function FactsToolbar({
  categories,
  activeCategory,
  search,
}: FactsToolbarProps) {
  const [query, setQuery] = useState(search);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  return (
    <div className="space-y-4">
      <form action="/admin/facts" method="get" className="flex flex-col gap-2 sm:flex-row">
        {activeCategory && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <Input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search facts"
          className="sm:max-w-md"
        />
        <Button type="submit">Search</Button>
        {(search || activeCategory) && (
          <ButtonLink href="/admin/facts" variant="outline">
            Clear filters
          </ButtonLink>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        <Link href={buildFactsHref(undefined, search)}>
          <Badge variant={!activeCategory ? "default" : "outline"}>All</Badge>
        </Link>
        {categories.map((category) => (
          <Link key={category} href={buildFactsHref(category, search)}>
            <Badge variant={activeCategory === category ? "default" : "outline"}>
              {category}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
