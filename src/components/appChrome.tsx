"use client";

import { usePathname } from "next/navigation";
import SiteNav from "@/components/siteNav";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = pathname !== "/";

  return (
    <>
      {showNav ? <SiteNav /> : null}
      <div className={showNav ? "pb-28 md:pb-0" : undefined}>{children}</div>
    </>
  );
}
