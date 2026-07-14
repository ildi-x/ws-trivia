"use client";

import { useLayoutEffect, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { forceScrollWindowToTop, scrollWindowToTop } from "@/lib/scroll-to-top";

/**
 * Force window scroll to 0 on every client navigation.
 *
 * Next.js skips sticky/fixed headers when picking a scroll target, then
 * scrollIntoView()'s the page content to the top of the viewport — which
 * puts "Question 1 of 10" under the sticky header. Disable that via
 * `scroll={false}` on Links, and reset here so we always land at document top
 * (where a sticky header is still in flow and content sits below it).
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

  useLayoutEffect(() => {
    scrollWindowToTop();
  }, [pathname, search]);

  useEffect(() => {
    forceScrollWindowToTop();
  }, [pathname, search]);

  return null;
}
