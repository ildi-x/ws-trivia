import Link from "next/link";
import { cn } from "@/lib/utils";
import { HELP_CENTER_HOME_URL } from "@/lib/scraper/url";

const EXTERNAL_LINKS = [
  { label: "Help Center", href: HELP_CENTER_HOME_URL },
  {
    label: "TLDR",
    href: "https://www.wealthsimple.com/en-ca/learn/tldr-newsletter-signup",
    desktopOnly: true,
  },
  {
    label: "Magazine",
    href: "https://www.wealthsimple.com/en-ca/magazine",
    desktopOnly: true,
  },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink items-center gap-1">
          <img
            src="/wealthsimple-logo.svg"
            alt=""
            width={40}
            height={24}
            className="block h-6 w-[calc(1.5rem*500/299.8)] shrink-0 sm:h-7 sm:w-[calc(1.75rem*500/299.8)]"
          />
          <span className="truncate text-sm font-semibold tracking-tight sm:text-base">
            Wealthsimple Trivia
          </span>
        </Link>

        <nav
          aria-label="Wealthsimple resources"
          className="flex shrink-0 items-center gap-4 sm:gap-6"
        >
          {EXTERNAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-muted-foreground relative text-sm font-medium whitespace-nowrap transition-colors hover:text-foreground active:text-foreground/80",
                "after:absolute after:-inset-x-2 after:-inset-y-2 after:content-[''] sm:after:-inset-x-1 sm:after:-inset-y-1",
                "desktopOnly" in item && item.desktopOnly && "hidden sm:inline",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
