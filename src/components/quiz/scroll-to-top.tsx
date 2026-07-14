"use client";

import { useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  disableBrowserScrollRestoration,
  scrollWindowToTop,
} from "@/lib/scroll-to-top";

/**
 * On route / query changes, reset window scroll before paint.
 * Intentionally one shot — no retries, no scrollIntoView (those clip under sticky header on iOS).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useLayoutEffect(() => {
    disableBrowserScrollRestoration();
    scrollWindowToTop();
  }, [pathname, search]);

  return null;
}
