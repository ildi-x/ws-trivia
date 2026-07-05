import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link href="/" className="flex w-fit shrink-0 items-center gap-1">
          <img
            src="/wealthsimple-logo.svg"
            alt=""
            width={40}
            height={24}
            className="block h-6 w-[calc(1.5rem*500/299.8)] shrink-0 sm:h-7 sm:w-[calc(1.75rem*500/299.8)]"
          />
          <span className="shrink-0 text-sm font-semibold tracking-tight whitespace-nowrap sm:text-base">
            Wealthsimple Trivia
          </span>
        </Link>
      </div>
    </header>
  );
}
