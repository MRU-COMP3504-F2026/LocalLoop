"use client";

import { useParams } from "next/navigation";
import OfferingDetail from "@/components/offeringDetail";

export default function ProductDetailPage() {
  const params = useParams<{ index: string }>();
  return <OfferingDetail kind="product" index={Number(params.index)} />;
}
