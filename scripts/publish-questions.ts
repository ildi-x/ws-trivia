import "dotenv/config";
import { db } from "@/lib/db";
import { logProgress, parseArgs } from "@/lib/pipeline/runner";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const draftsOnly = !args.all;

  const result = await db.question.updateMany({
    where: draftsOnly ? { status: "draft" } : { status: { in: ["draft", "approved"] } },
    data: { status: "published", publishedAt: new Date() },
  });

  logProgress(`Published ${result.count} questions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
