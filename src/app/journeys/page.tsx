import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";
const AIJourneyFinder = dynamic(() => import("@/components/ui/AIJourneyFinder"), { ssr: false });
import JourneysBanner from "@/components/ui/JourneysBanner";
import { getJourneys, getAtolls } from "@/lib/data";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "All Journeys — AtollDrift",
  description: "Small-group journeys across Huvadhu, Fuvahmulah, and Addu. Flexible dates, confirmed on request.",
};

export default async function JourneysPage() {
  const [atolls, journeys] = await Promise.all([getAtolls(), getJourneys()]);
  const byAtoll = atolls.map((atoll) => ({
    atoll,
    journeys: journeys.filter((j) => j.atollId === atoll.id),
  }));

  return (
    <>
      <Navbar />
      <main>
        <div className="dp-hero" style={{ position: "relative", overflow: "hidden" }}>
          <JourneysBanner />
          <div className="inner" style={{ position: "relative", zIndex: 2 }}>
            <div style={{ maxWidth: 560 }}>
            
            <Link href="/" className="dp-back">← Back to home</Link>
            <div className="dp-coord">Southern Maldives · Small Group Journeys</div>
            <h1 className="dp-title">Featured Journeys</h1>
            <p className="dp-tagline">Small groups. Local guesthouses. Flexible dates.</p>
            <div className="dp-meta">
              <span>6–10 people per group</span>
              <span>Flexible dates</span>
              <span>Confirmed on request</span>
              <span>Local guides throughout</span>
            </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "2rem 1.1rem" }}>
          <div className="inner" style={{ display: "block" }}>

            {/* Trust bar */}
            <div style={{
              display: "flex", gap: "1.5rem", flexWrap: "wrap",
              padding: "1rem 0", marginBottom: "1.5rem",
              borderBottom: "1px solid var(--off2)",
            }}>
              {[
                ["Small groups", "6–10 people per journey"],
                ["Limited availability", "Curated, not crowded"],
                ["Confirmed on request", "We reply within 24 hours"],
              ].map(([title, sub]) => (
                <div key={title} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--tq)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: ".62rem", fontWeight: 700, color: "var(--ink)" }}>{title}</div>
                    <div style={{ fontSize: ".58rem", color: "var(--muted2)" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {byAtoll.map(({ atoll, journeys: atollJourneys }) => (
                <div key={atoll.id} className="dp-sec">
                  <div className="dp-slabel">{atoll.name} · {atoll.coord}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".65rem", marginTop: ".75rem" }}>
                    {atollJourneys.map((journey) => (
                      <Link key={journey.id} href={`/journeys/${journey.id}`}
                        className={`jcard${journey.goldAccent ? " gold-l" : ""}`}
                        style={{ textDecoration: "none" }}>
                        {(journey as any).bannerSrc && (
                          <div className="jcard-img">
                            <img src={(journey as any).bannerSrc} alt={journey.title} loading="lazy" decoding="async" />
                          </div>
                        )}
                        <div className="jcard-content">
                          <div className="jcard-top">
                            <div className="jcard-title">{journey.title}</div>
                            <div className="jcard-price">
                              <span style={{ fontSize: ".5rem", fontFamily: "Montserrat, sans-serif", fontWeight: 600, letterSpacing: ".06em", opacity: .7, marginRight: ".2rem", verticalAlign: "middle" }}>FROM</span>
                              ${journey.price.toLocaleString()}
                            </div>
                          </div>
                          <p className="jcard-tagline">{journey.tagline}</p>
                          <div className="jcard-meta">
                            <span>{journey.duration}</span>
                            <span style={{ color: "var(--off3)" }}>·</span>
                            <span>{journey.groupSize}</span>
                            <span style={{ color: "var(--off3)" }}>·</span>
                            <span style={{ color: "var(--tq-d)", fontWeight: 600 }}>Flexible dates</span>
                          </div>
                          <div className="jcard-cta">
                            <span>See available dates</span>
                            <span className="jcard-cta-arrow">→</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--off)", border: "1.5px solid var(--tq-xl)", padding: "1.4rem", marginTop: "1.5rem", borderLeft: "3px solid var(--tq)" }}>
              <div style={{ fontSize: ".56rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".4rem" }}>
                How it works
              </div>
              <p style={{ fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.75 }}>
                Choose a journey and request your preferred dates. We run small groups of 6–10 people and will confirm
                availability within 24 hours. No payment is required until we confirm your place.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AIJourneyFinder />
    </>
  );
}
