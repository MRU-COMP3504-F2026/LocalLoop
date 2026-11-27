/**
 * @jest-environment node
 */
// photon lookup. a typed house number still shows up when the map only has the street
import { GET } from "@/app/api/geocode/route";

function photonResponse(features: unknown[]) {
  return {
    ok: true,
    json: async () => ({ type: "FeatureCollection", features }),
  };
}

describe("GET /api/geocode", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("returns a street address with its house number", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      photonResponse([
        {
          properties: {
            type: "house",
            housenumber: "800",
            street: "Macleod Trail SE",
            district: "Downtown Commercial Core",
            city: "Calgary",
            state: "Alberta",
          },
          geometry: { coordinates: [-114.0564712, 51.0455062] },
        },
      ]),
    );

    const response = await GET(new Request("http://localhost/api/geocode?q=800%20Macleod%20Trail%20SE"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      results: [
        {
          latitude: 51.0455062,
          longitude: -114.0564712,
          title: "800 Macleod Trail SE",
          subtitle: "Downtown Commercial Core, Calgary, Alberta",
          label: "800 Macleod Trail SE, Downtown Commercial Core, Calgary, Alberta",
        },
      ],
    });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers["User-Agent"]).toContain("LocalLoop");
  });

  it("keeps a typed house number on the matching street", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      photonResponse([
        {
          properties: {
            type: "street",
            name: "Kensington Road NW",
            district: "Hillhurst",
            city: "Calgary",
            state: "Alberta",
          },
          geometry: { coordinates: [-114.0932563, 51.0525217] },
        },
        {
          properties: {
            type: "street",
            name: "Kensington Road NW",
            district: "West Hillhurst",
            city: "Calgary",
            state: "Alberta",
          },
          geometry: { coordinates: [-114.114398, 51.0525003] },
        },
      ]),
    );

    const response = await GET(
      new Request("http://localhost/api/geocode?q=15%20Kensington%20Road%20NW%20Calgary"),
    );
    const body = await response.json();

    expect(body.results).toEqual([
      {
        latitude: 51.0525217,
        longitude: -114.0932563,
        title: "15 Kensington Road NW",
        subtitle: "Hillhurst, Calgary, Alberta",
        label: "15 Kensington Road NW, Hillhurst, Calgary, Alberta",
      },
    ]);
  });

  it("uses the typed house number instead of a nearby one on that street", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      photonResponse([
        {
          properties: {
            type: "house",
            housenumber: "3320",
            street: "17 Avenue SW",
            district: "Killarney",
            city: "Calgary",
            state: "Alberta",
          },
          geometry: { coordinates: [-114.1347366, 51.0380995] },
        },
        {
          properties: {
            type: "house",
            housenumber: "1234",
            street: "Lansdowne Avenue SW",
            district: "Elbow Park",
            city: "Calgary",
            state: "Alberta",
          },
          geometry: { coordinates: [-114.0892231, 51.0160255] },
        },
        {
          properties: {
            type: "street",
            name: "17 Avenue SW",
            district: "Signal Hill",
            city: "Calgary",
            state: "Alberta",
          },
          geometry: { coordinates: [-114.1821685, 51.0375218] },
        },
      ]),
    );

    const response = await GET(new Request("http://localhost/api/geocode?q=1234%2017%20Avenue%20SW%20Calgary"));
    const body = await response.json();

    expect(body.results[0]).toEqual({
      latitude: 51.0375218,
      longitude: -114.1821685,
      title: "1234 17 Avenue SW",
      subtitle: "Signal Hill, Calgary, Alberta",
      label: "1234 17 Avenue SW, Signal Hill, Calgary, Alberta",
    });
    expect(body.results.map((place: { title: string }) => place.title)).not.toContain("3320 17 Avenue SW");
    expect(body.results.map((place: { title: string }) => place.title)).not.toContain("1234 Lansdowne Avenue SW");
  });

  it("rejects an empty address", async () => {
    const response = await GET(new Request("http://localhost/api/geocode?q=%20%20"));
    expect(response.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns no places when nothing matches", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(photonResponse([]));

    const response = await GET(new Request("http://localhost/api/geocode?q=nowhere-xyz"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ results: [] });
  });
});
