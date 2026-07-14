/**
 * The public app-shell scroll region. Content scrolls inside this element
 * (not the window), so the header — a sibling above it — can never overlap.
 */
export const APP_SCROLL_CONTAINER_ID = "app-scroll";

/**
 * Reset the app scroll region (and the window, as a fallback) to the top.
 *
 * Setting an overflow container's scrollTop is synchronous and honored
 * immediately on every browser — including iOS Safari — which is why this is
 * reliable where window.scrollTo(0, 0) was not.
 */
export function scrollAppToTop() {
  if (typeof document !== "undefined") {
    const el = document.getElementById(APP_SCROLL_CONTAINER_ID);
    if (el) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  }
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
}
