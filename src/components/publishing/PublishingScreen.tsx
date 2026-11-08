"use client";

import PublishingHeader from "./PublishingHeader";
import PublishingHero from "./PublishingHero";
import BusinessSummaryCard from "./BusinessSummaryCard";
import PublishStepsList from "./PublishStepsList";
import StatusPill from "./StatusPill";
import { useCreatedShop } from "@/hooks/useCreatedShop";

export default function PublishingScreen() {
  const shop = useCreatedShop();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-loop-cream pb-10 text-loop-green-dark">
      <PublishingHeader />
      <PublishingHero />
      <BusinessSummaryCard
        name={shop?.name || "Your business"}
        location={shop?.location || "Add a location"}
        imageSrc={shop?.imageSrc ?? ""}
      />
      <PublishStepsList />
      <StatusPill />
    </main>
  );
}