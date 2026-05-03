import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIJourneyFinder from "@/components/ui/AIJourneyFinder";
import BookingForm from "@/components/ui/BookingForm";
import MobileBookBar from "@/components/ui/MobileBookBar";
import { TealBannerBg } from "@/components/ui/TealBanner";
import { getJourneys, getJourneyById, getAtolls, getExperiences } from "@/lib/data";

export const revalidate = 0;
export const dynamicParams = true;

interface Props { params: { id: string } }

export async function generateStaticParams() {
  const journeys = await getJourneys();
  return journeys.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const journey = await getJourneyById(params.id);
  if (!journey) return { title: "Journey Not Found — AtollDrift" };
  return { title: `${journey.title} — AtollDrift`, description: journey.tagline };
}

export default async function JourneyDetailPage({ params }: Props) {
  const [journey, atolls, allJourneys, allExperiences] = await Promise.all([
    getJourneyById(params.id),
    getAtolls(),
    getJourneys(),
    getExperiences(),
  ]);
  if (!journey) notFound();

  const atoll = atolls.find((a) => a.id === journey.atollId);
  const relatedJourneys = allJourneys.filter(
    (j) => j.atollId === journey.atollId && j.id !== journey.id
  );
  const atollExperiences = allExperiences
    .filter((x) => x.atoll.toLowerCase() === atoll?.name.toLowerCase())
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="has-booking-bar">

        {/* ── Hero ── */}
        <div className="dp-hero" style={{ position: "relative", overflow: "hidden" }}>
          <TealBannerBg src={(journey as any).bannerSrc ?? null} />
          <div className="inner" style={{ position: "relative", zIndex: 2 }}>
            {/* Frosted background panel behind text */}
            <div style={{
              position: "absolute",
              inset: "-1.4rem -1.6rem",
              background: "rgba(2, 28, 34, 0.55)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              borderRadius: "2px",
              zIndex: -1,
            }} />
            <Link href="/journeys" className="dp-back">← All journeys</Link>
            <div className={`dp-hemi${journey.hemisphere === "south" ? " south" : ""}`}>
              {journey.hemisphere === "north" ? "Northern Hemisphere" : "Southern Hemisphere"}
            </div>
            <div className="dp-coord">{journey.coord}</div>
            <h1 className="dp-title">{journey.title}</h1>
            <p className="dp-tagline">{journey.tagline}</p>
            <div className="dp-meta">
              <span>{journey.duration}</span>
              <span>Small group · {journey.groupSize}</span>
              <span>From ${journey.price.toLocaleString()}</span>
              {atoll && <span>{atoll.name} Atoll</span>}
            </div>
            {/* Trust signals */}
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: ".85rem" }}>
              {["Small groups (6–10)", "Flexible dates", "Confirmed on request"].map(s => (
                <span key={s} style={{
                  fontSize: ".54rem", fontWeight: 700, letterSpacing: ".08em",
                  textTransform: "uppercase", color: "rgba(255,255,255,.85)",
                  background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
                  padding: ".2rem .6rem", borderRadius: "2px",
                }}>{s}</span>
              ))}
            </div>
            {/* Experience CTA */}
            {atollExperiences.length > 0 && (
              <div style={{ marginTop: "1.1rem" }}>
                <a href="#experiences" style={{
                  display: "inline-flex", alignItems: "center", gap: ".35rem",
                  fontSize: ".65rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
                  color: "rgba(255,255,255,.85)", textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,.35)", padding: ".4rem .9rem",
                  background: "rgba(255,255,255,.08)",
                }}>
                  View local experiences →
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="dp-body">
          <div className="inner">

            {/* ── Left: content ── */}
            <div>

              {/* About */}
              <div className="dp-sec">
                <div className="dp-slabel">About This Journey</div>
                <p className="dp-desc">{journey.description}</p>
              </div>

              {/* Availability signal — replaces departures display */}
              <div style={{
                background: "var(--off)",
                border: "1.5px solid var(--tq-xl)",
                borderLeft: "3px solid var(--tq)",
                padding: "1rem 1.1rem",
                marginBottom: "1.5rem",
              }}>
                <div style={{ fontSize: ".52rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".2rem" }}>
                  Flexible dates · Limited group availability
                </div>
                <div style={{ fontSize: ".75rem", color: "var(--muted)", lineHeight: 1.65 }}>
                  We run small groups of 6–10 people on flexible dates throughout the season.
                  Request your preferred dates and we will confirm availability within 24 hours.
                </div>
              </div>

              {/* Itinerary */}
              <div className="dp-sec">
                <div className="dp-slabel">Journey Itinerary Highlights</div>
                <div style={{ fontSize: ".68rem", color: "var(--muted2)", marginBottom: "1rem", fontStyle: "italic" }}>
                  A guide to what this journey includes — exact scheduling adapts to group needs and conditions.
                </div>
                {journey.days.map((day, i) => (
                  <div key={i} style={{ paddingBottom: ".9rem", marginBottom: ".9rem", borderBottom: i < journey.days.length - 1 ? "1px solid var(--off2)" : "none" }}>
                    <div className="dtitle">{day.title}</div>
                    <div className="ddesc">{day.desc}</div>
                  </div>
                ))}
              </div>

              {/* Included */}
              <div className="dp-sec">
                <div className="dp-slabel">What is Included</div>
                <div className="igrid">
                  {journey.included.map((item, i) => (
                    <div key={i} className="iitem"><div className="idot" />{item}</div>
                  ))}
                </div>
              </div>

              {/* Experiences */}
              {atollExperiences.length > 0 && (
                <div className="dp-sec" id="experiences">
                  <div className="dp-slabel">Available experiences in {atoll?.name}</div>
                  <div style={{ fontSize: ".68rem", color: "var(--muted2)", marginBottom: ".85rem", fontStyle: "italic" }}>
                    Add local experiences to your journey — hosted by people who grew up here.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".55rem" }}>
                    {atollExperiences.map(xp => (
                      <Link key={xp.id} href={`/experiences/${xp.id}`} style={{ textDecoration: "none" }}>
                        <div style={{
                          background: "var(--white)", border: "1.5px solid var(--off2)",
                          borderLeft: "3px solid var(--eq)", padding: ".85rem 1rem",
                          transition: "border-color .15s",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem" }}>
                            <div>
                              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1rem", color: "var(--ink)", fontWeight: 600, marginBottom: ".15rem" }}>
                                {xp.title}
                              </div>
                              <div style={{ fontSize: ".62rem", color: "var(--muted2)" }}>
                                {xp.hostName} · {xp.duration}
                              </div>
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: ".95rem", color: "var(--tq-d)", fontWeight: 600, flexShrink: 0 }}>
                              ${xp.price}<span style={{ fontSize: ".6rem", color: "var(--muted2)", fontFamily: "inherit" }}>/person</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/experiences" style={{ display: "inline-block", marginTop: ".75rem", fontSize: ".6rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--tq-d)", textDecoration: "none" }}>
                    Browse all experiences →
                  </Link>
                </div>
              )}

              {/* Booking form — mobile */}
              <div className="dp-sec dp-form-mobile" id="booking-form">
                <div className="dp-slabel">Request a spot</div>
                <BookingForm type="journey" itemId={journey.id} defaultPrice={journey.price} />
              </div>

            </div>

            {/* ── Sidebar: booking + related ── */}
            <div className="dp-sidebar" id="booking-form">
              <div className="dp-sec">
                <div className="dp-slabel">Request a spot</div>
                <BookingForm type="journey" itemId={journey.id} defaultPrice={journey.price} />
              </div>

              {relatedJourneys.length > 0 && (
                <div className="dp-sec" style={{ marginTop: "1.5rem" }}>
                  <div className="dp-slabel">Also in {atoll?.name}</div>
                  {relatedJourneys.map((other) => (
                    <Link key={other.id} href={`/journeys/${other.id}`}
                      style={{ display: "block", padding: ".65rem 0", borderBottom: "1px solid var(--off2)", textDecoration: "none", fontSize: ".82rem", color: "var(--tq-d)", fontWeight: 600 }}>
                      {other.title} →
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <MobileBookBar price={journey.price} />
      <AIJourneyFinder />
    </>
  );
}
