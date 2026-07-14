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
 * Same as scrollWindowToTop, but waits until after the next paint.
 * Use for route changes / large layout swaps where Safari may ignore an
 * immediate scrollTo before layout has settled.
 */
export function scrollWindowToTopAfterPaint() {
  if (typeof window === "undefined") return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollWindowToTop();
    });
  });
}
