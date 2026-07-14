import { redirect } from "next/navigation";
import { getQuizCategories, getQuizQuestions } from "@/app/(public)/actions";
import { resolveCategorySlug } from "@/components/quiz/category-utils";
import { QuizPlayer } from "@/components/quiz/quiz-player";

export const dynamic = "force-dynamic";

export default async function QuizPlayPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const categoryParam = params.category;

  let category: string | undefined;
  if (categoryParam) {
    const categories = await getQuizCategories();
    category = resolveCategorySlug(categoryParam, categories);
    if (!category) {
      redirect("/");
    }
  }

  const questions = await getQuizQuestions(category);

  if (questions.length === 0) {
    redirect("/");
  }

  return <QuizPlayer key={category ?? "all"} questions={questions} category={category} />;
}
