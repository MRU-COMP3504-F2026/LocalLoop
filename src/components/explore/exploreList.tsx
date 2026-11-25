"use client";

import { useEffect, useState } from "react";
import { BusinessCard } from "@/components/explore/businessCard";
import { listBusinesses, type BusinessRecord } from "@/lib/database";

export default function ExploreList() {
  const [businesses, setBusinesses] = useState<BusinessRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const DEFAULT_BUSINESS_IMAGE = "/images/business-1.jpg";


  useEffect(() => {
    let cancelled = false;

    listBusinesses()
      .then((rows) => {
        if (!cancelled) setBusinesses(rows);
      })
      .catch((loadError: Error) => {
        if (!cancelled) setError(loadError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-loop-green">Loading businesses...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (businesses.length === 0) {
    return <p className="text-loop-green">No businesses saved yet.</p>;
  }

  function getBusinessImages(business: BusinessRecord): string[] {
    const hours = business.opening_hours as { image_urls?: unknown } | null;
    const urls = hours?.image_urls;
    if (!Array.isArray(urls)) return [];
      return urls.filter((url): url is string => typeof url === "string" && url.length > 0);
  }

  function getBusinessImage(business: BusinessRecord): string {
    return getBusinessImages(business)[0] ?? DEFAULT_BUSINESS_IMAGE;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {businesses.map((business) => (
        <li key={business.business_id} className="rounded-[28px] bg-white p-5">
          <BusinessCard
            id={business.business_id}
            name={business.name}
            imageUrl={getBusinessImage(business)}
            category={business.category ?? ""}
            location={business.location ?? business.address ?? ""}
            description={business.description ?? ""}
          />
        </li>
      ))}
    </ul>
  );
}