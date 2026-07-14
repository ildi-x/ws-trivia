import { Suspense } from "react";
import { SiteFooter } from "@/components/quiz/site-footer";
import { SiteHeader } from "@/components/quiz/site-header";
import { ScrollReset } from "@/components/quiz/scroll-reset";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-page-bg relative isolate flex min-h-dvh flex-col">
      {/* useSearchParams requires a Suspense boundary */}
      <Suspense fallback={null}>
        <ScrollReset />
      </Suspense>
      <SiteHeader />
      {/*
        Fixed header is out of document flow. Offset content by header height (h-14)
        so page content is never covered when scrollY is 0.
      */}
      <div className="flex flex-1 flex-col pt-14">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
