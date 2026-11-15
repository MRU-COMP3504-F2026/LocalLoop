import { Suspense } from "react";
import ServiceDetail from "@/app/(site)/business/[id]/service/[index]/serviceDetail";

export default function ServiceDetailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-loop-cream" />}>
      <ServiceDetail />
    </Suspense>
  );
}
