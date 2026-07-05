import "dotenv/config";
import { generateQuestionsBatch } from "@/lib/llm/generate-questions";
import { getNumberArg, logProgress, parseArgs } from "@/lib/pipeline/runner";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const limit = getNumberArg(args, "limit", Infinity);
  const force = Boolean(args.force);
  const articleId = typeof args["article-id"] === "string" ? args["article-id"] : undefined;
  const factId = typeof args["fact-id"] === "string" ? args["fact-id"] : undefined;

  logProgress("Starting question generation...");
  const result = await generateQuestionsBatch({
    articleId,
    factId,
    limit: limit === Infinity ? undefined : limit,
    force,
  });

  const created = "created" in result ? result.created : 0;
  logProgress(`Done. Created ${created} questions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
