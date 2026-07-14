"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { scrollWindowToTop } from "@/lib/scroll-to-top";

/** Resets scroll on client navigations (home → quiz, etc.), especially on mobile Safari/Chrome. */
export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    scrollWindowToTop();
  }, [pathname, search]);

  return <div id="page-top" aria-hidden className="pointer-events-none absolute top-0 left-0 h-0 w-0" />;
}
