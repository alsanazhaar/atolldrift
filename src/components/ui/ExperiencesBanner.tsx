"use client";
import { usePageBanner, TealBannerBg } from "./TealBanner";
export default function ExperiencesBanner() {
  const src = usePageBanner("experiences");
  return <TealBannerBg src={src} />;
}
