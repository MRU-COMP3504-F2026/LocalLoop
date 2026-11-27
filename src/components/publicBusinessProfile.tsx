"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBusiness, listProducts, listServices, readHours, readImageUrls, readShowEmail, type BusinessRecord} from "@/lib/database";
import type { BusinessHours } from "@/context/accounts/businessContext";
import { previewWords } from "@/lib/offering";
import type { ProductData } from "@/context/productContext";
import type { ServiceData } from "@/context/serviceContext";
import { DAYS, formatTime } from "@/lib/hours";


function GalleryCarousel({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = ((index % count) + count) % count;

  function show(next: number) {
    setIndex((next + count) % count);
  }

  return (
    <section className="mt-4 rounded-[28px] bg-white p-5 md:p-7">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-serif text-xl md:text-2xl">Gallery</h2>
        {count > 1 ? (
          <p className="text-sm text-loop-green">
            {current + 1} / {count}
          </p>
        ) : null}
      </div>
      <div className="relative mt-4">
        <img
          src={images[current]}
          alt={`${name} photo ${current + 1}`}
          className="aspect-[4/3] w-full rounded-2xl object-cover md:aspect-[2/1]"
        />
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => show(current - 1)}
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-loop-green-dark shadow-sm transition-colors duration-200 hover:bg-loop-sage"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => show(current + 1)}
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-loop-green-dark shadow-sm transition-colors duration-200 hover:bg-loop-sage"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((src, dot) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photo ${dot + 1}`}
              aria-current={dot === current ? "true" : undefined}
              onClick={() => setIndex(dot)}
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
                dot === current ? "bg-loop-green-dark" : "bg-loop-sage hover:bg-loop-green"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function formatMoney(price: number) {
  const rounded = Math.round(price * 100) / 100;
  const amount = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  return `$${amount} CAD`;
}

export default function PublicBusinessProfile() {
  const params = useParams<{ id: string }>();
  const routeId = typeof params?.id === "string" ? params.id : "";
  const [record, setRecord] = useState<BusinessRecord | null>(null);
  const [dbProducts, setDbProducts] = useState<ProductData[]>([]);
  const [dbServices, setDbServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!routeId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setRecord(null);
    setDbProducts([]);
    setDbServices([]);

    Promise.all([getBusiness(routeId), listProducts(routeId), listServices(routeId)])
      .then(([business, products, services]) => {
        if (cancelled) return;
        setRecord(business);
        setDbProducts(products);
        setDbServices(services);
      })
      .catch((loadError: Error) => {
        console.error(loadError);
        if (!cancelled) setError("Couldn't load this business.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [routeId]);

  const offerings = [
  ...dbProducts
    .filter((p) => p.productName.trim())
    .map((p) => ({
      id: p.productId ?? p.productName,
      kind: "Product" as const,
      name: p.productName,
      price: p.productPrice,
      description: previewWords(p.productDescription),
      imageUrl: p.imageUrl ?? "",
      details: p.details,
      href: `/business/${routeId}/product/${p.productId}`,
    })),
  ...dbServices
    .filter((s) => s.serviceName.trim())
    .map((s) => ({
      id: s.serviceId ?? s.serviceName,
      kind: "Service" as const,
      name: s.serviceName,
      price: s.servicePrice,
      description: s.serviceDescription,
      imageUrl: s.imageUrl ?? "",
      details: s.details,
      href: `/business/${routeId}/service/${s.serviceId}`,
    })),
];

  const view = record
  ? {
      name: record.name,
      location: record.location ?? record.address ?? "",
      description: record.description ?? "",
      email: record.email ?? "",
      categories: record.category?.split(" · ").filter(Boolean) ?? [],
      onlineStore: record.online_store ?? "",
      hours: readHours(record.opening_hours),
      images: readImageUrls(record.opening_hours),
      showEmail: readShowEmail(record.opening_hours),
    }
  : null;



  if (loading) {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pt-8 pb-10 md:px-8 lg:px-10">
      <p className="text-loop-green">Loading...</p>
    </main>
  );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl px-5 pt-8 pb-10 md:px-8 lg:px-10">
        <p className="text-sm text-red-700">{error}</p>
      </main>
    );
  }

  if (!view) {
    return (
      <main className="mx-auto w-full max-w-6xl px-5 pt-8 pb-10 md:px-8 lg:px-10">
        <h1 className="font-serif text-[2.4rem] leading-tight md:text-5xl">Business not found</h1>
      </main>
    );
  }

  const categories = view.categories;
  const images = view.images;
  const hasVisit = Boolean(view.onlineStore.trim());
  const hasContact = view.showEmail && Boolean(view.email.trim());

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
      <header>
        <h1 className="font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">
          {view.name}
        </h1>
        {view.location ? <p className="mt-3 text-loop-green md:text-lg">{view.location}</p> : null}
        {categories.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li
                key={category}
                className="rounded-full bg-loop-sage px-3 py-1.5 text-xs text-loop-green-dark"
              >
                {category}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {view.description ? (
        <section className="mt-8 rounded-[28px] bg-white p-5 md:p-7">
          <h2 className="font-serif text-xl md:text-2xl">About</h2>
          <p className="mt-3 max-w-3xl whitespace-pre-wrap text-loop-green md:text-lg">{view.description}</p>
        </section>
      ) : null}

      {images.length > 0 ? <GalleryCarousel images={images} name={view.name} /> : null}

      {offerings.length > 0 ? (
        <section className="mt-4 rounded-[28px] bg-white p-5 md:p-7">
          <h2 className="font-serif text-xl md:text-2xl">Products & services</h2>
          <p className="mt-2 text-sm text-loop-green">
            {offerings.length === 1 ? "1 public offering" : `${offerings.length} public offerings`}
            {" · "}
            {offerings[0].name} featured
          </p>
          <ul className="mt-6 space-y-6">
            {offerings.map((offering, index) => (
              <li key={`${offering.kind}-${offering.name}-${index}`}>
                <Link
                  href={offering.href}
                  className="flex gap-4 rounded-2xl p-2 transition-colors duration-200 hover:bg-loop-cream"
                >
                  {offering.imageUrl ? (
                    <img
                      src={offering.imageUrl}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="h-16 w-16 shrink-0 rounded-full bg-loop-sage" aria-hidden="true" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-tight">{offering.name}</h3>
                    <p className="mt-1 text-sm text-loop-green">
                      {offering.kind} · {formatMoney(offering.price)}
                    </p>
                    {offering.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-loop-green-dark">{offering.description}</p>
                    ) : null}
                    {offering.details.length > 0 ? (
                      <p className="mt-2 text-sm text-loop-green">
                        {offering.details.map((detail) => `${detail.label}: ${detail.value}`).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {view.hours ? (
          <section className="rounded-[28px] bg-white p-5 md:p-7">
            <h2 className="font-serif text-xl md:text-2xl">Hours</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {DAYS.map((day) => {
                const schedule = view.hours?.[day.key];
                if (!schedule) return null;
                return (
                  <li key={day.key} className="flex justify-between gap-4">
                    <span>{day.label}</span>
                    <span className="text-loop-green">
                      {schedule.closed
                        ? "Closed"
                        : `${formatTime(schedule.open)} – ${formatTime(schedule.close)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {hasVisit ? (
          <section className="rounded-[28px] bg-white p-5 md:p-7">
            <h2 className="font-serif text-xl md:text-2xl">Visit</h2>
            <a
              href={view.onlineStore}
              className="mt-3 block text-sm font-semibold underline break-all transition-colors duration-200 hover:text-loop-green"
            >
              {view.onlineStore.replace(/^https?:\/\//, "")}
            </a>
          </section>
        ) : null}

        {hasContact ? (
          <section className="rounded-[28px] bg-white p-5 md:p-7">
            <h2 className="font-serif text-xl md:text-2xl">Contact</h2>
            <a
              href={`mailto:${view.email}`}
              className="mt-3 block text-sm text-loop-green underline transition-colors duration-200 hover:text-loop-green-dark"
            >
              {view.email}
            </a>
          </section>
        ) : null}
      </div>
    </main>
  );
}
