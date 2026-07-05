"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  deleteQuestionAction,
  unpublishQuestionAction,
} from "@/app/admin/(dashboard)/questions/actions";

type PublishedQuestionRow = {
  id: string;
  question: string;
  difficulty: string;
  category: string;
  articleTitle: string;
  publishedAt: string | null;
};

export function PublishedQuestionCard({
  questions,
}: {
  questions: PublishedQuestionRow[];
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (
      !window.confirm(
        "Delete this question permanently? It will be removed from the quiz and cannot be undone.",
      )
    ) {
      return;
    }
    startTransition(() => deleteQuestionAction(id));
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div key={q.id} className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium">{q.question}</p>
            <Badge variant="outline">{q.difficulty}</Badge>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            {q.category} · {q.articleTitle}
          </p>
          {q.publishedAt && (
            <p className="text-muted-foreground mt-1 text-xs">
              Published {new Date(q.publishedAt).toLocaleDateString("en-CA")}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => startTransition(() => unpublishQuestionAction(q.id))}
            >
              Unpublish
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() => handleDelete(q.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
