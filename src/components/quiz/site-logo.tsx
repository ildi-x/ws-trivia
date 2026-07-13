import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
};

/**
 * 2×2 answer-key mark + wordmark in the site typeface.
 * Mark scales with the type so the lockup stays one unit.
 */
export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.55em] text-[1.0625rem] leading-none text-foreground sm:text-[1.125rem]",
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-[0.95em] shrink-0"
        fill="currentColor"
      >
        <rect x="1.5" y="1.5" width="9" height="9" rx="2.25" className="opacity-[0.2]" />
        <rect x="13.5" y="1.5" width="9" height="9" rx="2.25" className="opacity-[0.2]" />
        <rect x="1.5" y="13.5" width="9" height="9" rx="2.25" />
        <rect x="13.5" y="13.5" width="9" height="9" rx="2.25" className="opacity-[0.2]" />
      </svg>

      <span className="font-semibold tracking-[-0.03em]">
        WS
        <span className="tracking-normal"> </span>
        Trivia
      </span>
    </span>
  );
}
