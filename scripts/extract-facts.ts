import "dotenv/config";
import { extractFactsBatch } from "@/lib/llm/extract-facts";
import { getNumberArg, logProgress, parseArgs } from "@/lib/pipeline/runner";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const limit = getNumberArg(args, "limit", Infinity);
  const force = Boolean(args.force);
  const articleId = typeof args["article-id"] === "string" ? args["article-id"] : undefined;

  logProgress("Starting fact extraction...");
  const created = await extractFactsBatch({
    articleId,
    limit: limit === Infinity ? undefined : limit,
    force,
  });

  logProgress(`Done. Created ${created} facts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
