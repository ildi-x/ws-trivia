import Link from "next/link";
import { db } from "@/lib/db";
import { PublishedQuestionCard } from "@/components/admin/published-question-card";

export const dynamic = "force-dynamic";

export default async function AdminPublishedPage() {
  const questions = await db.question.findMany({
    where: { status: "published" },
    include: {
      fact: { include: { article: { select: { title: true, category: true } } } },
    },
    orderBy: { publishedAt: "desc" },
    take: 100,
  });

  const rows = questions.map((q) => ({
    id: q.id,
    question: q.question,
    difficulty: q.difficulty,
    category: q.fact.article.category,
    articleTitle: q.fact.article.title,
    publishedAt: q.publishedAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Published</h1>
        <p className="text-muted-foreground text-sm">
          Live questions in the public quiz ({rows.length}). Unpublish to send back to
          the draft queue, or delete permanently.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">No published questions yet.</p>
      ) : (
        <PublishedQuestionCard questions={rows} />
      )}

      <Link href="/" className="text-sm hover:underline">
        Test in public quiz →
      </Link>
    </div>
  );
}
