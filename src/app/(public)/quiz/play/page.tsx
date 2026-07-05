import { redirect } from "next/navigation";
import { getQuizQuestions } from "@/app/(public)/actions";
import { QuizPlayer } from "@/components/quiz/quiz-player";

export const dynamic = "force-dynamic";

export default async function QuizPlayPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const questions = await getQuizQuestions(params.category);

  if (questions.length === 0) {
    redirect("/");
  }

  return (
    <QuizPlayer
      questions={questions}
      category={params.category}
    />
  );
}
