"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCreatedShop } from "@/hooks/useCreatedShop";
import { getBusiness, listProducts, type BusinessRecord, type SavedProduct } from "@/lib/database";
import { useFileUrls } from "@/hooks/useFileUrls";
import type { BusinessHours } from "@/context/accounts/businessContext";
import { previewWords } from "@/lib/offering";
import { useProduct } from "@/context/productContext";
import { useService } from "@/context/serviceContext";

const DAYS: { key: keyof BusinessHours; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
}

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
  const shop = useCreatedShop();
  const { products } = useProduct();
  const { services } = useService();
  const [record, setRecord] = useState<BusinessRecord | null>(null);
  const [dbProducts, setDbProducts] = useState<SavedProduct[]>([]);
  const productUrls = useFileUrls(products);
  const serviceUrls = useFileUrls(services);

  useEffect(() => {
    if (!routeId || routeId === "demo" || routeId === "local") return;

    let cancelled = false;
    getBusiness(routeId)
      .then((row) => {
        if (!cancelled) setRecord(row);
      })
      .catch(() => undefined);
    listProducts(routeId)
      .then((rows) => {
        if (!cancelled) setDbProducts(rows);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [routeId]);

  const listedProducts = dbProducts.length > 0 ? dbProducts : products;
  const offerings = [
    ...listedProducts.flatMap((product, index) =>
      product.productName.trim()
        ? [
            {
              kind: "Product" as const,
              name: product.productName,
              price: product.productPrice,
              // first 10 words on the card, the rest is on the product page
              description: previewWords(product.productDescription),
              imageUrl: dbProducts.length > 0 ? product.imageUrl || "" : productUrls[index]?.[0] || product.imageUrl || "",
              details: product.details,
              href: `/business/${routeId || "demo"}/product/${index}`,
            },
          ]
        : [],
    ),
    ...services.flatMap((service, index) =>
      service.serviceName.trim()
        ? [
            {
              kind: "Service" as const,
              name: service.serviceName,
              price: service.servicePrice,
              description: service.serviceDescription,
              imageUrl: serviceUrls[index]?.[0] ?? "",
              details: service.details,
              href: `/business/${routeId || "demo"}/service/${index}`,
            },
          ]
        : [],
    ),
  ];

  const view = record
    ? {
        name: record.name,
        location: record.location ?? record.address ?? "",
        description: record.description ?? "",
        email: record.email ?? "",
        categories: record.category?.split(" · ").filter(Boolean) ?? [],
        onlineStore: shop?.onlineStore ?? "",
        hours: shop?.hours,
        images: shop?.images ?? [],
      }
    : shop
      ? {
          name: shop.name,
          location: shop.location,
          description: shop.description,
          email: shop.email,
          categories: shop.categories ?? [],
          onlineStore: shop.onlineStore,
          hours: shop.hours,
          images: shop.images ?? [],
        }
      : null;

  if (!view) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
        <h1 className="font-serif text-[2.4rem] leading-tight md:text-5xl">Shop</h1>
      </main>
    );
  }

  const categories = view.categories;
  const images = view.images;
  const hasContact = Boolean(view.email.trim() || view.onlineStore.trim());

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

        {hasContact ? (
          <section className="rounded-[28px] bg-white p-5 md:p-7">
            <h2 className="font-serif text-xl md:text-2xl">Visit</h2>
            <div className="mt-3 space-y-3 text-sm">
              {view.onlineStore ? (
                <a
                  href={view.onlineStore}
                  className="block font-semibold underline transition-colors duration-200 hover:text-loop-green"
                >
                  {view.onlineStore.replace(/^https?:\/\//, "")}
                </a>
              ) : null}
              {view.email ? (
                <a
                  href={`mailto:${view.email}`}
                  className="block text-loop-green underline transition-colors duration-200 hover:text-loop-green-dark"
                >
                  {view.email}
                </a>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>

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
    </main>
  );
}
