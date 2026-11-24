
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google API key is missing" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
        },
        body: JSON.stringify({
          origin: {
            location: {
              latLng: {
                latitude: 51.0447,
                longitude: -114.0719,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: 51.0600,
                longitude: -114.0850,
              },
            },
          },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_UNAWARE",
          units: "METRIC",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Google Routes API request failed",
          details: data,
        },
        { status: response.status }
      );
    }

    const route = data.routes?.[0];

    if (!route) {
      return NextResponse.json(
        { error: "No route was returned" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      distanceKm: route.distanceMeters / 1000,
      duration: route.duration,
      rawResponse: route,
    });
  } catch (error) {
    console.error("Routes API error:", error);

    return NextResponse.json(
      { error: "Something went wrong calling Google Routes API" },
      { status: 500 }
    );
  }
}
