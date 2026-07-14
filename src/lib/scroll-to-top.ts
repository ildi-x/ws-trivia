/** Scroll the window to the document top. Do not use scrollIntoView — it fights sticky headers. */
export function scrollWindowToTop() {
  if (typeof window === "undefined") return;

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function disableBrowserScrollRestoration() {
  if (typeof window === "undefined") return;
  try {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  } catch {
    // ignore
  }
}
