"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteQuestionAction,
  unpublishQuestionAction,
  updateQuestionAction,
} from "@/app/admin/(dashboard)/questions/actions";
import type { PublishedQuestionRow } from "@/lib/admin/published-question-queries";

type PublishedQuestionItemProps = {
  question: PublishedQuestionRow;
  disabled?: boolean;
  onRemove: (id: string) => void;
  onUpdate: (question: PublishedQuestionRow) => void;
};

export function PublishedQuestionItem({
  question,
  disabled = false,
  onRemove,
  onUpdate,
}: PublishedQuestionItemProps) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<PublishedQuestionRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function startEdit() {
    setEditing(true);
    setForm({ ...question });
  }

  function handleUnpublish() {
    startTransition(async () => {
      await unpublishQuestionAction(question.id);
      onRemove(question.id);
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      await deleteQuestionAction(question.id);
      onRemove(question.id);
      setDeleteOpen(false);
    });
  }

  const isDisabled = disabled || pending;

  return (
    <div className="rounded-lg border p-4">
      {editing && form ? (
        <div className="space-y-3">
          <textarea
            className="border-input bg-background w-full rounded-md border p-2 text-sm"
            rows={2}
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
          {form.options.map((opt, i) => (
            <Input
              key={i}
              value={opt}
              onChange={(e) => {
                const options = [...form.options];
                options[i] = e.target.value;
                setForm({ ...form, options });
              }}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
            />
          ))}
          <div className="flex items-center gap-2">
            <label className="text-sm">Correct answer</label>
            <Select
              value={String(form.correctAnswer)}
              onValueChange={(v) => v && setForm({ ...form, correctAnswer: Number(v) })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {form.options.map((opt, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {String.fromCharCode(65 + i)}: {opt.slice(0, 40)}
                    {opt.length > 40 ? "…" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <textarea
            className="border-input bg-background w-full rounded-md border p-2 text-sm"
            rows={2}
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            placeholder="Explanation"
          />
          <Select
            value={form.difficulty}
            onValueChange={(v) => v && setForm({ ...form, difficulty: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={isDisabled}
              onClick={() =>
                startTransition(async () => {
                  await updateQuestionAction(question.id, {
                    question: form.question,
                    options: form.options,
                    correctAnswer: form.correctAnswer,
                    explanation: form.explanation,
                    difficulty: form.difficulty as "easy" | "medium" | "hard",
                  });
                  onUpdate(form);
                  setEditing(false);
                })
              }
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(false);
                setForm(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium">{question.question}</p>
            <Badge variant="outline">{question.difficulty}</Badge>
          </div>
          <ul className="mt-4 space-y-2">
            {question.options.map((opt, i) => (
              <li
                key={i}
                className={`rounded-md border px-3 py-2 text-sm ${
                  i === question.correctAnswer
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : ""
                }`}
              >
                <span className="text-muted-foreground mr-2 font-medium">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {i === question.correctAnswer && (
                  <span className="text-muted-foreground ml-2 text-xs">(correct)</span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">{question.explanation}</p>
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
            <Button size="sm" variant="outline" disabled={isDisabled} onClick={startEdit}>
              Edit
            </Button>
            <Button size="sm" variant="outline" disabled={isDisabled} onClick={handleUnpublish}>
              Unpublish
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isDisabled}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open && pending) return;
          setDeleteOpen(open);
        }}
        title="Delete this question?"
        description="This permanently removes the question from the quiz. This cannot be undone."
        confirmLabel="Delete"
        pending={pending}
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
