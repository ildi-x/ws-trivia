import Link from "next/link";
import { CategoryStatsTable } from "@/components/admin/category-stats-table";
import { db } from "@/lib/db";
import { getCategoryStats } from "@/lib/admin/category-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type StatCard = {
  label: string;
  value: string;
  hint: string;
  href?: string;
};

export default async function AdminDashboardPage() {
  const [
    articlesScraped,
    articlesProcessed,
    articlesWithPublishedQuestions,
    factCount,
    factsWithQuestions,
    factsWithPublishedQuestions,
    draftCount,
    publishedCount,
    latestArticle,
    categoryStats,
  ] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { status: "processed" } }),
    db.article.count({
      where: { facts: { some: { questions: { some: { status: "published" } } } } },
    }),
    db.fact.count(),
    db.fact.count({ where: { questions: { some: {} } } }),
    db.fact.count({ where: { questions: { some: { status: "published" } } } }),
    db.question.count({ where: { status: "draft" } }),
    db.question.count({ where: { status: "published" } }),
    db.article.findFirst({
      orderBy: { importedAt: "desc" },
      select: { importedAt: true },
    }),
    getCategoryStats(),
  ]);

  const articlesPending = articlesScraped - articlesProcessed;
  const processedPct =
    articlesScraped > 0 ? Math.round((articlesProcessed / articlesScraped) * 100) : 0;

  const summaryStats: StatCard[] = [
    {
      label: "Total articles",
      value: articlesScraped.toLocaleString(),
      hint: `${articlesPending.toLocaleString()} awaiting fact extraction`,
      href: "/admin/articles",
    },
    {
      label: "Articles processed",
      value: `${articlesProcessed.toLocaleString()} / ${articlesScraped.toLocaleString()}`,
      hint: `${processedPct}% have facts extracted`,
    },
    {
      label: "Facts extracted",
      value: factCount.toLocaleString(),
      hint: `${factsWithQuestions.toLocaleString()} with questions generated`,
      href: "/admin/facts",
    },
    {
      label: "Pending questions",
      value: draftCount.toLocaleString(),
      hint: "Awaiting publish",
      href: "/admin/questions",
    },
    {
      label: "Questions published",
      value: publishedCount.toLocaleString(),
      hint: `From ${factsWithPublishedQuestions.toLocaleString()} facts generated across ${articlesWithPublishedQuestions.toLocaleString()} articles`,
      href: "/admin/published",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Manage articles, facts, and quiz questions.
        </p>
      </div>

      <section className="space-y-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {summaryStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
        {articlesScraped > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Fact extraction progress</span>
              <span>
                {articlesProcessed.toLocaleString()} / {articlesScraped.toLocaleString()} articles
              </span>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${processedPct}%` }}
              />
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
          By category
        </h2>
        <p className="text-muted-foreground text-sm">
          Articles published = articles with at least one published question in the quiz.
        </p>
        <CategoryStatsTable rows={categoryStats} />
      </section>

      {latestArticle && (
        <p className="text-muted-foreground text-sm">
          Last article imported:{" "}
          {latestArticle.importedAt.toLocaleString("en-CA", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value, hint, href }: StatCard) {
  const content = (
    <Card className={href ? "transition-colors hover:bg-muted/30" : undefined}>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <p className="text-muted-foreground text-xs leading-relaxed">{hint}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
