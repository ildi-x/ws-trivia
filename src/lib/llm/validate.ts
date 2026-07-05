import type { Difficulty } from "@/generated/prisma/client";

export type ExtractedFact = {
  text: string;
  importance: number;
};

export type GeneratedQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
};

const MIN_FACT_LENGTH = 20;
const MIN_QUESTION_LENGTH = 10;

export function validateFact(fact: ExtractedFact): string | null {
  if (!fact.text || fact.text.trim().length < MIN_FACT_LENGTH) {
    return "Fact text too short";
  }
  if (fact.importance < 1 || fact.importance > 5) {
    return "Importance must be 1-5";
  }
  return null;
}

export function validateQuestion(q: GeneratedQuestion): string | null {
  if (!q.question || q.question.trim().length < MIN_QUESTION_LENGTH) {
    return "Question text too short";
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    return "Must have exactly 4 options";
  }
  if (q.options.some((o) => !o?.trim())) {
    return "Empty option detected";
  }
  const unique = new Set(q.options.map((o) => o.trim().toLowerCase()));
  if (unique.size !== 4) {
    return "Duplicate options detected";
  }
  if (q.correctAnswer < 0 || q.correctAnswer > 3) {
    return "correctAnswer must be 0-3";
  }
  if (!q.explanation?.trim()) {
    return "Explanation required";
  }
  if (!["easy", "medium", "hard"].includes(q.difficulty)) {
    return "Invalid difficulty";
  }
  return null;
}
