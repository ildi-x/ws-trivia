import { db } from "@/lib/db";
import type { Difficulty } from "@/generated/prisma/client";
import { chatJson } from "./openai";
import { validateQuestion, type GeneratedQuestion } from "./validate";

const SYSTEM_PROMPT = `You generate multiple-choice trivia questions from a single fact about Wealthsimple.
Rules:
- Generate 1-3 questions per fact
- Each question must have exactly 4 options
- correctAnswer is the 0-based index of the correct option
- Explanation must cite the source fact
- difficulty: easy, medium, or hard
- Do not introduce information beyond the fact
- Return JSON: { "questions": [{ "question", "options", "correctAnswer", "explanation", "difficulty" }] }`;

type GenerationResponse = { questions: GeneratedQuestion[] };

export async function generateQuestionsForFact(factId: string, force = false) {
  const fact = await db.fact.findUniqueOrThrow({
    where: { id: factId },
    include: { article: true },
  });

  if (!force) {
    const existing = await db.question.count({ where: { factId } });
    if (existing > 0) return { created: 0 };
  } else {
    await db.question.deleteMany({ where: { factId } });
  }

  const result = await chatJson<GenerationResponse>(
    SYSTEM_PROMPT,
    `Article: ${fact.article.title}\nFact: ${fact.text}`,
  );

  let created = 0;
  for (const q of result.questions ?? []) {
    const error = validateQuestion(q);
    if (error) {
      console.warn(`Rejected question: ${error}`);
      continue;
    }

    await db.question.create({
      data: {
        factId,
        question: q.question.trim(),
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation.trim(),
        difficulty: q.difficulty as Difficulty,
        status: "draft",
      },
    });
    created++;
  }

  return { created };
}

export async function generateQuestionsForArticle(articleId: string, force = false) {
  const facts = await db.fact.findMany({ where: { articleId } });
  let total = 0;
  for (const fact of facts) {
    const { created } = await generateQuestionsForFact(fact.id, force);
    total += created;
  }
  return total;
}

export async function generateQuestionsBatch(options: {
  articleId?: string;
  factId?: string;
  limit?: number;
  force?: boolean;
}) {
  if (options.factId) {
    return generateQuestionsForFact(options.factId, options.force);
  }

  const facts = await db.fact.findMany({
    where: options.articleId ? { articleId: options.articleId } : {},
    take: options.limit,
    include: { questions: { select: { id: true } } },
  });

  let totalCreated = 0;
  for (const fact of facts) {
    if (!options.force && fact.questions.length > 0) continue;
    console.log(`Generating questions for fact: ${fact.text.slice(0, 60)}...`);
    const { created } = await generateQuestionsForFact(fact.id, options.force);
    totalCreated += created;
  }

  return { created: totalCreated };
}
