"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDashboardBusiness,
  SAMPLE_BUSINESS,
  type OwnerBusiness,
} from "@/lib/ownerBusiness";
const IMAGES = {
  business: "/images/business-1.jpg",
  profile: "/images/profile-header.jpg",
};

const PREF_KEY = "localloop-owner-prefs";

const defaultPrefs = {
  emailAlerts: true,
  newInquiries: true,
  reviews: true,
  appearInSearch: true,
  showAddress: false,
};

type Prefs = typeof defaultPrefs;

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between border-t border-loop-border py-4 text-left first:border-t-0 first:pt-0 last:pb-0"
    >
      <span className="font-semibold">{label}</span>
      <span
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-loop-green-dark" : "bg-loop-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export default function BusinessDashboard() {
  const [business, setBusiness] = useState<OwnerBusiness>(SAMPLE_BUSINESS);
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);

  useEffect(() => {
    let cancelled = false;

    getDashboardBusiness()
      .then((result) => {
        if (!cancelled) setBusiness(result);
      })
      .catch(() => undefined);

    // so the switches don't snap back after a refresh
    try {
      const saved = window.localStorage.getItem(PREF_KEY);
      if (saved && !cancelled) {
        setPrefs((current) => ({ ...current, ...JSON.parse(saved) }));
      }
    } catch {
      // junk in storage, leave the defaults
    }

    return () => {
      cancelled = true;
    };
  }, []);

  function updatePref(key: keyof Prefs, value: boolean) {
    setPrefs((current) => {
      const next = { ...current, [key]: value };
      try {
        window.localStorage.setItem(PREF_KEY, JSON.stringify(next));
      } catch {
        // still flips on screen, just won't save
      }
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-loop-cream text-loop-green-dark md:pb-10">
      <div className="mx-auto flex w-full max-w-[430px] flex-col px-5 pt-8 md:max-w-6xl md:px-8 lg:px-10">
        <header>
          <p className="text-sm uppercase tracking-[0.2em] text-loop-green">your account</p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">
            settings
          </h1>
          <p className="mt-3 max-w-md text-loop-green md:text-lg">Email, alerts, and privacy</p>
        </header>

        <section
          id="account"
          className="mt-8 scroll-mt-6 overflow-hidden rounded-[28px] bg-loop-sage md:mt-10 md:scroll-mt-24 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-stretch lg:grid-cols-[280px_minmax(0,1fr)]"
        >
          <img
            src={IMAGES.business}
            alt="maker working at the studio bench"
            className="h-44 w-full object-cover md:h-full"
          />
          <div className="p-5 md:p-7">
            <p className="text-sm text-loop-green">Signed in as</p>
            <h2 className="mt-1 font-serif text-2xl md:text-3xl">{business.name}</h2>
            {business.category ? <p className="mt-2 text-sm text-loop-green">{business.category}</p> : null}
            {business.location ? <p className="mt-2 text-sm text-loop-green">{business.location}</p> : null}
          </div>
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section className="rounded-[28px] bg-white p-5">
            <h2 className="font-serif text-xl md:text-2xl">preferences</h2>
            <div className="mt-4">
              <ToggleRow
                label="Email alerts"
                checked={prefs.emailAlerts}
                onChange={(next) => updatePref("emailAlerts", next)}
              />
              <ToggleRow
                label="New inquiries"
                checked={prefs.newInquiries}
                onChange={(next) => updatePref("newInquiries", next)}
              />
              <ToggleRow
                label="Reviews"
                checked={prefs.reviews}
                onChange={(next) => updatePref("reviews", next)}
              />
              <ToggleRow
                label="Appear in search"
                checked={prefs.appearInSearch}
                onChange={(next) => updatePref("appearInSearch", next)}
              />
              <ToggleRow
                label="Show address"
                checked={prefs.showAddress}
                onChange={(next) => updatePref("showAddress", next)}
              />
              <a
                href="mailto:hello@localloop.ca"
                className="flex w-full items-center justify-between border-t border-loop-border py-4 font-semibold last:pb-0 hover:text-loop-green"
              >
                Help
                <span aria-hidden="true" className="text-loop-green">
                  →
                </span>
              </a>
            </div>
          </section>

          <section className="flex flex-col overflow-hidden rounded-[28px] bg-white">
            <img
              src={IMAGES.profile}
              alt="handmade ceramics on the studio shelves"
              className="h-36 w-full object-cover md:h-44"
            />
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-serif text-xl md:text-2xl">public profile</h2>
              <p className="mt-3 text-loop-green">Photos, hours, and bio</p>
              <Link
                href="/profile"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-loop-green-dark px-5 py-3.5 text-center text-sm font-semibold text-white hover:bg-loop-green md:mt-auto md:w-auto md:self-start md:px-8"
              >
                Open profile
              </Link>
            </div>
          </section>
        </div>

        <Link
          href="/login"
          className="mt-8 mb-4 inline-flex w-full items-center justify-center rounded-full border border-loop-border bg-white px-5 py-3.5 text-center text-sm font-semibold text-loop-green-dark hover:bg-loop-sage md:w-auto md:self-start md:px-8"
        >
          Sign out
        </Link>
      </div>
    </main>
  );
}
