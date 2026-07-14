import { Suspense } from "react";
import { SiteFooter } from "@/components/quiz/site-footer";
import { SiteHeader } from "@/components/quiz/site-header";
import { ScrollToTop } from "@/components/quiz/scroll-to-top";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-page-bg relative isolate flex min-h-dvh flex-col">
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
