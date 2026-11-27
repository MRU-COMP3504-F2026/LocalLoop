"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { AddressSuggestion } from "@/lib/geocodeAddress";
import {
  readStoredUserLocation,
  writeStoredUserLocation,
  type UserLocation,
} from "@/lib/userLocation";

export type UserLocationStatus = "idle" | "requesting" | "watching" | "saving" | "denied" | "error";

type UserLocationContextValue = {
  location: UserLocation | null;
  status: UserLocationStatus;
  error: string | null;
  ready: boolean;
  useDeviceLocation: () => void;
  chooseAddress: (place: AddressSuggestion) => void;
};

const UserLocationContext = createContext<UserLocationContextValue | undefined>(undefined);

function deviceErrorMessage(code: number) {
  if (code === 1) return "Location permission was denied. You can type an address instead.";
  if (code === 3) return "Finding your location timed out. Try again, or type an address.";
  return "Your location is unavailable right now. You can type an address instead.";
}

async function geolocationAlreadyAllowed() {
  try {
    if (!navigator.permissions?.query) return false;
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state === "granted";
  } catch {
    return false;
  }
}

export function UserLocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<UserLocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const watchId = useRef<number | null>(null);
  const watchGeneration = useRef(0);
  const resumeToken = useRef(0);
  // a slow gps update was replacing the address they just picked
  const followDevice = useRef(false);

  const stopWatching = useCallback(() => {
    watchGeneration.current += 1;
    if (watchId.current != null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const applyLocation = useCallback((next: UserLocation) => {
    setLocation(next);
    writeStoredUserLocation(next);
  }, []);

  const useDeviceLocation = useCallback(() => {
    resumeToken.current += 1;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("This browser cannot read your location. Type an address instead.");
      return;
    }

    stopWatching();
    followDevice.current = true;
    const generation = watchGeneration.current;
    setError(null);
    setStatus("requesting");

    let failed = false;
    let gotWatch = false;
    let gotFix = false;
    let id = 0;

    function save(position: GeolocationPosition) {
      if (!followDevice.current || failed || watchGeneration.current !== generation) return;
      gotFix = true;
      applyLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        label: "Current location",
        source: "device",
        accuracy: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
        updatedAt: new Date().toISOString(),
      });
      setStatus("watching");
      setError(null);
    }

    // wifi/cache shows up faster than gps. the watch still replaces it
    navigator.geolocation.getCurrentPosition?.(
      (position) => {
        if (gotWatch) return;
        save(position);
      },
      () => undefined,
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 4000 },
    );

    id = navigator.geolocation.watchPosition(
      (position) => {
        gotWatch = true;
        save(position);
      },
      (positionError) => {
        if (watchGeneration.current !== generation) return;
        if (gotFix && positionError.code !== 1) return;
        failed = true;
        if (watchId.current === id) watchId.current = null;
        const denied = positionError.code === 1;
        setStatus(denied ? "denied" : "error");
        setError(deviceErrorMessage(positionError.code));
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );

    if (failed || watchGeneration.current !== generation) {
      navigator.geolocation.clearWatch(id);
      return;
    }

    watchId.current = id;
  }, [applyLocation, stopWatching]);

  const chooseAddress = useCallback(
    (place: AddressSuggestion) => {
      resumeToken.current += 1;
      followDevice.current = false;
      stopWatching();
      applyLocation({
        latitude: place.latitude,
        longitude: place.longitude,
        label: place.label,
        source: "address",
        accuracy: null,
        updatedAt: new Date().toISOString(),
      });
      setStatus("idle");
      setError(null);
    },
    [applyLocation, stopWatching],
  );

  useEffect(() => {
    const token = resumeToken.current;
    let cancelled = false;

    async function restore() {
      const stored = readStoredUserLocation();
      if (cancelled) return;
      if (stored) setLocation(stored);
      setReady(true);

      if (stored?.source !== "device") return;
      if (!(await geolocationAlreadyAllowed())) return;
      if (cancelled || token !== resumeToken.current) return;
      useDeviceLocation();
    }

    void restore();

    return () => {
      cancelled = true;
      stopWatching();
    };
  }, [stopWatching, useDeviceLocation]);

  return (
    <UserLocationContext.Provider
      value={{
        location,
        status,
        error,
        ready,
        useDeviceLocation,
        chooseAddress,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocation() {
  const context = useContext(UserLocationContext);

  if (!context) {
    throw new Error("useUserLocation must be used inside UserLocationProvider");
  }

  return context;
}
