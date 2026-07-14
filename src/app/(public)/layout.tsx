import { SiteFooter } from "@/components/quiz/site-footer";
import { SiteHeader } from "@/components/quiz/site-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-page-bg relative isolate flex min-h-dvh flex-col">
      <SiteHeader />
      {/*
        Fixed header is out of document flow. Offset content by header height (h-14)
        so "Question 1 of 10" is never covered — including when Next.js scrolls past
        sticky/fixed chrome (it skips those nodes by design).
      */}
      <div className="flex flex-1 flex-col pt-14">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
