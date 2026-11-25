"use client";

import { useEffect, useState } from "react";
import { BusinessCard } from "@/components/explore/businessCard";
import { listBusinesses, type BusinessRecord } from "@/lib/database";

export default function ExploreList() {
  const [businesses, setBusinesses] = useState<BusinessRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listBusinesses()
      .then((rows) => {
        if (!cancelled) setBusinesses(rows);
      })
      .catch((loadError: Error) => {
        if (!cancelled) setError(loadError.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (businesses.length === 0) {
    return <p className="text-loop-green">No businesses saved yet.</p>;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {businesses.map((business) => (
        <li key={business.business_id} className="rounded-[28px] bg-white p-5">
          <BusinessCard
            id={business.business_id}
            name={business.name}
            imageUrl="/images/business-1.jpg"
            category={business.category ?? ""}
            location={business.location ?? business.address ?? ""}
            description={business.description ?? ""}
          />
        </li>
      ))}
    </ul>
  );
}
