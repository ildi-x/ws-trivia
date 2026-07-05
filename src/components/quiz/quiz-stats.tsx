import type { QuizStats } from "@/app/(public)/actions";

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export function QuizStatsLine({ stats }: { stats: QuizStats }) {
  const questionLabel = pluralize(stats.questions, "question", "questions");
  const articleLabel = pluralize(stats.articlesProcessed, "article", "articles");

  return (
    <p className="text-muted-foreground mx-auto mt-6 text-sm">
      {stats.questions.toLocaleString()} {questionLabel} from{" "}
      {stats.articlesProcessed.toLocaleString()} processed {articleLabel}
    </p>
  );
}
