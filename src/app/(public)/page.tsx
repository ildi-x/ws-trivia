import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CategoryCard } from "@/components/quiz/category-card";
import { getQuizCategories, getQuizStats } from "@/app/(public)/actions";
import { HELP_CENTER_HOME_URL } from "@/lib/scraper/url";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, stats] = await Promise.all([getQuizCategories(), getQuizStats()]);

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-muted-foreground mb-5 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border/60 bg-card/50 px-3.5 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
            <Sparkles className="size-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
            <span>
              Built from real{" "}
              <a
                href={HELP_CENTER_HOME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-opacity hover:opacity-80"
              >
                help center
              </a>{" "}
              articles
            </span>
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.08] lg:text-[3.25rem]">
            Learn Wealthsimple
            <span className="text-muted-foreground block sm:inline sm:ml-2">
              by playing trivia
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
            Test your knowledge across products, services, and policies. Each answer includes a direct link to the relevant help center article.
          </p>
          {stats.publishedQuestions > 0 && (
            <p className="text-muted-foreground/80 mt-4 text-sm tracking-tight">
              {stats.publishedQuestions.toLocaleString("en-CA")} questions published from{" "}
              {stats.publishedArticles.toLocaleString("en-CA")} help center{" "}
              {stats.publishedArticles === 1 ? "article" : "articles"}
            </p>
          )}
        </section>

        <section className="mt-14 sm:mt-20">
          {categories.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-2xl border bg-card/80 p-10 text-center shadow-sm backdrop-blur-sm">
              <p className="text-muted-foreground leading-relaxed">
                No quizzes available yet. Publish questions in the admin dashboard to get
                started.
              </p>
              <Link
                href="/admin"
                className="text-foreground mt-6 inline-flex text-sm font-medium underline-offset-4 hover:underline"
              >
                Go to admin
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Topics
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                  Pick a quiz
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                <CategoryCard
                  title="All categories"
                  href="/quiz/play"
                  featured
                  index={0}
                />
                {categories.map((category, index) => (
                  <CategoryCard
                    key={category}
                    title={category}
                    href={`/quiz/play?category=${encodeURIComponent(category)}`}
                    index={index + 1}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
