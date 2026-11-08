import type { Metadata } from "next";
import PublishingScreen from "@/components/publishing/PublishingScreen";


export const metadata: Metadata = { title: "Publishing your profile – LocalLoop" };


export default function BusinessCreationSuccess() {
  return <PublishingScreen />;
}