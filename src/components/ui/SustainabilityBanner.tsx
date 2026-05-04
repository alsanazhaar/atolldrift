"use client";
import { usePageBanner, TealBannerBg } from "./TealBanner";
export default function SustainabilityBanner() {
  const src = usePageBanner("sustainability");
  return <TealBannerBg src={src} />;
}
