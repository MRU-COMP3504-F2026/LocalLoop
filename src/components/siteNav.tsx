"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loadSessionBusiness } from "@/lib/database";
import { getDashboardBusiness } from "@/lib/ownerBusiness";

const LOGO_SRC = "/images/logo.png";

export function SiteLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-loop-green-dark">
      <img src={LOGO_SRC} alt="" className="h-11 w-auto" />
      <span className="leading-tight">
        <span className="block font-sans text-lg font-extrabold tracking-tight">LocalLoop</span>
        <span className="block text-[0.58rem] uppercase tracking-[0.18em] text-loop-green">
          find local. love local.
        </span>
      </span>
    </Link>
  );
}

function NavIcon({ name }: { name: string }) {
  if (name === "Listings") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (name === "Preview") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M2.8 12s3.6-6.2 9.2-6.2S21.2 12 21.2 12s-3.6 6.2-9.2 6.2S2.8 12 2.8 12z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (name === "Settings") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5.2 19.2c1.1-3.4 3.4-5.1 6.8-5.1s5.7 1.7 6.8 5.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4.5 11.2 12 4.8l7.5 6.4V19a1.2 1.2 0 0 1-1.2 1.2h-4.3v-5.2H9.9V20.2H5.7A1.2 1.2 0 0 1 4.5 19z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function tabIsActive(pathname: string, label: string, href: string) {
  if (label === "Preview") {
    return pathname.startsWith("/business/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname() ?? "";
  const [previewHref, setPreviewHref] = useState("/explore");

  useEffect(() => {
    let cancelled = false;
    const load = loadSessionBusiness().then((result) => result ?? getDashboardBusiness());

    load
      .then((business) => {
        if (!cancelled && business) {
          setPreviewHref(`/business/${business.business_id}`);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  if (pathname === "/login") {
    return (
      <header className="border-b border-loop-border bg-loop-cream">
        <div className="mx-auto flex w-full max-w-6xl px-5 py-4 md:px-8">
          <SiteLogo />
        </div>
      </header>
    );
  }

  const tabs = [
    { href: "/profile", label: "Profile" },
    { href: "/product", label: "Listings" },
    { href: previewHref, label: "Preview" },
    { href: "/dashboard", label: "Settings" },
  ];

  return (
    <nav
      aria-label="business management"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-loop-border bg-loop-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:sticky md:top-0 md:bottom-auto md:border-b md:border-t-0 md:pb-0"
    >
      <div className="mx-auto flex w-full max-w-[430px] items-center justify-around px-2 py-2.5 text-[11px] md:max-w-6xl md:justify-between md:px-8 md:py-4 md:text-sm">
        <div className="hidden md:block">
          <SiteLogo />
        </div>
        <div className="flex w-full justify-around md:w-auto md:gap-8">
          {tabs.map((tab) => {
            const active = tabIsActive(pathname, tab.label, tab.href);

            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`flex flex-col items-center gap-1 md:flex-row md:gap-2 ${
                  active ? "font-semibold text-loop-green-dark" : "text-loop-green"
                }`}
              >
                <NavIcon name={tab.label} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
