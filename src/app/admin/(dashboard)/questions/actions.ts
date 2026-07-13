"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { Difficulty } from "@/generated/prisma/client";
import {
  getDraftQuestionsPage,
  type DraftQuestionFilters,
  type DraftQuestionRow,
} from "@/lib/admin/draft-question-queries";

function revalidateQuestionPaths() {
  revalidatePath("/admin/questions");
  revalidatePath("/admin/published");
  revalidatePath("/admin");
  revalidatePath("/admin/articles", "layout");
  revalidatePath("/");
}

export async function fetchMoreDraftQuestions(
  filters: DraftQuestionFilters,
  cursor: string,
): Promise<{
  questions: DraftQuestionRow[];
  hasMore: boolean;
  nextCursor: string | null;
}> {
  await requireAdmin();
  return getDraftQuestionsPage(cursor, filters);
}

export async function approveQuestionAction(questionId: string) {
  await requireAdmin();
  await db.question.update({
    where: { id: questionId },
    data: { status: "published", publishedAt: new Date() },
  });
  revalidateQuestionPaths();
}

export async function unpublishQuestionAction(questionId: string) {
  await requireAdmin();
  await db.question.update({
    where: { id: questionId },
    data: { status: "draft", publishedAt: null },
  });
  revalidateQuestionPaths();
}

export async function deleteQuestionAction(questionId: string) {
  await requireAdmin();
  await db.question.delete({ where: { id: questionId } });
  revalidateQuestionPaths();
}

export async function publishQuestionAction(questionId: string) {
  await requireAdmin();
  await db.question.update({
    where: { id: questionId },
    data: { status: "published", publishedAt: new Date() },
  });
  revalidateQuestionPaths();
}

export async function updateQuestionAction(
  questionId: string,
  data: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: Difficulty;
  },
) {
  await requireAdmin();
  await db.question.update({
    where: { id: questionId },
    data: {
      question: data.question.trim(),
      options: data.options,
      correctAnswer: data.correctAnswer,
      explanation: data.explanation.trim(),
      difficulty: data.difficulty,
    },
  });
  revalidateQuestionPaths();
}
