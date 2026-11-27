"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useUserLocation } from "@/context/userLocationContext";
import { searchAddresses, type AddressSuggestion } from "@/lib/geocodeAddress";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="11" r="2.1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function LocateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.5 15.5 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function UserLocationPanel() {
  const { location, status, error, useDeviceLocation, chooseAddress } = useUserLocation();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [settledQuery, setSettledQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // focus after a pick was reopening the menu
  const skipFocus = useRef(false);
  const pickingDevice = useRef(false);

  useEffect(() => {
    if (editing) return;
    // leave "current location" up while the browser is still thinking
    if (pickingDevice.current && location?.source !== "device" && status !== "denied" && status !== "error") return;
    pickingDevice.current = false;
    setQuery(location?.label ?? "");
  }, [editing, location?.label, status]);

  useEffect(() => {
    if (!open || !editing) return undefined;

    const trimmed = query.trim();
    if (trimmed.length < 3 || trimmed === location?.label) {
      setSuggestions([]);
      setSearching(false);
      setSettledQuery("");
      setSearchError(null);
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      searchAddresses(trimmed, controller.signal)
        .then((results) => {
          setSuggestions(results);
          setSettledQuery(trimmed);
          setSearchError(null);
          setActiveIndex(results.length > 0 ? 1 : 0);
        })
        .catch((lookupError: unknown) => {
          if (lookupError instanceof DOMException && lookupError.name === "AbortError") return;
          setSuggestions([]);
          setSearchError(lookupError instanceof Error ? lookupError.message : "Address lookup is unavailable right now.");
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
      setSearching(false);
    };
  }, [editing, location?.label, open, query]);

  function closeChoices() {
    skipFocus.current = true;
    setEditing(false);
    setOpen(false);
  }

  function selectPlace(place: AddressSuggestion) {
    chooseAddress(place);
    setQuery(place.label);
    setSuggestions([]);
    closeChoices();
  }

  function selectDevice() {
    pickingDevice.current = true;
    setQuery("Current location");
    useDeviceLocation();
    closeChoices();
  }

  // mousedown, blur was closing the list before the click registered
  function pressChoice(event: MouseEvent, choose: () => void) {
    event.preventDefault();
    choose();
  }

  const trimmed = query.trim();
  const showPlaces = editing && trimmed.length >= 3 && trimmed !== location?.label;
  const optionCount = 1 + (showPlaces ? suggestions.length : 0);

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % optionCount);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + optionCount) % optionCount);
    } else if (event.key === "Escape") {
      setOpen(false);
      setEditing(false);
    } else if (event.key === "Enter") {
      event.preventDefault();
      confirmHighlighted();
    }
  }

  // same as enter. search itself isn't wired up yet
  function confirmHighlighted() {
    if (!open) return;
    if (activeIndex === 0) {
      selectDevice();
      return;
    }
    const place = suggestions[activeIndex - 1];
    if (place) selectPlace(place);
  }

  const message = error ?? searchError;

  return (
    <section aria-label="Your location" className="mb-8">
      <h2 className="font-serif text-2xl">Your location</h2>

      <div className="relative mt-4">
        <div className="overflow-hidden rounded-[28px] border border-loop-border bg-white">
          <div className="flex items-center gap-3 py-2 pr-2 pl-4">
            <span className="text-loop-green">
              <PinIcon />
            </span>
            <label className="sr-only" htmlFor="user-address">
              Address
            </label>
            <input
              id="user-address"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              value={query}
              placeholder="Enter your address"
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value);
                setEditing(true);
                setOpen(true);
                setActiveIndex(0);
              }}
              onFocus={(event) => {
                if (skipFocus.current) {
                  skipFocus.current = false;
                  return;
                }
                setEditing(true);
                setOpen(true);
                event.target.select();
              }}
              onBlur={() => {
                setOpen(false);
                setEditing(false);
              }}
              onKeyDown={onInputKeyDown}
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-loop-green"
            />
            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                confirmHighlighted();
              }}
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-loop-green-dark px-4 text-sm font-semibold text-white hover:bg-loop-green"
            >
              <SearchIcon />
              Search
            </button>
          </div>

          {open ? (
            <ul id={listId} role="listbox" aria-label="Address suggestions" className="border-t border-loop-border">
              <li role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={activeIndex === 0}
                  onMouseDown={(event) => pressChoice(event, selectDevice)}
                  onClick={(event) => pressChoice(event, selectDevice)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                    activeIndex === 0 ? "bg-loop-sage" : "hover:bg-loop-cream"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-loop-sage text-loop-green-dark">
                    <LocateIcon />
                  </span>
                  <span className="text-sm font-semibold">
                    {status === "requesting" ? "Asking for permission…" : "Current location"}
                  </span>
                </button>
              </li>

              {showPlaces && searching ? <li className="px-4 py-3 text-sm text-loop-green">Searching places…</li> : null}

              {showPlaces
                ? suggestions.map((place, index) => (
                    <li key={`${place.latitude}-${place.longitude}-${place.label}`} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={activeIndex === index + 1}
                        onMouseDown={(event) => pressChoice(event, () => selectPlace(place))}
                        onClick={(event) => pressChoice(event, () => selectPlace(place))}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                          activeIndex === index + 1 ? "bg-loop-sage" : "hover:bg-loop-cream"
                        }`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-loop-cream text-loop-green-dark">
                          <PinIcon />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{place.title}</span>
                          {place.subtitle ? (
                            <span className="block truncate text-xs text-loop-green">{place.subtitle}</span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  ))
                : null}

              {showPlaces && !searching && settledQuery === trimmed && suggestions.length === 0 && !searchError ? (
                <li className="px-4 py-3 text-sm text-loop-green">No matching places</li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </div>

      {message ? (
        <p role="alert" className="mt-3 text-sm text-loop-red-text">
          {message}
        </p>
      ) : null}
    </section>
  );
}
