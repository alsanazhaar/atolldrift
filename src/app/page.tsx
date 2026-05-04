import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AtollSection from "@/components/sections/AtollSection";
import GroupSection from "@/components/sections/GroupSection";
import Manifesto from "@/components/sections/Manifesto";
import Reviews from "@/components/sections/Reviews";
import dynamic from "next/dynamic";
const AIJourneyFinder = dynamic(() => import("@/components/ui/AIJourneyFinder"), { ssr: false });
import { getAtolls, getJourneys } from "@/lib/data";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "AtollDrift Maldives — Real Journeys Beyond Resorts",
  description: "AtollDrift takes small groups into the southern Maldives — Huvadhu, Fuvahmulah, and Addu. Local guesthouses, real guides, flexible dates.",
};

export default async function HomePage() {
  const [atolls, journeys] = await Promise.all([
    getAtolls(),
    getJourneys(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="eq-band">
          <div className="eq-band-title">0° 00′ 00″ · The Equator · Indian Ocean</div>
          <div className="eq-band-sub">Two of three atolls lie south of this line</div>
        </div>
        {atolls.map((atoll, i) => (
          <AtollSection
            key={atoll.id}
            atoll={atoll}
            journeys={journeys}
            showDividerAfter={i === 0}
          />
        ))}
        <GroupSection journeys={journeys} />
        <Manifesto />
        <Reviews />
      </main>
      <Footer />
      <AIJourneyFinder />
    </>
  );
}
