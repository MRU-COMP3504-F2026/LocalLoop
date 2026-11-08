import PublishingHeader from "./PublishingHeader";
import PublishingHero from "./PublishingHero";
import BusinessSummaryCard from "./BusinessSummaryCard";
import PublishStepsList from "./PublishStepsList";
import StatusPill from "./StatusPill";
 
export default function PublishingScreen() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-loop-cream pb-10 text-loop-green-dark">
      <PublishingHeader />
      <PublishingHero />
      <BusinessSummaryCard
        name="Moss & Clay Studio"
        location="Kensington, Calgary"
        imageSrc="/images/profile-header.jpg"
      />
      <PublishStepsList />
      <StatusPill />
    </main>
  );
}