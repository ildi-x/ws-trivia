/**
 * Scroll the window to the absolute document top.
 *
 * Sets every scroll root iOS / Chrome may use. Prefer `behavior: "instant"`
 * so no inherited smooth-scroll can leave us mid-page.
 */
export function scrollWindowToTop() {
  if (typeof window === "undefined") return;

  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * Aggressive reset for iOS Safari, which often ignores a single scrollTo when
 * layout is still settling after a route change or question swap.
 * Call from a click handler AND from a layout/paint effect.
 */
export function forceScrollWindowToTop() {
  if (typeof window === "undefined") return;

  scrollWindowToTop();

  requestAnimationFrame(() => {
    scrollWindowToTop();
    requestAnimationFrame(() => {
      scrollWindowToTop();
    });
  });

  window.setTimeout(scrollWindowToTop, 0);
  window.setTimeout(scrollWindowToTop, 50);
  window.setTimeout(scrollWindowToTop, 100);
}
