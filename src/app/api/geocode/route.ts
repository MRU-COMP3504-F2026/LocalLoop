import { NextResponse } from "next/server";

const PHOTON_URL = "https://photon.komoot.io/api/";

type PhotonProperties = {
  name?: string;
  street?: string;
  housenumber?: string;
  district?: string;
  city?: string;
  state?: string;
  type?: string;
  osm_key?: string;
};

type PhotonFeature = {
  properties?: PhotonProperties;
  geometry?: { coordinates?: [number, number] };
};

type Suggestion = {
  latitude: number;
  longitude: number;
  title: string;
  subtitle: string;
  label: string;
};

// avenue/sw/etc show up on tons of streets, so they don't count as "the same street"
const skipWords = new Set([
  "street", "st", "avenue", "ave", "av", "road", "rd", "drive", "dr",
  "boulevard", "blvd", "crescent", "cres", "cr", "trail", "trl", "tr",
  "place", "pl", "court", "ct", "lane", "ln", "way", "ne", "nw", "se", "sw",
]);

function clean(value: string) {
  return value.toLowerCase().replace(/[.,#]/g, " ").replace(/\s+/g, " ").trim();
}

function words(value: string) {
  return clean(value).split(" ").filter((word) => word.length > 1);
}

function sameStreet(street: string, query: string) {
  const typed = new Set(words(query));
  const streetWords = words(street);
  const important = streetWords.filter((word) => !skipWords.has(word));
  const needed = important.length > 0 ? important : streetWords;
  if (needed.length === 0) return false;
  for (const word of needed) {
    if (!typed.has(word)) return false;
  }
  return true;
}

function suggestionsFromFeatures(features: PhotonFeature[], query: string): Suggestion[] {
  const typedNumber = query.match(/^(\d+[a-zA-Z]?)\b/)?.[1] ?? "";
  const rows: Array<Suggestion & { rank: number; key: string }> = [];
  let foundStreet = false;

  for (const feature of features) {
    const properties = feature.properties ?? {};
    const isStreet = properties.type === "street" || properties.osm_key === "highway";
    const street = properties.street || (isStreet ? properties.name : "") || "";
    if (street && sameStreet(street, query)) foundStreet = true;
  }

  for (const feature of features) {
    const properties = feature.properties ?? {};
    const [longitude, latitude] = feature.geometry?.coordinates ?? [];
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;

    const isStreet = properties.type === "street" || properties.osm_key === "highway";
    const street = properties.street || (isStreet ? properties.name : "") || "";
    const onStreet = street !== "" && sameStreet(street, query);
    // once we know the street, drop the other "1234 somewhere avenue" hits
    if (foundStreet && !onStreet) continue;

    const listedNumber = properties.housenumber ?? "";
    const exact = typedNumber !== "" && listedNumber !== "" && clean(listedNumber) === clean(typedNumber);
    const numberIsTheStreet = typedNumber !== "" && words(street).includes(clean(typedNumber));
    // photon's house is often a neighbour, keep the number they actually typed
    const useTyped = typedNumber !== "" && onStreet && !exact && !numberIsTheStreet;
    const number = useTyped ? typedNumber : listedNumber;
    const placeName = street || properties.name || "Place";
    const title = [number, placeName].filter(Boolean).join(" ");
    const subtitle = [properties.district, properties.city, properties.state]
      .filter((part) => part && part !== title)
      .join(", ");
    const label = [title, subtitle].filter(Boolean).join(", ");

    let rank = 3;
    if (exact) rank = 0;
    else if (useTyped && !listedNumber) rank = 1;
    else if (useTyped || isStreet) rank = 2;

    rows.push({
      latitude,
      longitude,
      title,
      subtitle,
      label,
      rank,
      key: [number, placeName, properties.city, properties.state].join("|").toLowerCase(),
    });
  }

  const kept = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    const previous = kept.get(row.key);
    if (previous && previous.rank <= row.rank) continue;
    kept.set(row.key, row);
  }

  const results: Suggestion[] = [];
  const ordered = [...kept.values()].sort((a, b) => a.rank - b.rank);
  for (const row of ordered) {
    if (results.length === 6) break;
    results.push({
      latitude: row.latitude,
      longitude: row.longitude,
      title: row.title,
      subtitle: row.subtitle,
      label: row.label,
    });
  }
  return results;
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (!query || query.length > 200) {
    return NextResponse.json({ error: "Type an address to look up." }, { status: 400 });
  }

  const url = new URL(PHOTON_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", "en");

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "LocalLoop/0.1 (COMP3504 student project)",
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Address lookup is unavailable right now." }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: "Address lookup is unavailable right now." }, { status: 502 });
  }

  const payload = (await response.json().catch(() => null)) as { features?: PhotonFeature[] } | null;
  const results = suggestionsFromFeatures(payload?.features ?? [], query);

  return NextResponse.json({ results });
}
