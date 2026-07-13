import { db } from "@/lib/db";
import { sortHelpCenterCategories } from "@/components/quiz/category-utils";
import type { Prisma } from "@/generated/prisma/client";

export const DRAFT_QUESTIONS_PAGE_SIZE = 50;

export type DraftQuestionRow = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  category: string;
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  factText: string;
};

export type DraftQuestionFilters = {
  category?: string;
  search?: string;
};

async function getDraftIdsMatchingOptions(search: string): Promise<string[]> {
  const rows = await db.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Question"
    WHERE status = 'draft'
      AND "options"::text ILIKE ${`%${search}%`}
  `;
  return rows.map((row) => row.id);
}

async function buildDraftWhere(
  filters: DraftQuestionFilters,
): Promise<Prisma.QuestionWhereInput> {
  const search = filters.search?.trim();
  const optionMatchIds = search ? await getDraftIdsMatchingOptions(search) : [];

  return {
    status: "draft",
    ...(filters.category
      ? { fact: { article: { category: filters.category } } }
      : {}),
    ...(search
      ? {
          OR: [
            { question: { contains: search, mode: "insensitive" } },
            { explanation: { contains: search, mode: "insensitive" } },
            ...(optionMatchIds.length > 0 ? [{ id: { in: optionMatchIds } }] : []),
          ],
        }
      : {}),
  };
}

function mapQuestion(
  q: Awaited<ReturnType<typeof fetchDraftBatch>>[number],
): DraftQuestionRow {
  return {
    id: q.id,
    question: q.question,
    options: q.options as string[],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: q.difficulty,
    category: q.fact.article.category,
    articleId: q.fact.article.id,
    articleTitle: q.fact.article.title,
    articleUrl: q.fact.article.url,
    factText: q.fact.text,
  };
}

async function fetchDraftBatch(cursor?: string, filters: DraftQuestionFilters = {}) {
  return db.question.findMany({
    where: await buildDraftWhere(filters),
    include: {
      fact: {
        include: {
          article: { select: { id: true, title: true, url: true, category: true } },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: DRAFT_QUESTIONS_PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
}

export async function getDraftQuestionCategories() {
  const rows = await db.article.findMany({
    where: { facts: { some: { questions: { some: { status: "draft" } } } } },
    distinct: ["category"],
    select: { category: true },
  });

  return sortHelpCenterCategories(rows.map((row) => row.category));
}

export async function getDraftQuestionsPage(
  cursor?: string,
  filters: DraftQuestionFilters = {},
) {
  const batch = await fetchDraftBatch(cursor, filters);
  const hasMore = batch.length > DRAFT_QUESTIONS_PAGE_SIZE;
  const items = hasMore ? batch.slice(0, DRAFT_QUESTIONS_PAGE_SIZE) : batch;
  const questions = items.map(mapQuestion);

  return {
    questions,
    hasMore,
    nextCursor: questions.length > 0 ? questions[questions.length - 1]!.id : null,
  };
}

export async function getDraftQuestionsTotalCount(filters: DraftQuestionFilters = {}) {
  return db.question.count({ where: await buildDraftWhere(filters) });
}
