// src/app/actions/location.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function saveLocation(lat: number | null, lng: number | null) {
  const store = await cookies();

  const valid =
    lat !== null &&
    lng !== null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180;

  if (valid) {
    store.set("user_location", JSON.stringify({ lat, lng }), {
      httpOnly: true, // browser JavaScript can't read it
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // forgotten after 1 hour
      path: "/",
    });
  } else {
    store.delete("user_location"); // blocked or invalid: clear any old one
  }

  redirect("/explore");
}