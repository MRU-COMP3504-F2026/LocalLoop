import ExploreList from "@/components/explore/exploreList";
import PageFrame from "@/components/pageFrame";

export default function ExplorePage() {
  return (
    <PageFrame
      eyebrow="nearby"
      title="explore"
      description="Local businesses around you."
    >
      <ExploreList />
    </PageFrame>
  );
}
