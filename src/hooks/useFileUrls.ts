"use client";

import { useEffect, useState } from "react";

export function useFileUrls(items: { images: File[] }[]) {
  const [urls, setUrls] = useState<string[][]>([]);

  useEffect(() => {
    // hold onto the urls we made so we can revoke those exact ones
    const next = items.map((item) => item.images.map((image) => URL.createObjectURL(image)));
    setUrls(next);
    return () => {
      next.flat().forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

  return urls;
}
