import { db } from "@/lib/db";
import { chatJson } from "./openai";
import { validateFact, type ExtractedFact } from "./validate";

const SYSTEM_PROMPT = `You extract atomic, verifiable facts from Wealthsimple Help Center articles.
Rules:
- Only extract facts explicitly supported by the article text
- Do not infer or hallucinate information not in the source
- Each fact must be a single standalone statement
- Assign importance 1-5 (5 = critical user-facing info)
- Return JSON: { "facts": [{ "text": string, "importance": number }] }
- Extract 3-10 facts depending on article length`;

type ExtractionResponse = { facts: ExtractedFact[] };

const MARKDOWN_CHAR_LIMIT = 110_000;

export async function extractFactsForArticle(articleId: string, force = false) {
  const article = await db.article.findUniqueOrThrow({ where: { id: articleId } });

  if (!force) {
    const existing = await db.fact.count({ where: { articleId } });
    if (existing > 0) return { created: 0, skipped: existing };
  } else {
    await db.fact.deleteMany({ where: { articleId } });
  }

  const result = await chatJson<ExtractionResponse>(
    SYSTEM_PROMPT,
    `Title: ${article.title}\n\nArticle content:\n${article.markdown.slice(0, MARKDOWN_CHAR_LIMIT)}`,
  );

  let created = 0;
  for (const fact of result.facts ?? []) {
    const error = validateFact(fact);
    if (error) {
      console.warn(`Rejected fact: ${error} — "${fact.text?.slice(0, 50)}"`);
      continue;
    }

    await db.fact.create({
      data: {
        articleId,
        text: fact.text.trim(),
        importance: fact.importance,
      },
    });
    created++;
  }

  await db.article.update({
    where: { id: articleId },
    data: { status: "processed" },
  });

  return { created, skipped: 0 };
}

export async function extractFactsBatch(options: {
  articleId?: string;
  limit?: number;
  force?: boolean;
}) {
  const where = options.articleId ? { id: options.articleId } : {};
  const articles = await db.article.findMany({
    where,
    take: options.limit,
    orderBy: { importedAt: "asc" },
  });

  let totalCreated = 0;
  for (const article of articles) {
    if (!options.force) {
      const count = await db.fact.count({ where: { articleId: article.id } });
      if (count > 0) {
        console.log(`Skipping ${article.title} — already has facts`);
        continue;
      }
    }

    console.log(`Extracting facts: ${article.title}`);
    const { created } = await extractFactsForArticle(article.id, options.force);
    totalCreated += created;
  }

  return totalCreated;
}
