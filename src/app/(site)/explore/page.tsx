import ExploreList from "@/components/explore/exploreList";
import UserLocationPanel from "@/components/explore/userLocationPanel";
import PageFrame from "@/components/pageFrame";

export default function ExplorePage() {
  return (
    <PageFrame
      eyebrow="nearby"
      title="explore"
      description="Local businesses around you."
    >
      <UserLocationPanel />
      <ExploreList />
    </PageFrame>
  );
}
