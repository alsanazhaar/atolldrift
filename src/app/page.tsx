import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AtollSection from "@/components/sections/AtollSection";
import GroupSection from "@/components/sections/GroupSection";
import Manifesto from "@/components/sections/Manifesto";
import AIJourneyFinder from "@/components/ui/AIJourneyFinder";
import { getAtolls, getUpcomingDepartures, getJourneys } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [atolls, departures, journeys] = await Promise.all([
    getAtolls(),
    getUpcomingDepartures(),
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
        <GroupSection departures={departures} />
        <Manifesto />
      </main>
      <Footer />
      <AIJourneyFinder />
    </>
  );
}
