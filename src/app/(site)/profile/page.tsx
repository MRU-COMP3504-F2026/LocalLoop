"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useAccount } from "@/context/accounts/accountContext";
import { useBusiness, type BusinessHours } from "@/context/accounts/businessContext";

const CATEGORY_OPTIONS = [
  "Ceramics",
  "Handmade",
  "Workshops",
  "Food & Beverage",
  "Clothing",
  "Jewelry",
  "Services",
  "Other",
];

const DAYS = [
  { key: "monday", short: "Mon", label: "Monday" },
  { key: "tuesday", short: "Tue", label: "Tuesday" },
  { key: "wednesday", short: "Wed", label: "Wednesday" },
  { key: "thursday", short: "Thu", label: "Thursday" },
  { key: "friday", short: "Fri", label: "Friday" },
  { key: "saturday", short: "Sat", label: "Saturday" },
  { key: "sunday", short: "Sun", label: "Sunday" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

type FormState = {
  name: string;
  location: string;
  email: string;
  password: string;
  story: string;
  categories: string[];
  onlineStore: string;
  hours: BusinessHours;
  files: File[];
};

const fieldClass =
  "w-full rounded-2xl border border-transparent bg-loop-cream px-4 text-sm text-loop-green-dark outline-none transition-colors duration-200 focus:border-loop-green";

const primaryButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-loop-green-dark px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-loop-green sm:w-auto sm:px-8";

const secondaryButtonClass =
  "inline-flex w-full items-center justify-center rounded-full border border-loop-border bg-white px-5 py-3.5 text-center text-sm font-semibold text-loop-green-dark transition-colors duration-200 hover:bg-loop-sage sm:w-auto sm:px-8";

function compactTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const hour = hours % 12 || 12;
  return minutes ? `${hour}:${String(minutes).padStart(2, "0")}` : String(hour);
}

function summarizeHours(hours: BusinessHours) {
  const open: string[] = [];
  const closed: string[] = [];
  let index = 0;

  while (index < DAYS.length) {
    const day = DAYS[index];
    const schedule = hours[day.key];

    if (schedule.closed) {
      closed.push(`${day.short} closed`);
      index += 1;
      continue;
    }

    let end = index;
    while (end + 1 < DAYS.length) {
      const next = hours[DAYS[end + 1].key];
      if (next.closed || next.open !== schedule.open || next.close !== schedule.close) break;
      end += 1;
    }

    const span =
      index === end ? day.short : `${day.short}–${DAYS[end].short}`;
    open.push(`${span} ${compactTime(schedule.open)}–${compactTime(schedule.close)}`);
    index = end + 1;
  }

  return [...open, ...closed].join(" · ");
}

function pinLabel(location: string) {
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) return parts.slice(1).join(" · ");
  if (location.trim()) return location.trim();
  return "Add a location to set your map pin";
}

function initialForm(
  account: { username: string; email: string; password: string; confirmPassword: string },
  business: {
    location: string;
    description: string;
    category: string[];
    onlineStore: string;
    openingHours: BusinessHours;
    images: File[];
  },
): FormState {
  return {
    name: account.username,
    location: business.location,
    email: account.email,
    password: account.confirmPassword || account.password,
    story: business.description,
    categories: business.category,
    onlineStore: business.onlineStore,
    hours: business.openingHours,
    files: business.images,
  };
}

export default function ProfilePage() {
  const photoInputId = useId();
  const locationRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { accountData, setAccountData } = useAccount();
  const { businessData, setBusinessData } = useBusiness();
  const [form, setForm] = useState<FormState>(() => initialForm(accountData, businessData));
  const [hoursOpen, setHoursOpen] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [saved, setSaved] = useState(false);

  const [uploadedPhotos, setUploadedPhotos] = useState<{ file: File; url: string }[]>([]);

  useEffect(() => {
    // making the url in render gets revoked and the photo just breaks
    const next = form.files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setUploadedPhotos(next);
    return () => {
      next.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [form.files]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function removeCategory(category: string) {
    update(
      "categories",
      form.categories.filter((item) => item !== category),
    );
  }

  function addCategory(category: string) {
    if (form.categories.includes(category) || form.categories.length >= 3) return;
    update("categories", [...form.categories, category]);
    setAddingCategory(false);
  }

  function updateHours(day: DayKey, patch: Partial<BusinessHours[DayKey]>) {
    update("hours", {
      ...form.hours,
      [day]: { ...form.hours[day], ...patch },
    });
  }

  function onPhotosSelected(fileList: FileList | null) {
    const next = Array.from(fileList ?? []);
    if (next.length === 0) return;
    update("files", [...form.files, ...next]);
  }

  function removePhoto(index: number) {
    update(
      "files",
      form.files.filter((_, photoIndex) => photoIndex !== index),
    );
  }

  function saveProfile() {
    setAccountData((current) => ({
      ...current,
      username: form.name,
      email: form.email,
      ...(form.password
        ? { password: form.password, confirmPassword: form.password }
        : {}),
    }));
    setBusinessData((current) => ({
      ...current,
      location: form.location,
      description: form.story,
      category: form.categories,
      onlineStore: form.onlineStore,
      openingHours: form.hours,
      images: form.files,
    }));
    setSaved(true);
  }

  const availableCategories = CATEGORY_OPTIONS.filter(
    (category) => !form.categories.includes(category),
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-loop-green">business space</p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">
            your business profile
          </h1>
          <p className="mt-3 max-w-xl text-loop-green md:text-lg">
            Put your roots on the map. A little about your business goes a long way.
          </p>
        </div>
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-loop-sage px-3 py-1.5 text-xs text-loop-green-dark md:mb-1">
          <span className="h-2 w-2 rounded-full bg-loop-green-dark" aria-hidden="true" />
          Profile live · Editing published details
        </p>
      </header>

      <form
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          saveProfile();
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-[28px] bg-white p-5 md:p-7">
            <h2 className="font-serif text-xl md:text-2xl">account</h2>
            <div className="mt-4 space-y-4">
              <label className="block text-sm">
                Business name *
                <input
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  className={`${fieldClass} mt-2 h-11`}
                  required
                />
              </label>
              <label className="block text-sm">
                Business email *
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  className={`${fieldClass} mt-2 h-11`}
                  required
                />
              </label>
            </div>
          </section>

          <section className="rounded-[28px] bg-white p-5 md:p-7">
            <h2 className="font-serif text-xl md:text-2xl">the shop</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm" htmlFor="profile-location">
                  Location *
                </label>
                <input
                  id="profile-location"
                  ref={locationRef}
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  className={`${fieldClass} mt-2 h-11`}
                  required
                />
                <p className="mt-2 text-xs text-loop-green">
                  {pinLabel(form.location)}
                  {" · "}
                  <button
                    type="button"
                    className="underline transition-colors duration-200 hover:text-loop-green-dark"
                    onClick={() => locationRef.current?.focus()}
                  >
                    Change map pin
                  </button>
                </p>
              </div>
              <label className="block text-sm">
                Tell your story *
                <textarea
                  value={form.story}
                  onChange={(event) => update("story", event.target.value)}
                  rows={5}
                  className={`${fieldClass} mt-2 resize-none py-3`}
                  required
                />
              </label>
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-[28px] bg-white p-5 md:p-7">
          <h2 className="font-serif text-xl md:text-2xl">details</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <fieldset>
              <legend className="text-sm">
                Categories * <span className="text-loop-green">· Choose up to 3</span>
              </legend>
              <div className="relative mt-3 flex flex-wrap items-center gap-2">
                {form.categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="rounded-full bg-loop-sage px-3 py-1.5 text-xs text-loop-green-dark transition-colors duration-200 hover:bg-loop-green-dark hover:text-white"
                  >
                    {category} <span aria-hidden="true">×</span>
                    <span className="sr-only">Remove {category}</span>
                  </button>
                ))}
                {form.categories.length < 3 && (
                  <button
                    type="button"
                    aria-expanded={addingCategory}
                    onClick={() => setAddingCategory((open) => !open)}
                    className="rounded-full border border-loop-border bg-loop-cream px-3 py-1.5 text-xs transition-colors duration-200 hover:bg-loop-sage"
                  >
                    +
                  </button>
                )}
                {addingCategory && availableCategories.length > 0 && (
                  <div className="absolute top-full left-0 z-10 mt-2 w-52 rounded-2xl border border-loop-border bg-white p-2 shadow-sm">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => addCategory(category)}
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 hover:bg-loop-sage"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </fieldset>

            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-lg md:text-xl">Show your local story</h3>
                <button
                  type="button"
                  className="text-xs text-loop-green underline transition-colors duration-200 hover:text-loop-green-dark"
                  onClick={() => photoInputRef.current?.click()}
                >
                  Edit photos
                </button>
              </div>
              {uploadedPhotos.length === 0 && (
                <p className="mt-3 text-sm text-loop-green">No photos added during account creation.</p>
              )}
              <div className="mt-3 grid grid-cols-3 gap-3">
                {uploadedPhotos.map((photo, index) => (
                  <figure key={photo.url} className="relative min-w-0">
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={photo.url}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label={`Remove photo ${index + 1}`}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-loop-green-dark text-sm text-white transition-colors duration-200 hover:bg-red-700"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <figcaption className="mt-1 text-[0.7rem] text-loop-green">Cover photo</figcaption>
                    )}
                  </figure>
                ))}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-loop-sage text-xs text-loop-green-dark transition-colors duration-200 hover:bg-loop-green-dark hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="mb-1 h-5 w-5" fill="none" aria-hidden="true">
                    <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="9" cy="10" r="1.4" fill="currentColor" />
                    <path d="m7 16 3.2-3.2L16 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Add photo
                </button>
              </div>
              <input
                id={photoInputId}
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                  onPhotosSelected(event.target.files);
                  event.target.value = "";
                }}
              />
            </div>

            <label className="block text-sm">
              Existing online store
              <input
                type="url"
                value={form.onlineStore}
                onChange={(event) => update("onlineStore", event.target.value)}
                className={`${fieldClass} mt-2 h-11`}
              />
              <span className="mt-2 block text-xs leading-relaxed text-loop-green">
                Neighbors will visit this website to shop or book. No in-app checkout is currently available.
              </span>
            </label>

            <div>
              <p className="text-sm">Opening hours</p>
              <button
                type="button"
                aria-expanded={hoursOpen}
                onClick={() => setHoursOpen((open) => !open)}
                className={`${fieldClass} mt-2 flex h-11 items-center justify-between gap-3 px-4 text-left transition-colors duration-200 hover:border-loop-green`}
              >
                <span className="truncate">{summarizeHours(form.hours)}</span>
                <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 transition-transform duration-200 ${hoursOpen ? "rotate-180" : ""}`} fill="none" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              {hoursOpen && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {DAYS.map((day) => (
                    <div key={day.key} className="flex flex-wrap items-center gap-2 rounded-2xl bg-loop-cream px-3 py-2 text-sm">
                      <span className="w-20">{day.label}</span>
                      <label className="flex items-center gap-1 text-xs text-loop-green">
                        <input
                          type="checkbox"
                          checked={form.hours[day.key].closed}
                          onChange={(event) => updateHours(day.key, { closed: event.target.checked })}
                        />
                        Closed
                      </label>
                      {!form.hours[day.key].closed && (
                        <>
                          <input
                            type="time"
                            value={form.hours[day.key].open}
                            onChange={(event) => updateHours(day.key, { open: event.target.value })}
                            className="rounded-lg border border-loop-border bg-white px-2 py-1"
                          />
                          <span className="text-loop-green">to</span>
                          <input
                            type="time"
                            value={form.hours[day.key].close}
                            onChange={(event) => updateHours(day.key, { close: event.target.value })}
                            className="rounded-lg border border-loop-border bg-white px-2 py-1"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="submit" className={primaryButtonClass}>
            {saved ? "Saved" : "Save profile changes"}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <Link href="/business/demo" className={secondaryButtonClass}>
            Preview as a neighbor
          </Link>
        </div>
      </form>
    </main>
  );
}
