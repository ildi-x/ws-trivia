"use server";

import { db } from "@/lib/db";
import { sortHelpCenterCategories } from "@/components/quiz/category-utils";

export async function getQuizCategories() {
  const articles = await db.article.findMany({
    where: {
      facts: {
        some: {
          questions: { some: { status: "published" } },
        },
      },
    },
    distinct: ["category"],
    select: { category: true },
  });

  return sortHelpCenterCategories(articles.map((a) => a.category));
}

export type QuizStats = {
  questions: number;
  articlesProcessed: number;
};

export async function getQuizStats(): Promise<QuizStats> {
  const [questions, articlesProcessed] = await Promise.all([
    db.question.count({ where: { status: "published" } }),
    db.article.count({ where: { status: "processed" } }),
  ]);

  return { questions, articlesProcessed };
}

export async function getQuizQuestions(category?: string) {
  const questions = await db.question.findMany({
    where: {
      status: "published",
      ...(category ? { fact: { article: { category } } } : {}),
    },
    include: {
      fact: { include: { article: { select: { title: true, url: true, category: true } } } },
    },
  });

  const shuffled = questions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10).map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options as string[],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    articleTitle: q.fact.article.title,
    articleUrl: q.fact.article.url,
    category: q.fact.article.category,
  }));
}

export async function saveQuizResult(score: number, totalQuestions: number, category?: string) {
  await db.quizResult.create({
    data: { score, totalQuestions, category: category ?? null },
  });
}
