"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/context/accounts/accountContext";
import { useBusiness, type BusinessHours } from "@/context/accounts/businessContext";

export type CreatedShop = {
  name: string;
  email: string;
  location: string;
  description: string;
  category: string;
  categories: string[];
  onlineStore: string;
  hours: BusinessHours;
  imageSrc: string;
  images: string[];
};

export function useCreatedShop(): CreatedShop | null {
  const { accountData } = useAccount();
  const { businessData } = useBusiness();

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = businessData.images.map((image) => URL.createObjectURL(image));
    setImageUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [businessData.images]);

  const hasShop = Boolean(
    accountData.username.trim() ||
      accountData.email.trim() ||
      businessData.location.trim() ||
      businessData.description.trim() ||
      businessData.category.length ||
      businessData.images.length ||
      businessData.onlineStore.trim(),
  );

  if (!hasShop) return null;

  return {
    name: accountData.username,
    email: accountData.email,
    location: businessData.location,
    description: businessData.description,
    category: businessData.category.join(" · "),
    categories: businessData.category,
    onlineStore: businessData.onlineStore,
    hours: businessData.openingHours,
    imageSrc: imageUrls[0] ?? "",
    images: imageUrls,
  };
}
