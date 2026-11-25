import { Suspense } from "react";
import ServiceDetail from "@/app/(site)/business/[id]/service/[serviceId]/serviceDetail";

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-loop-cream" />}>
      <ServiceDetail />
    </Suspense>
  );
}
