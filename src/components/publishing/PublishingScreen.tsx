import PublishingHeader from "./PublishingHeader";
import PublishingHero from "./PublishingHero";
import BusinessSummaryCard from "./BusinessSummaryCard";
import PublishStepsList from "./PublishStepsList";
import StatusPill from "./StatusPill";
 
export default function PublishingScreen() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl bg-loop-cream pb-10 text-loop-green-dark md:px-8 lg:px-10">
      <PublishingHeader />
      <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
        <div>
          <PublishingHero />
          <BusinessSummaryCard
            name="Moss & Clay Studio"
            location="Kensington, Calgary"
            imageSrc="/images/moss-clay-thumb.png"
          />
        </div>
        <div className="md:pt-8">
          <PublishStepsList />
          <StatusPill />
        </div>
      </div>
    </main>
  );
}