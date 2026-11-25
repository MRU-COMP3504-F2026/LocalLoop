"use client";

import { useParams } from "next/navigation";
import OfferingDetail from "@/components/offeringDetail";

export default function ServiceDetail() {
    const { serviceId } = useParams<{ serviceId: string }>();
  return <OfferingDetail kind="service" itemId={serviceId} />;
}
