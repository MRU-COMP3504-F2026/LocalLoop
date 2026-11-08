import { Suspense } from "react";
import PublishingScreen from "@/components/publishing/PublishingScreen";
import RedirectToProfile from "@/components/publishing/redirectToProfile";

export const metadata = { title: "Publishing your profile – LocalLoop" };

export default function PublishingPage() {
  return (
    <>
      <Suspense fallback={null}>
        <RedirectToProfile />
      </Suspense>
      <PublishingScreen />
    </>
  );
}
