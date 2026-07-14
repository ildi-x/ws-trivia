"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import {
  deleteFactAction,
  regenerateFactsAction,
  updateFactAction,
} from "@/app/admin/(dashboard)/facts/actions";
import type { FactListItem } from "@/lib/admin/fact-queries";

type FactEditorProps = {
  facts: FactListItem[];
  onRemove?: (id: string) => void;
  onUpdate?: (id: string, text: string, importance: number) => void;
};

export function FactEditor({ facts, onRemove, onUpdate }: FactEditorProps) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editImportance, setEditImportance] = useState(3);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function startEdit(fact: FactListItem) {
    setEditingId(fact.id);
    setEditText(fact.text);
    setEditImportance(fact.importance);
  }

  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteFactAction(deleteId);
      onRemove?.(deleteId);
      setDeleteId(null);
    });
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
                      onUpdate?.(fact.id, editText, editImportance);
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
                {fact.category} · Importance {fact.importance} ·{" "}
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
                  onClick={() => setDeleteId(fact.id)}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      ))}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open && pending) return;
          if (!open) setDeleteId(null);
        }}
        title="Delete this fact?"
        description="Any questions generated from this fact will also be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
        pending={pending}
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
