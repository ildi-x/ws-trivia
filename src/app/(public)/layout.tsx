import { Suspense } from "react";
import { SiteFooter } from "@/components/quiz/site-footer";
import { SiteHeader } from "@/components/quiz/site-header";
import { ScrollReset } from "@/components/quiz/scroll-reset";
import { APP_SCROLL_CONTAINER_ID } from "@/lib/scroll-to-top";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
      App-shell layout: the header and the scroll region are SIBLINGS in a
      viewport-height flex column, not overlapping layers. The header can never
      cover content, and "scroll to top" is just container.scrollTop = 0 —
      synchronous and reliable on every browser (no iOS window-scroll quirks).
    */
    <div className="public-page-bg relative isolate flex h-dvh flex-col overflow-hidden">
      <SiteHeader />
      <div
        id={APP_SCROLL_CONTAINER_ID}
        className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        <Suspense fallback={null}>
          <ScrollReset />
        </Suspense>
        <div className="flex min-h-full flex-col">
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
