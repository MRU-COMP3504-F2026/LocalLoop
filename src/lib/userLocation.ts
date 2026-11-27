export const USER_LOCATION_STORAGE_KEY = "localloop.userLocation";

export type UserLocationSource = "device" | "address";

export type UserLocation = {
  latitude: number;
  longitude: number;
  label: string;
  source: UserLocationSource;
  accuracy: number | null;
  updatedAt: string;
};

function isUserLocation(value: unknown): value is UserLocation {
  if (!value || typeof value !== "object") return false;

  const row = value as Partial<UserLocation>;
  const latitude = row.latitude;
  const longitude = row.longitude;
  if (typeof latitude !== "number" || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) return false;
  if (typeof longitude !== "number" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) return false;
  if (typeof row.label !== "string" || row.label.trim().length === 0) return false;
  if (row.source !== "device" && row.source !== "address") return false;
  if (row.accuracy !== null && (typeof row.accuracy !== "number" || !Number.isFinite(row.accuracy))) return false;
  return typeof row.updatedAt === "string";
}

export function readStoredUserLocation(): UserLocation | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(USER_LOCATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isUserLocation(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredUserLocation(location: UserLocation) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(USER_LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch {
    // private browsing throws, location still works for this visit
  }
}
