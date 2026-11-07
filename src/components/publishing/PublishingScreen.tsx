import PublishingHeader from "./PublishingHeader";
import PublishingHero from "./PublishingHero";
import BusinessSummaryCard from "./BusinessSummaryCard";
import PublishStepsList from "./PublishStepsList";
import StatusPill from "./StatusPill";
 
export default function PublishingScreen() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[390px] bg-[#fbf8f0] pb-10">
      <PublishingHeader />
      <PublishingHero />
      <BusinessSummaryCard
        name="Moss & Clay Studio"
        location="Kensington, Calgary"
        imageSrc="/images/moss-clay-thumb.png"
      />
      <PublishStepsList />
      <StatusPill />
    </main>
  );
}