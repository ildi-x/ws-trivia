"use server";

import {
  getPublishedQuestionsPage,
  type PublishedQuestionRow,
} from "@/lib/admin/published-question-queries";
import { requireAdmin } from "@/lib/auth";

export async function fetchMorePublishedQuestions(cursor: string): Promise<{
  questions: PublishedQuestionRow[];
  hasMore: boolean;
  nextCursor: string | null;
}> {
  await requireAdmin();
  return getPublishedQuestionsPage(cursor);
}
