"use client";

import { useTransition } from "react";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  reprocessArticleAction,
  generateFactsAction,
  generateQuestionsAction,
  unprocessArticleAction,
} from "@/app/admin/(dashboard)/articles/[id]/actions";

type ArticleActionsProps = {
  articleId: string;
  status: "imported" | "processed";
  factCount: number;
  questionCount: number;
};

export function ArticleActions({
  articleId,
  status,
  factCount,
  questionCount,
}: ArticleActionsProps) {
  const [pending, startTransition] = useTransition();
  const hasFacts = factCount > 0;
  const hasQuestions = questionCount > 0;
  const canUnprocess = status === "processed" || hasFacts;

  function handleUnprocess() {
    if (
      !window.confirm(
        "Unprocess this article? All facts and questions will be permanently deleted and the article will be marked as imported.",
      )
    ) {
      return;
    }

    startTransition(() => unprocessArticleAction(articleId));
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1.5">
          {hasFacts ? (
            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <CircleDashed className="size-3.5" />
          )}
          {hasFacts ? `${factCount} facts extracted` : "No facts yet"}
        </span>
        <span className="text-border hidden sm:inline">·</span>
        <span className="inline-flex items-center gap-1.5">
          {hasQuestions ? (
            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <CircleDashed className="size-3.5" />
          )}
          {hasQuestions ? `${questionCount} questions generated` : "No questions yet"}
        </span>
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={pending}
          onClick={() => startTransition(() => reprocessArticleAction(articleId))}
        >
          Reprocess Article
        </Button>
        <Button
          variant={hasFacts ? "outline" : "default"}
          disabled={pending}
          onClick={() => startTransition(() => generateFactsAction(articleId))}
        >
          {hasFacts ? `Regenerate Facts (${factCount})` : "Generate Facts"}
        </Button>
        <Button
          variant={hasQuestions ? "outline" : "secondary"}
          disabled={pending || !hasFacts}
          onClick={() => startTransition(() => generateQuestionsAction(articleId))}
        >
          {hasQuestions
            ? `Regenerate Questions (${questionCount})`
            : "Generate Questions"}
        </Button>
        {canUnprocess && (
          <Button variant="destructive" disabled={pending} onClick={handleUnprocess}>
            Unprocess
          </Button>
        )}
      </div>
    </div>
  );
}
