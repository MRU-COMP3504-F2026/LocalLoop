import { Suspense } from "react";
import SiteNav from "@/components/siteNav";

function NavFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 bottom-0 z-20 h-16 border-t border-loop-border bg-loop-cream md:sticky md:top-0 md:bottom-auto md:h-[4.75rem] md:border-b md:border-t-0"
    />
  );
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<NavFallback />}>
        <SiteNav />
      </Suspense>
      <div className="pb-28 md:pb-0">{children}</div>
    </>
  );
}
