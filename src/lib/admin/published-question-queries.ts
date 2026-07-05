import { db } from "@/lib/db";

export const PUBLISHED_QUESTIONS_PAGE_SIZE = 50;

export type PublishedQuestionRow = {
  id: string;
  question: string;
  difficulty: string;
  category: string;
  articleId: string;
  articleTitle: string;
  publishedAt: string | null;
};

function mapQuestion(
  q: Awaited<ReturnType<typeof fetchPublishedBatch>>[number],
): PublishedQuestionRow {
  return {
    id: q.id,
    question: q.question,
    difficulty: q.difficulty,
    category: q.fact.article.category,
    articleId: q.fact.article.id,
    articleTitle: q.fact.article.title,
    publishedAt: q.publishedAt?.toISOString() ?? null,
  };
}

async function fetchPublishedBatch(cursor?: string) {
  return db.question.findMany({
    where: { status: "published" },
    include: {
      fact: { include: { article: { select: { id: true, title: true, category: true } } } },
    },
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: PUBLISHED_QUESTIONS_PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
}

export async function getPublishedQuestionsPage(cursor?: string) {
  const batch = await fetchPublishedBatch(cursor);
  const hasMore = batch.length > PUBLISHED_QUESTIONS_PAGE_SIZE;
  const items = hasMore ? batch.slice(0, PUBLISHED_QUESTIONS_PAGE_SIZE) : batch;
  const questions = items.map(mapQuestion);

  return {
    questions,
    hasMore,
    nextCursor: questions.length > 0 ? questions[questions.length - 1]!.id : null,
  };
}

export async function getPublishedQuestionsTotalCount() {
  return db.question.count({ where: { status: "published" } });
}
