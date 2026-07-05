"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  approveQuestionAction,
  deleteQuestionAction,
  rejectQuestionAction,
  updateQuestionAction,
} from "@/app/admin/(dashboard)/questions/actions";

type QuestionRow = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  articleTitle: string;
  articleUrl: string;
  factText: string;
};

export function QuestionReviewCard({ questions }: { questions: QuestionRow[] }) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<QuestionRow | null>(null);

  function startEdit(q: QuestionRow) {
    setEditingId(q.id);
    setForm({ ...q });
  }

  function handleDelete(id: string) {
    if (
      !window.confirm(
        "Delete this question permanently? It cannot be undone.",
      )
    ) {
      return;
    }
    startTransition(() => deleteQuestionAction(id));
  }

  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="rounded-lg border p-5">
          {editingId === q.id && form ? (
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
                  placeholder={`Option ${i + 1}`}
                />
              ))}
              <div className="flex items-center gap-2">
                <label className="text-sm">Correct index (0-3)</label>
                <Input
                  type="number"
                  min={0}
                  max={3}
                  className="w-20"
                  value={form.correctAnswer}
                  onChange={(e) =>
                    setForm({ ...form, correctAnswer: Number(e.target.value) })
                  }
                />
              </div>
              <textarea
                className="border-input bg-background w-full rounded-md border p-2 text-sm"
                rows={2}
                value={form.explanation}
                onChange={(e) => setForm({ ...form, explanation: e.target.value })}
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
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await updateQuestionAction(q.id, {
                        question: form.question,
                        options: form.options,
                        correctAnswer: form.correctAnswer,
                        explanation: form.explanation,
                        difficulty: form.difficulty as "easy" | "medium" | "hard",
                      });
                      setEditingId(null);
                    })
                  }
                >
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium">{q.question}</p>
                <Badge variant="outline">{q.difficulty}</Badge>
              </div>
              <ul className="mt-4 space-y-2">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      i === q.correctAnswer
                        ? "border-green-500/50 bg-green-500/5"
                        : ""
                    }`}
                  >
                    {opt}
                    {i === q.correctAnswer && (
                      <span className="text-muted-foreground ml-2 text-xs">(correct)</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">{q.explanation}</p>
              <p className="text-muted-foreground mt-2 text-xs">
                Source:{" "}
                <Link href={q.articleUrl} target="_blank" className="hover:underline">
                  {q.articleTitle}
                </Link>
              </p>
              <p className="text-muted-foreground mt-1 text-xs italic">Fact: {q.factText}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() => startTransition(() => approveQuestionAction(q.id))}
                >
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(q)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() => startTransition(() => rejectQuestionAction(q.id))}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => handleDelete(q.id)}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
