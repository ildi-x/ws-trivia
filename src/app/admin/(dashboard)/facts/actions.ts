"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { extractFactsForArticle } from "@/lib/llm/extract-facts";

export async function updateFactAction(factId: string, text: string, importance: number) {
  await db.fact.update({
    where: { id: factId },
    data: { text: text.trim(), importance },
  });
  revalidatePath("/admin/facts");
}

export async function deleteFactAction(factId: string) {
  await db.fact.delete({ where: { id: factId } });
  revalidatePath("/admin/facts");
}

export async function regenerateFactsAction(articleId: string) {
  await extractFactsForArticle(articleId, true);
  revalidatePath("/admin/facts");
}
