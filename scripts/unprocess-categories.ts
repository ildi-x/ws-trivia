import "dotenv/config";
import { db, disconnectDb } from "@/lib/db";

const CATEGORIES = ["Promotions", "Referrals"];

async function main() {
  const articles = await db.article.findMany({
    where: { category: { in: CATEGORIES } },
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      _count: { select: { facts: true } },
    },
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  if (articles.length === 0) {
    console.log("No articles found in Promotions or Referrals.");
    return;
  }

  const factCount = articles.reduce((sum, article) => sum + article._count.facts, 0);
  const processedCount = articles.filter((article) => article.status === "processed").length;

  console.log(
    `Unprocessing ${articles.length} articles (${processedCount} processed, ${factCount} facts)…`,
  );

  const deletedFacts = await db.fact.deleteMany({
    where: { article: { category: { in: CATEGORIES } } },
  });

  const updatedArticles = await db.article.updateMany({
    where: { category: { in: CATEGORIES } },
    data: { status: "imported" },
  });

  const remainingFacts = await db.fact.count({
    where: { article: { category: { in: CATEGORIES } } },
  });

  const remainingQuestions = await db.question.count({
    where: { fact: { article: { category: { in: CATEGORIES } } } },
  });

  console.log(`Deleted ${deletedFacts.count} facts (and their questions)`);
  console.log(`Reset ${updatedArticles.count} articles to imported`);
  console.log(`Remaining — facts: ${remainingFacts}, questions: ${remainingQuestions}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => disconnectDb());
