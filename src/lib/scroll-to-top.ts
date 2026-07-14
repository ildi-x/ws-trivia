/** Force viewport to the top. Retries help on iOS Safari/Chrome where a single scrollTo is often ignored. */
export function scrollWindowToTop() {
  if (typeof window === "undefined") return;

  try {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  } catch {
    // ignore
  }

  const run = () => {
    const anchor =
      document.getElementById("quiz-scroll-top") ??
      document.getElementById("page-top");

    window.scrollTo(0, 0);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (anchor) {
      anchor.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
    }
  };

  run();
  requestAnimationFrame(() => {
    run();
    requestAnimationFrame(run);
  });
  window.setTimeout(run, 0);
  window.setTimeout(run, 50);
  window.setTimeout(run, 150);
  window.setTimeout(run, 300);
}
