"use client";

import { useParams } from "next/navigation";
import OfferingDetail from "@/components/offeringDetail";

export default function ProductDetail() {
  const params = useParams<{ index: string }>();
  return <OfferingDetail kind="product" index={Number(params.index)} />;
}
