import { db } from "@/lib/db";
import { FactEditor } from "@/components/admin/fact-editor";

export const dynamic = "force-dynamic";

export default async function AdminFactsPage() {
  const facts = await db.fact.findMany({
    include: { article: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const rows = facts.map((f) => ({
    id: f.id,
    text: f.text,
    importance: f.importance,
    articleId: f.article.id,
    articleTitle: f.article.title,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facts</h1>
        <p className="text-muted-foreground text-sm">
          Atomic facts extracted from Help Center articles ({rows.length} shown)
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No facts yet. Generate facts from an article in the Articles section.
        </p>
      ) : (
        <FactEditor facts={rows} />
      )}
    </div>
  );
}
