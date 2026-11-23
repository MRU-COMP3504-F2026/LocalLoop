// src/components/home/UseLocationButton.tsx
"use client";

import { useState, useTransition } from "react";
import { saveLocation } from "@/lib/location";

export default function UseLocationButton() {
  const [locating, setLocating] = useState(false); // waiting on the browser popup
  const [isPending, startTransition] = useTransition(); // Server Action running

  const loading = locating || isPending;

  function save(lat: number | null, lng: number | null) {
    setLocating(false); // popup is done, so reset this flag
    startTransition(async () => {
      await saveLocation(lat, lng); // redirects to /explore when finished
    });
  }

  function handleClick() {
    if (!("geolocation" in navigator)) {
      save(null, null);
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => save(pos.coords.latitude, pos.coords.longitude),
      () => save(null, null),
      { timeout: 10000 }
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-loop-green-dark px-5 text-sm font-semibold text-white hover:bg-loop-green disabled:opacity-70"
    >
      {loading ? "Finding you..." : "Use my location"}
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="11" r="2.1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </button>
  );
}