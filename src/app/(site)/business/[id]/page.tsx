import { Suspense } from "react";
import PublicBusinessProfile from "@/components/publicBusinessProfile";

export default function BusinessProfile() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-loop-cream" />}>
      <PublicBusinessProfile />
    </Suspense>
  );
}
