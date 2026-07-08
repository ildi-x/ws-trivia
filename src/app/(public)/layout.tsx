import { SiteFooter } from "@/components/quiz/site-footer";
import { SiteHeader } from "@/components/quiz/site-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-page-bg relative isolate flex min-h-dvh flex-col">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
