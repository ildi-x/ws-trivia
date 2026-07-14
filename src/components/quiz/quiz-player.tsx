"use client";

import { useState, useTransition } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { getQuizQuestions, saveQuizResult } from "@/app/(public)/actions";
import { cn } from "@/lib/utils";

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  articleTitle: string;
  articleUrl: string;
  category: string;
};

const OPTION_LABELS = ["A", "B", "C", "D"];

function shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return [...questions].sort(() => Math.random() - 0.5);
}

export function QuizPlayer({
  questions,
  category,
}: {
  questions: QuizQuestion[];
  category?: string;
}) {
  const [sessionQuestions, setSessionQuestions] = useState(questions);
  const [quizQuestions, setQuizQuestions] = useState(questions);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();

  const current = quizQuestions[index]!;
  const answered = selected !== null;
  const progress = ((index + (answered ? 1 : 0)) / quizQuestions.length) * 100;

  function resetWithQuestions(next: QuizQuestion[]) {
    setSessionQuestions(next);
    setQuizQuestions(next);
    setAnswers(next.map(() => null));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setSaved(false);
  }

  function handleRetry() {
    resetWithQuestions(shuffleQuestions(sessionQuestions));
  }

  function handleNewQuestions() {
    startRefresh(async () => {
      const next = await getQuizQuestions(category);
      if (next.length === 0) return;
      resetWithQuestions(next);
    });
  }

  function handleSelect(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
    if (optionIndex === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  }

  async function handleNext() {
    if (index + 1 >= quizQuestions.length) {
      if (!saved) {
        const finalAnswers = answers.map((answer, i) =>
          i === index ? selected : answer,
        );
        const finalScore = quizQuestions.reduce((total, question, i) => {
          return total + (finalAnswers[i] === question.correctAnswer ? 1 : 0);
        }, 0);
        await saveQuizResult(finalScore, quizQuestions.length, category);
        setSaved(true);
      }
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (finished) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const misses = quizQuestions.flatMap((question, i) => {
      const selectedAnswer = answers[i];
      if (selectedAnswer == null || selectedAnswer === question.correctAnswer) {
        return [];
      }
      return [{ question, selectedAnswer, number: i + 1 }];
    });
    const message =
      percentage >= 80
        ? "Excellent work — you really know your stuff."
        : percentage >= 50
          ? "Solid effort. Review the articles to sharpen up."
          : "Good start. Each answer links to the source material.";

    return (
      <main className="mx-auto max-w-2xl px-4 py-8 pb-12 sm:px-6 sm:py-12">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="relative mx-auto mb-6 flex size-32 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/40"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
                className="text-primary transition-all duration-700"
              />
            </svg>
            <div>
              <p className="text-3xl font-semibold tracking-tight">{percentage}%</p>
              <p className="text-muted-foreground text-xs">
                {score}/{quizQuestions.length}
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Quiz complete</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{message}</p>

          <div className="mt-8 space-y-3">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button
                variant="outline"
                className="h-10 w-full sm:flex-1"
                onClick={handleRetry}
                disabled={isRefreshing}
              >
                Try again
              </Button>
              <Button
                variant="outline"
                className="h-10 w-full sm:flex-1"
                onClick={handleNewQuestions}
                disabled={isRefreshing}
              >
                {isRefreshing ? "Loading…" : "New questions"}
              </Button>
            </div>
            <div className="pt-1 text-center">
              <ButtonLink
                href="/"
                variant="link"
                className="text-muted-foreground h-auto px-0 text-sm font-medium"
              >
                Back to categories
              </ButtonLink>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Study sheet
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight">
              Review your misses
            </h3>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              {misses.length === 0
                ? "No misses — you answered every question correctly."
                : `${misses.length} ${misses.length === 1 ? "question" : "questions"} to revisit with the source articles.`}
            </p>
          </div>

          {misses.length > 0 && (
            <ul className="space-y-5">
              {misses.map(({ question, selectedAnswer, number }) => {
                const options = Array.isArray(question.options) ? question.options : [];
                const yourAnswer = options[selectedAnswer];
                const correct = options[question.correctAnswer];

                return (
                  <li
                    key={question.id}
                    className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm"
                  >
                    <div className="border-b border-border/50 px-5 py-4 sm:px-6 sm:py-5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="bg-muted text-muted-foreground inline-flex size-7 items-center justify-center rounded-lg text-[0.6875rem] font-semibold tabular-nums">
                          {String(number).padStart(2, "0")}
                        </span>
                        {!category && question.category && (
                          <span className="text-muted-foreground text-[0.6875rem] font-medium tracking-wider uppercase">
                            {question.category}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-base font-semibold tracking-tight text-balance sm:text-lg sm:leading-snug">
                        {question.question}
                      </p>
                    </div>

                    <div className="space-y-2.5 px-5 py-4 sm:px-6 sm:py-5">
                      <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.04] px-3.5 py-3">
                        <XCircle className="text-destructive mt-0.5 size-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-destructive/80 text-[0.6875rem] font-medium tracking-wider uppercase">
                            Your answer
                          </p>
                          <p className="text-destructive mt-1 text-sm leading-relaxed">
                            {yourAnswer}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] px-3.5 py-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.6875rem] font-medium tracking-wider text-emerald-700/80 uppercase dark:text-emerald-400/80">
                            Correct answer
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-emerald-800 dark:text-emerald-300">
                            {correct}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-border/50 px-5 py-4 sm:px-6 sm:py-5">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {question.explanation}
                      </p>
                      <a
                        href={question.articleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group text-foreground inline-flex max-w-full items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                      >
                        <span className="truncate underline-offset-4 group-hover:underline">
                          {question.articleTitle}
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="text-muted-foreground size-3.5 shrink-0 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                        />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 pb-12 sm:px-6 sm:py-12">
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {index + 1} of {quizQuestions.length}
          </span>
          <span className="font-medium tabular-nums">
            Score {score}/{quizQuestions.length}
          </span>
        </div>
        <div className="bg-muted h-1.5 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {(category || current.category) && (
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {category ?? current.category}
          </p>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-xl leading-snug font-semibold tracking-tight text-balance sm:text-2xl">
          {current.question}
        </h2>

        <div className="mt-6 space-y-2.5" role="radiogroup" aria-label="Answer choices">
          {(Array.isArray(current.options) ? current.options : []).map((option, i) => {
            const isCorrect = i === current.correctAnswer;
            const isSelected = i === selected;

            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={cn(
                  "flex w-full touch-manipulation items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                  "min-h-12",
                  !answered && "cursor-pointer hover:bg-muted active:bg-muted/60",
                  answered && isCorrect && "border-emerald-500/40 bg-emerald-500/5",
                  answered && isSelected && !isCorrect && "border-destructive/40 bg-destructive/5",
                  answered && !isSelected && !isCorrect && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                    answered &&
                      isCorrect &&
                      "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                    answered &&
                      isSelected &&
                      !isCorrect &&
                      "border-destructive/50 bg-destructive/10 text-destructive",
                    !answered && "bg-muted text-muted-foreground",
                  )}
                >
                  {OPTION_LABELS[i]}
                </span>
                <span className="flex-1 pt-0.5 text-sm leading-relaxed sm:text-[0.9375rem]">
                  {option}
                </span>
                {answered && isCorrect && (
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                )}
                {answered && isSelected && !isCorrect && (
                  <XCircle className="text-destructive size-5 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-6 space-y-4 border-t pt-6">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm leading-relaxed">{current.explanation}</p>
            </div>
            <a
              href={current.articleUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-3 rounded-xl border bg-background px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-[0.6875rem] font-medium tracking-wider uppercase">
                  Source
                </p>
                <p className="mt-1 text-sm leading-snug text-foreground/90 group-hover:underline">
                  {current.articleTitle}
                </p>
              </div>
              <ArrowUpRight
                aria-hidden
                className="text-muted-foreground mt-0.5 size-4 shrink-0 transition-all group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground"
              />
            </a>
            <Button className="h-10 w-full" onClick={handleNext}>
              {index + 1 >= quizQuestions.length ? "See results" : "Next question"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
