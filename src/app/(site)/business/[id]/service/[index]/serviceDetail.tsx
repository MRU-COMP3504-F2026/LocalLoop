"use client";

import { useParams } from "next/navigation";
import OfferingDetail from "@/components/offeringDetail";

export default function ServiceDetail() {
  const params = useParams<{ index: string }>();
  return <OfferingDetail kind="service" index={Number(params.index)} />;
}
