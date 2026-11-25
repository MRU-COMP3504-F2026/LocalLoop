export type AddressSuggestion = {
  latitude: number;
  longitude: number;
  label: string;
  title: string;
  subtitle: string;
};

export async function searchAddresses(query: string, signal?: AbortSignal): Promise<AddressSuggestion[]> {
  const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { signal });
  const body = (await response.json().catch(() => null)) as { results?: AddressSuggestion[]; error?: string } | null;

  if (!response.ok || !body || !Array.isArray(body.results)) {
    throw new Error(body?.error || "Address lookup is unavailable right now.");
  }

  return body.results;
}
