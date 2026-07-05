import { db } from "@/lib/db";

export async function unprocessArticle(articleId: string) {
  const deleted = await db.fact.deleteMany({ where: { articleId } });

  await db.article.update({
    where: { id: articleId },
    data: { status: "imported" },
  });

  return { deletedFacts: deleted.count };
}
