"use client";

import { useEffect } from "react";

/**
 * Forces scroll-to-top on client-side forward navigations.
 *
 * Two things conspire to leave the page scrolled mid-content after a `Link`
 * click:
 *   1. Next.js intentionally skips sticky/fixed elements when picking a scroll
 *      target, so with a fixed header it can bail out of scrolling entirely.
 *   2. iOS Safari has a dual (large/small) viewport toolbar state; navigating
 *      while the toolbar is "large" leaves a residual scroll offset.
 *
 * Patching `history.pushState` resets scroll on every *forward* navigation.
 * Back/forward use `popstate` (not `pushState`), so native scroll restoration
 * is preserved.
 */
export function ScrollReset() {
  useEffect(() => {
    const original = history.pushState.bind(history);

    history.pushState = function patchedPushState(
      ...args: Parameters<typeof history.pushState>
    ) {
      original(...args);
      window.scrollTo(0, 0);
    };

    return () => {
      history.pushState = original;
    };
  }, []);

  return null;
}
