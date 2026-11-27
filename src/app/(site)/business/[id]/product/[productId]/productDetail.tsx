"use client";

import { useParams } from "next/navigation";
import OfferingDetail from "@/components/offeringDetail";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  return <OfferingDetail kind="product" itemId={productId} />;
}
