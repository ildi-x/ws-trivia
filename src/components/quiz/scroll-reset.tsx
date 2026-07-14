"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollWindowToTop } from "@/lib/scroll-to-top";

/**
 * Reset window scroll on every client-side route change.
 *
 * Next.js App Router often preserves the previous page's scrollY when the
 * destination starts with a fixed/sticky header (it skips those nodes when
 * choosing a scroll target). Watching pathname + searchParams and scrolling
 * after paint is the standard, reliable fix — including on iOS Safari, which
 * can ignore a scrollTo that runs before the new page has finished laying out.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollWindowToTop();
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, search]);

  return null;
}
