import "dotenv/config";
import { db, disconnectDb } from "@/lib/db";

const CATEGORIES = ["Promotions", "Referrals"];

async function main() {
  const before = await db.question.groupBy({
    by: ["status"],
    where: {
      fact: { article: { category: { in: CATEGORIES } } },
    },
    _count: true,
  });

  const factCount = await db.fact.count({
    where: { article: { category: { in: CATEGORIES } } },
  });

  console.log("Before delete — questions by status:", before);
  console.log("Facts to keep:", factCount);

  const deleted = await db.question.deleteMany({
    where: {
      fact: { article: { category: { in: CATEGORIES } } },
    },
  });

  const remainingQuestions = await db.question.count({
    where: { fact: { article: { category: { in: CATEGORIES } } } },
  });

  const remainingFacts = await db.fact.count({
    where: { article: { category: { in: CATEGORIES } } },
  });

  console.log(`Deleted ${deleted.count} questions`);
  console.log(`Remaining — questions: ${remainingQuestions}, facts: ${remainingFacts}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => disconnectDb());
