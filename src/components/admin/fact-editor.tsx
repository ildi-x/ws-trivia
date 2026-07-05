"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteFactAction,
  regenerateFactsAction,
  updateFactAction,
} from "@/app/admin/(dashboard)/facts/actions";

type FactRow = {
  id: string;
  text: string;
  importance: number;
  articleId: string;
  articleTitle: string;
};

export function FactEditor({ facts }: { facts: FactRow[] }) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editImportance, setEditImportance] = useState(3);

  function startEdit(fact: FactRow) {
    setEditingId(fact.id);
    setEditText(fact.text);
    setEditImportance(fact.importance);
  }

  return (
    <div className="space-y-4">
      {facts.map((fact) => (
        <div key={fact.id} className="rounded-lg border p-4">
          {editingId === fact.id ? (
            <div className="space-y-3">
              <textarea
                className="border-input bg-background w-full rounded-md border p-2 text-sm"
                rows={3}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <label className="text-sm">Importance</label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  className="w-20"
                  value={editImportance}
                  onChange={(e) => setEditImportance(Number(e.target.value))}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await updateFactAction(fact.id, editText, editImportance);
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
              <p className="text-sm">{fact.text}</p>
              <p className="text-muted-foreground mt-2 text-xs">
                Importance {fact.importance} ·{" "}
                <Link href={`/admin/articles/${fact.articleId}`} className="hover:underline">
                  {fact.articleTitle}
                </Link>
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(fact)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => regenerateFactsAction(fact.articleId))
                  }
                >
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() => startTransition(() => deleteFactAction(fact.id))}
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
