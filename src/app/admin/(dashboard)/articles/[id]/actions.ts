"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { closeBrowser, fetchPageHtml } from "@/lib/scraper/browser";
import { parseArticleHtml } from "@/lib/scraper/parser";
import { upsertArticle } from "@/lib/scraper/store";
import { extractFactsForArticle } from "@/lib/llm/extract-facts";
import { generateQuestionsForArticle } from "@/lib/llm/generate-questions";

export async function reprocessArticleAction(articleId: string) {
  const article = await db.article.findUniqueOrThrow({ where: { id: articleId } });
  const html = await fetchPageHtml(article.url);
  const parsed = parseArticleHtml(html, article.url);
  await upsertArticle(parsed, parsed.lastModified, true);
  await closeBrowser();
  revalidatePath(`/admin/articles/${articleId}`);
}

export async function generateFactsAction(articleId: string) {
  await extractFactsForArticle(articleId, true);
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/facts");
}

export async function generateQuestionsAction(articleId: string) {
  await generateQuestionsForArticle(articleId, false);
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/questions");
}
