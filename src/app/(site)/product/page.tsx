"use client";

import Link from "next/link";
import { useProduct } from "@/context/productContext";
import { useService } from "@/context/serviceContext";
import { useFileUrls } from "@/hooks/useFileUrls";
import { previewWords } from "@/lib/offering";

function formatMoney(price: number) {
  const rounded = Math.round(price * 100) / 100;
  const amount = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  return `$${amount} CAD`;
}

export default function ListingsPage() {
  const { products, removeProduct, beginEdit: beginProductEdit, clearEdit: clearProductEdit, saveError } = useProduct();
  const { services, removeService, beginEdit: beginServiceEdit, clearEdit: clearServiceEdit } = useService();
  const productUrls = useFileUrls(products);
  const serviceUrls = useFileUrls(services);

  const rows = [
    ...products.map((product, index) => ({
      key: `product-${index}`,
      kind: "Product",
      name: product.productName,
      type: product.productType,
      description: previewWords(product.productDescription),
      price: product.productPrice,
      quantity: product.productQuantity,
      quantityLabel: "in stock",
      details: product.details,
      imageUrl: productUrls[index]?.[0] || product.imageUrl || "",
      photoCount: product.images.length,
      editHref: "/registerProduct",
      edit: () => beginProductEdit(index),
      remove: () => removeProduct(index),
    })),
    ...services.map((service, index) => ({
      key: `service-${index}`,
      kind: "Service",
      name: service.serviceName,
      type: service.serviceType,
      description: service.serviceDescription,
      price: service.servicePrice,
      quantity: service.serviceQuantity,
      quantityLabel: "spots",
      details: service.details,
      imageUrl: serviceUrls[index]?.[0] ?? "",
      photoCount: service.images.length,
      editHref: "/registerService",
      edit: () => beginServiceEdit(index),
      remove: () => removeService(index),
    })),
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-loop-green">your shop</p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">listings</h1>
          <p className="mt-3 max-w-md text-loop-green md:text-lg">Products and services customers can find.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/registerProduct"
            onClick={() => clearProductEdit()}
            className="inline-flex items-center justify-center rounded-full bg-loop-green-dark px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-loop-green"
          >
            Add a product
          </Link>
          <Link
            href="/registerService"
            onClick={() => clearServiceEdit()}
            className="inline-flex items-center justify-center rounded-full border border-loop-border bg-white px-5 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-loop-sage"
          >
            Add a service
          </Link>
        </div>
      </header>

      {saveError ? <p className="mt-6 text-sm text-red-700">{saveError}</p> : null}

      {rows.length === 0 ? (
        <p className="mt-8 text-loop-green">Nothing listed yet.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((row) => (
            <li key={row.key} className="flex gap-4 rounded-[28px] bg-white p-5">
              {row.imageUrl ? (
                <img src={row.imageUrl} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="h-20 w-20 shrink-0 rounded-full bg-loop-sage" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-xl">{row.name}</h2>
                  <div className="flex shrink-0 gap-3">
                    <Link
                      href={row.editHref}
                      onClick={row.edit}
                      className="text-xs font-semibold underline transition-colors duration-200 hover:text-loop-green"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={row.remove}
                      className="text-xs text-loop-green underline transition-colors duration-200 hover:text-loop-green-dark"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-loop-green">
                  {row.kind}
                  {row.type ? ` · ${row.type}` : ""} · {formatMoney(row.price)} · {row.quantity} {row.quantityLabel}
                  {row.photoCount > 1 ? ` · ${row.photoCount} photos` : ""}
                </p>
                {row.description ? <p className="mt-2 text-sm">{row.description}</p> : null}
                {row.details.length > 0 ? (
                  <p className="mt-2 text-sm text-loop-green">
                    {row.details.map((detail) => `${detail.label}: ${detail.value}`).join(" · ")}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
