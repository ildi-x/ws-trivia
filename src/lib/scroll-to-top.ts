/**
 * Scroll the window to the absolute document top.
 *
 * Used for in-page transitions that aren't route navigations (e.g. advancing
 * to the next quiz question), where Next.js does nothing on its own. `instant`
 * avoids any inherited smooth-scroll animation, which iOS can drop mid-flight.
 */
export function scrollWindowToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
