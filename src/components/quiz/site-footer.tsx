import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-9 sm:pb-[max(2.25rem,env(safe-area-inset-bottom,0px))]">
        <p className="text-center text-sm text-muted-foreground text-pretty">
          Built with{" "}
          <span aria-hidden="true" className="opacity-50">
            ❤️
          </span>{" "}
          by{" "}
          <Link
            href="https://github.com/ildi-x"
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-foreground transition-opacity after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] hover:opacity-80 active:opacity-70 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Ildi
          </Link>
        </p>
      </div>
    </footer>
  );
}
