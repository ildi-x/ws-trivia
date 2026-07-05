import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleActions } from "@/components/admin/article-actions";

export default async function AdminArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await db.article.findUnique({
    where: { id },
    include: {
      facts: {
        include: { questions: true },
        orderBy: { importance: "desc" },
      },
    },
  });

  if (!article) notFound();

  const questionCount = article.facts.reduce(
    (total, fact) => total + fact.questions.length,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/admin/articles" className="text-muted-foreground text-sm hover:underline">
            ← Articles
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{article.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge>{article.category}</Badge>
            {article.section && <Badge variant="outline">{article.section}</Badge>}
            <Badge variant={article.status === "processed" ? "default" : "secondary"}>
              {article.status}
            </Badge>
          </div>
        </div>
        <ArticleActions
          articleId={article.id}
          factCount={article.facts.length}
          questionCount={questionCount}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">URL: </span>
              <a href={article.url} target="_blank" rel="noreferrer" className="hover:underline">
                View on Help Center
              </a>
            </p>
            <p>
              <span className="text-muted-foreground">External ID: </span>
              {article.externalId}
            </p>
            <p>
              <span className="text-muted-foreground">Last modified: </span>
              {article.lastModified?.toLocaleString("en-CA") ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Imported: </span>
              {article.importedAt.toLocaleString("en-CA")}
            </p>
            <p>
              <span className="text-muted-foreground">Links: </span>
              {(article.links as string[]).length}
            </p>
            <p>
              <span className="text-muted-foreground">Facts: </span>
              {article.facts.length}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Extracted Facts</CardTitle>
          </CardHeader>
          <CardContent>
            {article.facts.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No facts yet. Click &quot;Generate Facts&quot; to extract from this article.
              </p>
            ) : (
              <ul className="space-y-3">
                {article.facts.map((fact) => (
                  <li key={fact.id} className="border-b pb-3 last:border-0">
                    <p className="text-sm">{fact.text}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Importance {fact.importance} · {fact.questions.length} question(s)
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Markdown Content</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm prose-zinc max-w-none dark:prose-invert">
          <ReactMarkdown>{article.markdown}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
