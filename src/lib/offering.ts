export type OfferingDetail = {
  label: string;
  value: string;
};

export type OfferingDraft = {
  name: string;
  type: string;
  description: string;
  price: number;
  quantity: number;
  images: File[];
  details: OfferingDetail[];
};

// products only. 150 is the cap, cards show the first 10
export const PRODUCT_DESCRIPTION_WORD_LIMIT = 150;

export function wordCount(text: string) {
  return text.trim().match(/\S+/g)?.length ?? 0;
}

export function clampWords(text: string, max: number) {
  if (wordCount(text) <= max) return text;
  const pattern = /\S+/g;
  let count = 0;
  let end = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) && count < max) {
    count += 1;
    end = match.index + match[0].length;
  }
  return text.slice(0, end);
}

export function previewWords(text: string, count = 10) {
  const trimmed = text.trim();
  const words = trimmed.match(/\S+/g) ?? [];
  if (words.length <= count) return trimmed;
  return `${words.slice(0, count).join(" ")}...`;
}
