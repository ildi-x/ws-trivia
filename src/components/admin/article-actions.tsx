"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
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

type BusyAction = "reprocess" | "facts" | "questions" | "unprocess";

function StatusPill({
  label,
  count,
  ready,
}: {
  label: string;
  count: number;
  ready: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
        ready
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-border/60 bg-muted/40 text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          ready ? "bg-emerald-500" : "bg-muted-foreground/40",
        )}
      />
      {ready ? (
        <>
          <span className="tabular-nums">{count}</span>
          {label}
        </>
      ) : (
        <>No {label} yet</>
      )}
    </span>
  );
}

export function ArticleActions({
  articleId,
  status,
  factCount,
  questionCount,
}: ArticleActionsProps) {
  const [pending, startTransition] = useTransition();
  const [busyAction, setBusyAction] = useState<BusyAction | null>(null);
  const [unprocessOpen, setUnprocessOpen] = useState(false);
  const hasFacts = factCount > 0;
  const hasQuestions = questionCount > 0;
  const canUnprocess = status === "processed" || hasFacts;
  const isBusy = pending || busyAction !== null;

  function runAction(action: BusyAction, fn: () => Promise<void>) {
    setBusyAction(action);
    startTransition(async () => {
      try {
        await fn();
      } finally {
        setBusyAction(null);
      }
    });
  }

  function confirmUnprocess() {
    runAction("unprocess", async () => {
      await unprocessArticleAction(articleId);
      setUnprocessOpen(false);
    });
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Button
          variant="outline"
          disabled={isBusy}
          onClick={() => runAction("reprocess", () => reprocessArticleAction(articleId))}
        >
          {busyAction === "reprocess" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Reprocessing…
            </>
          ) : (
            "Reprocess Article"
          )}
        </Button>
        <Button
          variant={hasFacts ? "outline" : "default"}
          disabled={isBusy}
          onClick={() => runAction("facts", () => generateFactsAction(articleId))}
        >
          {busyAction === "facts" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating facts…
            </>
          ) : hasFacts ? (
            `Regenerate Facts (${factCount})`
          ) : (
            "Generate Facts"
          )}
        </Button>
        <Button
          variant={hasQuestions ? "outline" : "secondary"}
          disabled={isBusy || !hasFacts}
          onClick={() => runAction("questions", () => generateQuestionsAction(articleId))}
        >
          {busyAction === "questions" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating questions…
            </>
          ) : hasQuestions ? (
            `Regenerate Questions (${questionCount})`
          ) : (
            "Generate Questions"
          )}
        </Button>
        {canUnprocess && (
          <Button
            variant="destructive"
            disabled={isBusy}
            onClick={() => setUnprocessOpen(true)}
          >
            Unprocess
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <StatusPill label="facts" count={factCount} ready={hasFacts} />
        <StatusPill label="questions" count={questionCount} ready={hasQuestions} />
      </div>

      <Dialog
        open={unprocessOpen}
        onOpenChange={(open) => {
          if (!open && busyAction === "unprocess") return;
          setUnprocessOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={busyAction !== "unprocess"}>
          <DialogHeader>
            <DialogTitle>Unprocess this article?</DialogTitle>
            <DialogDescription>
              All {factCount} fact{factCount === 1 ? "" : "s"} and {questionCount} question
              {questionCount === 1 ? "" : "s"} will be permanently deleted. The article will be
              marked as imported so you can extract facts again from scratch.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={busyAction === "unprocess"}
              onClick={() => setUnprocessOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={busyAction === "unprocess"}
              onClick={confirmUnprocess}
            >
              {busyAction === "unprocess" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Unprocessing…
                </>
              ) : (
                "Unprocess"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
