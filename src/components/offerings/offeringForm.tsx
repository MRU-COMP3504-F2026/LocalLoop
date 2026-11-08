"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import ImageUpload from "@/components/register/business/imageUpload";
import { clampWords, wordCount, type OfferingDetail, type OfferingDraft } from "@/lib/offering";

const fieldClass =
  "w-full rounded-2xl border border-transparent bg-loop-cream px-4 text-sm text-loop-green-dark outline-none transition-colors duration-200 focus:border-loop-green";

type OfferingFormProps = {
  title: string;
  subtitle: string;
  nameLabel: string;
  typeSuggestions: string[];
  quantityLabel: string;
  submitLabel: string;
  savedLabel: string;
  descriptionWordLimit?: number;
  initial?: OfferingDraft;
  onSave: (draft: OfferingDraft) => void;
};

function moneyText(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join("").slice(0, 2)}`;
}

function priceToText(price: number) {
  const rounded = Math.round(price * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

export default function OfferingForm({
  title,
  subtitle,
  nameLabel,
  typeSuggestions,
  quantityLabel,
  submitLabel,
  savedLabel,
  descriptionWordLimit,
  initial,
  onSave,
}: OfferingFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [description, setDescription] = useState(
    descriptionWordLimit ? clampWords(initial?.description ?? "", descriptionWordLimit) : (initial?.description ?? ""),
  );
  const [priceText, setPriceText] = useState(initial ? priceToText(initial.price) : "");
  const [quantityText, setQuantityText] = useState(String(initial?.quantity ?? 1));
  const [images, setImages] = useState<File[]>(initial?.images ?? []);
  const [details, setDetails] = useState<OfferingDetail[]>(
    initial?.details.map((detail) => ({ ...detail })) ?? [],
  );
  const [saved, setSaved] = useState(false);

  function quantityValue() {
    return quantityText === "" ? 0 : Number(quantityText);
  }

  function changeQuantity(next: number) {
    setSaved(false);
    setQuantityText(String(Math.max(0, next)));
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const price = Number(priceText || "0");
    onSave({
      name: name.trim(),
      type: type.trim(),
      description: (descriptionWordLimit ? clampWords(description, descriptionWordLimit) : description).trim(),
      price: Number.isFinite(price) ? price : 0,
      quantity: quantityValue(),
      images,
      details: details
        .filter((detail) => detail.label.trim() && detail.value.trim())
        .map((detail) => ({ label: detail.label.trim(), value: detail.value.trim() })),
    });
    if (!initial) {
      setName("");
      setType("");
      setDescription("");
      setPriceText("");
      setQuantityText("1");
      setImages([]);
      setDetails([]);
    }
    setSaved(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-10 text-loop-green-dark md:px-8 lg:px-10">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-loop-green">your shop</p>
        <h1 className="mt-3 font-serif text-[2.4rem] leading-tight md:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-3 max-w-md text-loop-green md:text-lg">{subtitle}</p>
      </header>

      <form onSubmit={save} className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="space-y-5 rounded-[28px] bg-white p-5 md:p-7">
          <label className="block text-sm">
            {nameLabel}
            <input
              value={name}
              onChange={(event) => {
                setSaved(false);
                setName(event.target.value);
              }}
              className={`${fieldClass} mt-2 h-11`}
              required
            />
          </label>

          <div>
            <p className="text-sm">Type</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {typeSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setSaved(false);
                    setType(suggestion);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors duration-200 ${
                    type === suggestion
                      ? "bg-loop-green-dark text-white"
                      : "bg-loop-sage text-loop-green-dark hover:bg-loop-green hover:text-white"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <input
              value={type}
              onChange={(event) => {
                setSaved(false);
                setType(event.target.value);
              }}
              placeholder="Or type your own"
              className={`${fieldClass} mt-3 h-11`}
              required
            />
          </div>

          <label className="block text-sm">
            Description
            <textarea
              value={description}
              onChange={(event) => {
                setSaved(false);
                const next = event.target.value;
                // services skip this, products stop at the word cap
                setDescription(descriptionWordLimit ? clampWords(next, descriptionWordLimit) : next);
              }}
              rows={4}
              className={`${fieldClass} mt-2 resize-none py-3`}
              required
            />
            {descriptionWordLimit ? (
              <span className="mt-2 block text-xs text-loop-green">
                {wordCount(description)} / {descriptionWordLimit} words
              </span>
            ) : null}
          </label>
        </section>

        <section className="flex flex-col gap-5 rounded-[28px] bg-white p-5 md:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              Price
              <span className="mt-2 flex h-11 items-center rounded-2xl bg-loop-cream px-4 focus-within:border focus-within:border-loop-green">
                <span className="text-loop-green">$</span>
                <input
                  inputMode="decimal"
                  value={priceText}
                  onChange={(event) => {
                    setSaved(false);
                    setPriceText(moneyText(event.target.value));
                  }}
                  placeholder="0.00"
                  className="w-full bg-transparent px-2 text-sm outline-none"
                  required
                />
              </span>
            </label>

            <div className="text-sm">
              {quantityLabel}
              <div className="mt-2 flex h-11 items-center justify-between rounded-2xl bg-loop-cream px-2">
                <button
                  type="button"
                  aria-label={`Decrease ${quantityLabel}`}
                  onClick={() => changeQuantity(quantityValue() - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors duration-200 hover:bg-loop-sage"
                >
                  −
                </button>
                <input
                  inputMode="numeric"
                  aria-label={quantityLabel}
                  value={quantityText}
                  onChange={(event) => {
                    setSaved(false);
                    setQuantityText(event.target.value.replace(/\D/g, ""));
                  }}
                  onBlur={() => {
                    if (quantityText === "") setQuantityText("0");
                    else setQuantityText(String(Number(quantityText)));
                  }}
                  className="w-16 bg-transparent text-center text-sm font-semibold outline-none"
                />
                <button
                  type="button"
                  aria-label={`Increase ${quantityLabel}`}
                  onClick={() => changeQuantity(quantityValue() + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors duration-200 hover:bg-loop-sage"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm">Photos</p>
            <div className="mt-2">
              <ImageUpload
                images={images}
                onChange={(next) => {
                  setSaved(false);
                  setImages(next);
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm">Extra details</p>
              <button
                type="button"
                onClick={() => {
                  setSaved(false);
                  setDetails((current) => [...current, { label: "", value: "" }]);
                }}
                className="rounded-full bg-loop-sage px-3 py-1.5 text-xs transition-colors duration-200 hover:bg-loop-green hover:text-white"
              >
                Add a detail
              </button>
            </div>
            <p className="mt-1 text-xs text-loop-green">Sizes, flavours, duration, or anything else customers should know.</p>
            <div className="mt-3 space-y-2">
              {details.map((detail, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={detail.label}
                    onChange={(event) => {
                      const next = [...details];
                      next[index] = { ...detail, label: event.target.value };
                      setDetails(next);
                      setSaved(false);
                    }}
                    placeholder="Size"
                    aria-label={`Detail ${index + 1} name`}
                    className={`${fieldClass} h-11`}
                  />
                  <input
                    value={detail.value}
                    onChange={(event) => {
                      const next = [...details];
                      next[index] = { ...detail, value: event.target.value };
                      setDetails(next);
                      setSaved(false);
                    }}
                    placeholder="Small, medium"
                    aria-label={`Detail ${index + 1} value`}
                    className={`${fieldClass} h-11`}
                  />
                  <button
                    type="button"
                    aria-label={`Remove detail ${index + 1}`}
                    onClick={() => setDetails((current) => current.filter((_, item) => item !== index))}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-loop-sage transition-colors duration-200 hover:bg-loop-green-dark hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-loop-border pt-5 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-loop-green-dark px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-loop-green sm:w-auto sm:px-8"
            >
              {saved ? savedLabel : submitLabel}
            </button>
            <Link
              href="/product"
              className="text-center text-sm font-semibold underline transition-colors duration-200 hover:text-loop-green"
            >
              View listings
            </Link>
          </div>
        </section>
      </form>
    </div>
  );
}
