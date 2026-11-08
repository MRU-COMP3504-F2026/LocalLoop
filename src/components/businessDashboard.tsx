"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDashboardBusiness,
  SAMPLE_BUSINESS,
  type OwnerBusiness,
} from "@/lib/ownerBusiness";
import { useCreatedShop, type CreatedShop } from "@/hooks/useCreatedShop";
import type { BusinessHours } from "@/context/accounts/businessContext";

const IMAGES = {
  business: "/images/business-1.jpg",
  profile: "/images/profile-header.jpg",
};

const DAY_LABELS: { key: keyof BusinessHours; label: string }[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

function hoursSummary(hours: BusinessHours) {
  return DAY_LABELS.map(({ key, label }) => {
    const day = hours[key];
    return day.closed ? `${label} closed` : `${label} ${formatTime(day.open)}–${formatTime(day.close)}`;
  }).join(" · ");
}

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

function ProfileDetails({ created }: { created: CreatedShop | null }) {
  if (!created) {
    return <p className="mt-3 text-loop-green">Photos, hours, and bio</p>;
  }

  return (
    <div className="mt-3 space-y-2 text-sm text-loop-green">
      <p>{created.description || "No description yet."}</p>
      <p>{hoursSummary(created.hours)}</p>
      {created.onlineStore ? (
        <a href={created.onlineStore} className="inline-block font-semibold underline hover:text-loop-green-dark">
          {created.onlineStore}
        </a>
      ) : null}
    </div>
  );
}

export default function BusinessDashboard() {
  const created = useCreatedShop();
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

  const shown: OwnerBusiness = created
    ? {
        business_id: "local",
        owner_id: "local",
        name: created.name || "Your business",
        description: created.description,
        category: created.category || null,
        location: created.location || null,
      }
    : business;
  const heroImage = created ? created.imageSrc : IMAGES.business;
  const profileImage = created ? (created.images[1] ?? created.imageSrc) : IMAGES.profile;

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
          className={`mt-8 scroll-mt-6 overflow-hidden rounded-[28px] bg-loop-sage md:mt-10 md:scroll-mt-24 ${
            heroImage
              ? "md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-stretch lg:grid-cols-[280px_minmax(0,1fr)]"
              : ""
          }`}
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt={created ? "" : "maker working at the studio bench"}
              className="h-44 w-full object-cover md:h-full"
            />
          ) : null}
          <div className="p-5 md:p-7">
            <p className="text-sm text-loop-green">Signed in as</p>
            <h2 className="mt-1 font-serif text-2xl md:text-3xl">{shown.name}</h2>
            {created?.email ? <p className="mt-2 text-sm text-loop-green">{created.email}</p> : null}
            {shown.category ? <p className="mt-2 text-sm text-loop-green">{shown.category}</p> : null}
            {shown.location ? <p className="mt-2 text-sm text-loop-green">{shown.location}</p> : null}
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
            {profileImage ? (
              <img
                src={profileImage}
                alt={created ? "" : "handmade ceramics on the studio shelves"}
                className="h-36 w-full object-cover md:h-44"
              />
            ) : null}
            <div className="flex flex-1 flex-col p-5">
              <h2 className="font-serif text-xl md:text-2xl">public profile</h2>
              <ProfileDetails created={created} />
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
