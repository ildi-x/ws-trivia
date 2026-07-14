import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  getCategoryDescription,
  getCategoryIcon,
  getCategoryStyle,
} from "@/components/quiz/category-utils";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  title: string;
  description?: string;
  href: string;
  featured?: boolean;
  index?: number;
};

export function CategoryCard({
  title,
  description,
  href,
  featured = false,
  index = 0,
}: CategoryCardProps) {
  const Icon = getCategoryIcon(title);
  const style = getCategoryStyle(title, index);
  const blurb = description ?? getCategoryDescription(title);

  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "group relative block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        featured && "sm:col-span-2",
      )}
    >
      <article
        className={cn(
          "relative flex h-full min-h-[11.5rem] flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 sm:p-7",
          featured
            ? cn(
                "border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] via-card/80 to-card/60 shadow-sm backdrop-blur-sm dark:border-violet-400/20 dark:from-violet-400/[0.1]",
                "group-hover:-translate-y-0.5 group-hover:border-violet-500/30 group-hover:bg-card group-hover:shadow-lg group-hover:shadow-violet-500/5 dark:group-hover:border-violet-400/30 dark:group-hover:shadow-violet-400/5",
              )
            : cn(
                "border-border/50 bg-card/60 shadow-sm backdrop-blur-sm",
                "group-hover:-translate-y-0.5 group-hover:border-border group-hover:bg-card group-hover:shadow-lg",
                style.ring,
              ),
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            featured
              ? "bg-gradient-to-br from-violet-500/[0.05] via-transparent to-indigo-500/[0.03]"
              : "bg-gradient-to-br from-violet-500/[0.03] via-transparent to-transparent",
          )}
        />

        <div className="relative flex items-start justify-between gap-4">
          <div
            className={cn(
              "inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-inset",
              cn(style.icon, "ring-black/[0.04] dark:ring-white/[0.06]"),
            )}
          >
            <Icon className="size-5" strokeWidth={1.75} />
          </div>
          <ArrowUpRight
            aria-hidden
            className="text-muted-foreground/0 size-4 shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-muted-foreground"
          />
        </div>

        <div className="relative mt-5 flex flex-1 flex-col">
          <h3
            className={cn(
              "text-lg font-semibold tracking-tight sm:text-[1.125rem]",
              featured && "sm:text-xl",
            )}
          >
            {title}
          </h3>
          {blurb && (
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
              {blurb}
            </p>
          )}
        </div>

        <p className="text-muted-foreground relative mt-5 text-sm font-medium transition-colors group-hover:text-foreground">
          Start quiz
        </p>
      </article>
    </Link>
  );
}
