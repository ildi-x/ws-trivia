import { db } from "@/lib/db";
import { sortHelpCenterCategories } from "@/components/quiz/category-utils";
import type { Prisma } from "@/generated/prisma/client";

export const FACTS_PAGE_SIZE = 50;

export type FactListItem = {
  id: string;
  text: string;
  importance: number;
  articleId: string;
  articleTitle: string;
  category: string;
};

export type FactFilters = {
  category?: string;
  search?: string;
};

function buildFactsWhere(filters: FactFilters = {}): Prisma.FactWhereInput {
  const search = filters.search?.trim();

  return {
    ...(filters.category ? { article: { category: filters.category } } : {}),
    ...(search ? { text: { contains: search, mode: "insensitive" } } : {}),
  };
}

export async function getFactCategories() {
  const rows = await db.article.findMany({
    where: { facts: { some: {} } },
    distinct: ["category"],
    select: { category: true },
  });

  return sortHelpCenterCategories(rows.map((row) => row.category));
}

export async function getFactsPage(filters: FactFilters = {}, cursor?: string) {
  const batch = await db.fact.findMany({
    where: buildFactsWhere(filters),
    include: {
      article: { select: { id: true, title: true, category: true } },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: FACTS_PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = batch.length > FACTS_PAGE_SIZE;
  const items = hasMore ? batch.slice(0, FACTS_PAGE_SIZE) : batch;

  const facts: FactListItem[] = items.map((fact) => ({
    id: fact.id,
    text: fact.text,
    importance: fact.importance,
    articleId: fact.article.id,
    articleTitle: fact.article.title,
    category: fact.article.category,
  }));

  return {
    facts,
    hasMore,
    nextCursor: facts.length > 0 ? facts[facts.length - 1]!.id : null,
  };
}

export async function getFactsTotalCount(filters: FactFilters = {}) {
  return db.fact.count({ where: buildFactsWhere(filters) });
}
