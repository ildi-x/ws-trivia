"use client";

import { useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollAppToTop } from "@/lib/scroll-to-top";

/**
 * Reset the app scroll region to the top on every client navigation.
 * Runs before paint so there's no flash of a mid-scrolled page.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useLayoutEffect(() => {
    scrollAppToTop();
  }, [pathname, search]);

  return null;
}
