"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useProduct } from "@/context/productContext";
import { useService } from "@/context/serviceContext";
import { useFileUrls } from "@/hooks/useFileUrls";
import { listProducts, listServices, type SavedProduct } from "@/lib/database";
import type { ProductData } from "@/context/productContext";
import type { ServiceData } from "@/context/serviceContext";

function formatMoney(price: number) {
  const rounded = Math.round(price * 100) / 100;
  const amount = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  return `$${amount} CAD`;
}

function PhotoCarousel({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = ((index % count) + count) % count;

  return (
    <div>
      <div className="relative">
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
              onClick={() => setIndex((current - 1 + count) % count)}
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-loop-green-dark shadow-sm transition-colors duration-200 hover:bg-loop-sage"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setIndex((current + 1) % count)}
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
    </div>
  );
}

export default function OfferingDetail({ kind, itemId }: { kind: "product" | "service"; itemId: string }) {
  const params = useParams<{ id?: string }>();
  const businessId = typeof params?.id === "string" ? params.id : "";

  const [product, setProduct] = useState<SavedProduct | null>(null);
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId || !itemId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setProduct(null);
    setService(null);

    const request =
      kind === "product"
        ? listProducts(businessId).then((rows) => {
            if (!cancelled) setProduct(rows.find((row) => row.productId === itemId) ?? null);
          })
        : listServices(businessId).then((rows) => {
            if (!cancelled) setService(rows.find((row) => row.serviceId === itemId) ?? null);
          });

    request
      .catch((loadError: Error) => {
        console.error(loadError);
        if (!cancelled) setError("Couldn't load this listing.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, itemId, kind]);

  const backHref = businessId ? `/business/${businessId}` : "/explore";

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

  const name = product?.productName ?? service?.serviceName ?? "";

  if (!name.trim()) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
        <Link href={backHref} className="text-sm font-semibold underline transition-colors duration-200 hover:text-loop-green">
          Back to shop
        </Link>
        <h1 className="mt-6 font-serif text-4xl">This listing is no longer available.</h1>
      </main>
    );
  }

  const imageUrl = product?.imageUrl ?? service?.imageUrl ?? "";
  const images = imageUrl ? [imageUrl] : [];
  const type = product?.productType ?? service?.serviceType ?? "";
  const description = product?.productDescription ?? service?.serviceDescription ?? "";
  const price = product?.productPrice ?? service?.servicePrice ?? 0;
  const quantity = product?.productQuantity ?? service?.serviceQuantity ?? 0;
  const details = product?.details ?? service?.details ?? [];
  const quantityLabel = kind === "product" ? "in stock" : "spots";
  const label = kind === "product" ? "Product" : "Service";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
      <Link href={businessId ? `/business/${businessId}` : "/explore"} className="text-sm font-semibold underline transition-colors duration-200 hover:text-loop-green">
        Back to shop
      </Link>
      <p className="mt-6 text-sm uppercase tracking-[0.2em] text-loop-green">{label}</p>
      <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">{name}</h1>
      <p className="mt-3 text-loop-green md:text-lg">
        {type ? `${type} · ` : ""}
        {formatMoney(price)} · {quantity} {quantityLabel}
      </p>

      {images.length > 0 ? (
        <section className="mt-8 rounded-[28px] bg-white p-5 md:p-7">
          <PhotoCarousel images={images} name={name} />
        </section>
      ) : null}

      {description ? (
        <section className="mt-4 rounded-[28px] bg-white p-5 md:p-7">
          <h2 className="font-serif text-xl md:text-2xl">About</h2>
          <p className="mt-3 max-w-3xl whitespace-pre-wrap text-loop-green md:text-lg">{description}</p>
        </section>
      ) : null}

      {details.length > 0 ? (
        <section className="mt-4 rounded-[28px] bg-white p-5 md:p-7">
          <h2 className="font-serif text-xl md:text-2xl">Details</h2>
          <dl className="mt-4 divide-y divide-loop-border">
            {details.map((detail) => (
              <div key={`${detail.label}-${detail.value}`} className="flex justify-between gap-6 py-3 text-sm">
                <dt>{detail.label}</dt>
                <dd className="text-right text-loop-green">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </main>
  );
}
