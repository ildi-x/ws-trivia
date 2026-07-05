"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { closeBrowser, fetchPageHtml } from "@/lib/scraper/browser";
import { parseArticleHtml } from "@/lib/scraper/parser";
import { upsertArticle } from "@/lib/scraper/store";
import { extractFactsForArticle } from "@/lib/llm/extract-facts";
import { generateQuestionsForArticle } from "@/lib/llm/generate-questions";
import { unprocessArticle } from "@/lib/admin/unprocess-article";
import { requireAdmin } from "@/lib/auth";

export async function reprocessArticleAction(articleId: string) {
  await requireAdmin();
  const article = await db.article.findUniqueOrThrow({ where: { id: articleId } });
  const html = await fetchPageHtml(article.url);
  const parsed = parseArticleHtml(html, article.url);
  await upsertArticle(parsed, parsed.lastModified, true);
  await closeBrowser();
  revalidatePath(`/admin/articles/${articleId}`);
}

export async function generateFactsAction(articleId: string) {
  await requireAdmin();
  await extractFactsForArticle(articleId, true);
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/facts");
}

export async function generateQuestionsAction(articleId: string) {
  await requireAdmin();
  await generateQuestionsForArticle(articleId, false);
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/questions");
}

export async function unprocessArticleAction(articleId: string) {
  await requireAdmin();
  await unprocessArticle(articleId);
  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin/articles");
  revalidatePath("/admin/facts");
  revalidatePath("/admin/questions");
  revalidatePath("/admin/published");
  revalidatePath("/admin");
}
