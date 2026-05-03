"use client";
import { usePageBanner, TealBannerBg } from "./TealBanner";
export default function JourneysBanner() {
  const src = usePageBanner("journeys");
  return <TealBannerBg src={src} />;
}
