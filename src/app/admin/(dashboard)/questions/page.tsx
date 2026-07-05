import { db } from "@/lib/db";
import { QuestionReviewCard } from "@/components/admin/question-review-card";

export const dynamic = "force-dynamic";

export default async function AdminQuestionsPage() {
  const questions = await db.question.findMany({
    where: { status: "draft" },
    include: {
      fact: {
        include: { article: { select: { title: true, url: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const rows = questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options as string[],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: q.difficulty,
    articleTitle: q.fact.article.title,
    articleUrl: q.fact.article.url,
    factText: q.fact.text,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Questions</h1>
        <p className="text-muted-foreground text-sm">
          Review draft questions. Click Publish to make them live in the public quiz ({rows.length} in queue)
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No draft questions. Generate questions from articles with facts.
        </p>
      ) : (
        <QuestionReviewCard questions={rows} />
      )}
    </div>
  );
}
