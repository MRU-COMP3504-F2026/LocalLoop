"use client";

import { useEffect, useState } from "react";

export function useFileUrls(items: { images: File[] }[]) {
  const [urls, setUrls] = useState<string[][]>([]);

  useEffect(() => {
    // keep these so we can revoke them
    const next = items.map((item) => item.images.map((image) => URL.createObjectURL(image)));
    setUrls(next);
    return () => {
      next.flat().forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

  return urls;
}
