"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  deleteQuestionAction,
  unpublishQuestionAction,
} from "@/app/admin/(dashboard)/questions/actions";
import type { PublishedQuestionRow } from "@/lib/admin/published-question-queries";

type PublishedQuestionItemProps = {
  question: PublishedQuestionRow;
  disabled?: boolean;
  onRemove: (id: string) => void;
};

export function PublishedQuestionItem({
  question,
  disabled = false,
  onRemove,
}: PublishedQuestionItemProps) {
  const [pending, startTransition] = useTransition();

  function handleUnpublish() {
    startTransition(async () => {
      await unpublishQuestionAction(question.id);
      onRemove(question.id);
    });
  }

  function handleDelete() {
    if (
      !window.confirm(
        "Delete this question permanently? It will be removed from the quiz and cannot be undone.",
      )
    ) {
      return;
    }

    startTransition(async () => {
      await deleteQuestionAction(question.id);
      onRemove(question.id);
    });
  }

  const isDisabled = disabled || pending;

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="font-medium">{question.question}</p>
        <Badge variant="outline">{question.difficulty}</Badge>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        {question.category} ·{" "}
        <Link
          href={`/admin/articles/${question.articleId}`}
          className="text-foreground hover:underline"
        >
          {question.articleTitle}
        </Link>
      </p>
      {question.publishedAt && (
        <p className="text-muted-foreground mt-1 text-xs">
          Published {new Date(question.publishedAt).toLocaleDateString("en-CA")}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={isDisabled} onClick={handleUnpublish}>
          Unpublish
        </Button>
        <Button size="sm" variant="destructive" disabled={isDisabled} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
