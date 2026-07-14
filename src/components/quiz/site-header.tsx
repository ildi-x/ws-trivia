import Link from "next/link";
import { SiteLogo } from "@/components/quiz/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
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
    // A normal flex child (not sticky/fixed): it sits above the scroll region
    // as a sibling, so it can never overlap content. pt handles the iOS notch.
    <header className="z-50 w-full shrink-0 border-b border-border/40 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          scroll={false}
          aria-label="WS Trivia home"
          className="inline-flex min-w-0 shrink-0 items-center transition-opacity hover:opacity-80 active:opacity-70"
        >
          <SiteLogo />
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <nav
            aria-label="Wealthsimple resources"
            className="flex items-center gap-3 sm:gap-5"
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
          <ThemeToggle className="ml-0.5 sm:ml-1" />
        </div>
      </div>
    </header>
  );
}
