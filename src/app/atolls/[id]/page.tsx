import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIJourneyFinder from "@/components/ui/AIJourneyFinder";
import { getAtolls, getJourneys, getExperiences } from "@/lib/data";
import AtollHeroSlideshow from "@/components/ui/AtollHeroSlideshow";
import type { Journey, Experience } from "@/lib/types";

export const revalidate = 0;
export const dynamicParams = true;

interface Props { params: { id: string } }

export async function generateStaticParams() {
  const atolls = await getAtolls();
  return atolls.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const atolls = await getAtolls();
  const atoll = atolls.find((a) => a.id === params.id);
  if (!atoll) return { title: "Atoll Not Found — AtollDrift" };
  return {
    title: `${atoll.name} Atoll — AtollDrift`,
    description: `Explore curated journeys and local experiences in ${atoll.name}, southern Maldives. ${atoll.italic}`,
  };
}

// ── Journey card ──────────────────────────────────────────────────────
function JourneyCard({ journey }: { journey: Journey }) {
  const img = (journey as any).bannerSrc ?? null;
  return (
    <Link
      href={`/journeys/${journey.id}`}
      className={`jcard${journey.goldAccent ? " gold-l" : ""}`}
      style={{ textDecoration: "none" }}
    >
      {/* Image strip */}
      {img && (
        <div className="jcard-img">
          <img src={img} alt={journey.title} />
        </div>
      )}
      {/* Text content */}
      <div className="jcard-content">
        <div className="jcard-top">
          <div className="jcard-title">{journey.title}</div>
          <div className="jcard-price">
            <span style={{ fontSize: ".5rem", fontFamily: "Montserrat,sans-serif", fontWeight: 600, letterSpacing: ".06em", opacity: .7, marginRight: ".2rem", verticalAlign: "middle" }}>FROM</span>
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
          <span>Request a spot</span>
          <span className="jcard-cta-arrow">→</span>
        </div>
      </div>
    </Link>
  );
}

// ── Experience card ───────────────────────────────────────────────────
function XpCard({ xp }: { xp: Experience }) {
  return (
    <Link href={`/experiences/${xp.id}`} className="exp-card" style={{ textDecoration: "none" }}>
      <div className="exp-card-head">
        <div className="exp-cat-row">
          <span className={`exp-cat ${xp.catClass}`}>{xp.catLabel}</span>
        </div>
        <div className="exp-title">{xp.title}</div>
        <div className="exp-host-row">
          <div className="exp-avatar">{xp.hostInitial}</div>
          <span className="exp-host">{xp.hostName}</span>
        </div>
      </div>
      <div className="exp-card-foot">
        <div className="exp-meta">
          <span>{xp.duration}</span>
          <span>{xp.groupSize} guests</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <span className="exp-rating">★ {xp.rating}</span>
          <div className="exp-price">${xp.price}<small>/person</small></div>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default async function AtollPage({ params }: Props) {
  const [atolls, allJourneys, allExperiences] = await Promise.all([
    getAtolls(),
    getJourneys(),
    getExperiences(),
  ]);

  const atoll = atolls.find((a) => a.id === params.id);
  if (!atoll) notFound();

  const hasPhoto = !!atoll.photo?.main?.src;
  const journeys = allJourneys.filter((j) => j.atollId === atoll.id);
  const experiences = allExperiences.filter((x) =>
    x.atoll.toLowerCase() === atoll.name.toLowerCase()
  );

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <div style={{ background: "#0d1f24", padding: "2.5rem 1.1rem 2rem", position: "relative", overflow: "hidden", minHeight: "58vh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          {/* Slideshow — uses all available atoll photos */}
          <AtollHeroSlideshow slides={[
            ...(atoll.photo?.main?.src ? [{ src: atoll.photo.main.src, alt: atoll.photo.main.alt }] : []),
            ...(atoll.photo?.strip1?.src ? [{ src: atoll.photo.strip1.src, alt: atoll.photo.strip1.alt }] : []),
            ...(atoll.photo?.strip2?.src ? [{ src: atoll.photo.strip2.src, alt: atoll.photo.strip2.alt }] : []),
          ]} />
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.12) 0%, transparent 30%, rgba(0,0,0,.45) 65%, rgba(0,0,0,.78) 100%)", zIndex: 1 }} />

          <div className="inner" style={{ position: "relative", zIndex: 2, maxWidth: "100%", margin: 0, padding: "0 1.1rem" }}>
            <div style={{ maxWidth: 560 }}>
            <Link href="/" className="dp-back">← Home</Link>

            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", margin: ".5rem 0" }}>
              <span className={`hemi-badge ${atoll.hemisphere === "north" ? "hemi-n" : "hemi-s"}`}>
                {atoll.badge}
              </span>
              {journeys.length > 0 && (
                <span style={{ fontSize: ".52rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }}>
                  {journeys.length} {journeys.length === 1 ? "journey" : "journeys"} available
                </span>
              )}
            </div>

            <div className="atoll-coord" style={{ color: "rgba(255,255,255,.8)", marginBottom: ".3rem" }}>{atoll.coord}</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2.2rem,7vw,3.2rem)", color: "var(--white)", lineHeight: 1.05, fontWeight: 600, marginBottom: ".4rem" }}>
              {atoll.name}
            </h1>
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: "italic", fontSize: "clamp(.9rem,2.5vw,1.1rem)", color: "rgba(255,255,255,.85)", lineHeight: 1.55, maxWidth: 520, marginBottom: "1.4rem" }}>
              {atoll.italic}
            </p>

            <div style={{ display: "flex", gap: ".55rem", flexWrap: "wrap" }}>
              {journeys.length > 0 && (
                <a href="#journeys" className="btn-p" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                  See journeys
                </a>
              )}
              <Link href="/journeys" className="btn-g" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                All journeys
              </Link>
            </div>
            </div>{/* end max-width wrapper */}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ background: "var(--white)" }}>
          <div className="inner" style={{ padding: "2.4rem 1.1rem" }}>

            {/* Why this atoll */}
            <div style={{ marginBottom: "2.8rem" }}>
              <div className="dp-slabel" style={{ marginBottom: ".75rem" }}>About {atoll.name}</div>
              <p style={{ fontSize: ".88rem", color: "var(--muted)", lineHeight: 1.9, marginBottom: "1.2rem", maxWidth: 640 }}>
                {atoll.body}
              </p>

              {/* Truth points */}
              {atoll.truths.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: ".65rem", maxWidth: 580 }}>
                  {atoll.truths.map((truth, i) => (
                    <div key={i} style={{ display: "flex", gap: ".55rem" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, marginTop: ".48rem", background: truth.variant === "gold" ? "var(--tq-d)" : "var(--tq)" }} />
                      <div style={{ fontSize: ".8rem", color: "var(--muted)", lineHeight: 1.7 }}
                        dangerouslySetInnerHTML={{ __html: truth.text }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Why this atoll — only shown if admin has filled it in */}
            {(atoll as any).whyThisAtoll && (
              <div style={{ marginBottom: "2.8rem", background: "var(--off)", borderLeft: "3px solid var(--tq)", padding: "1.2rem 1.4rem" }}>
                <div className="dp-slabel" style={{ marginBottom: ".65rem" }}>Why {atoll.name}</div>
                <p style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.85, margin: 0 }}>
                  {(atoll as any).whyThisAtoll}
                </p>
              </div>
            )}

            {/* Photo strips */}
            {hasPhoto && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", marginBottom: "2.8rem" }}>
                {atoll.photo.strip1.src && (
                  <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: "2px", overflow: "hidden", background: "var(--tq-vd)" }}>
                    <Image src={atoll.photo.strip1.src} alt={atoll.photo.strip1.alt} fill style={{ objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(2,40,48,.65))", padding: ".45rem .6rem .4rem" }}>
                      <div style={{ fontSize: ".52rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.88)", fontWeight: 600 }}>{atoll.photo.strip1.label}</div>
                    </div>
                  </div>
                )}
                {atoll.photo.strip2.src && (
                  <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: "2px", overflow: "hidden", background: "var(--tq-vd)" }}>
                    <Image src={atoll.photo.strip2.src} alt={atoll.photo.strip2.alt} fill style={{ objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(2,40,48,.65))", padding: ".45rem .6rem .4rem" }}>
                      <div style={{ fontSize: ".52rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.88)", fontWeight: 600 }}>{atoll.photo.strip2.label}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Journeys */}
            {journeys.length > 0 && (
              <div id="journeys" style={{ marginBottom: "2.8rem" }}>
                <div className="dp-slabel" style={{ marginBottom: ".75rem" }}>
                  Journeys in {atoll.name}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
                  {journeys.map((j) => <JourneyCard key={j.id} journey={j} />)}
                </div>
              </div>
            )}

            {/* Experiences */}
            {experiences.length > 0 && (
              <div style={{ marginBottom: "2.8rem" }}>
                <div className="dp-slabel" style={{ marginBottom: ".75rem" }}>
                  Local experiences in {atoll.name}
                </div>
                <div className="exp-grid">
                  {experiences.map((xp) => <XpCard key={xp.id} xp={xp} />)}
                </div>
              </div>
            )}

            {/* Other atolls */}
            <div style={{ borderTop: "1.5px solid var(--tq-xl)", paddingTop: "1.8rem" }}>
              <div className="dp-slabel" style={{ marginBottom: ".75rem" }}>Explore other atolls</div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
                {atolls
                  .filter((a) => a.id !== atoll.id)
                  .map((a) => (
                    <Link key={a.id} href={`/atolls/${a.id}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: ".75rem .9rem", background: "var(--off)",
                      border: "1.5px solid var(--tq-xl)", textDecoration: "none",
                      transition: "border-color .2s",
                    }}>
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1rem", color: "var(--ink)", fontWeight: 600 }}>{a.name}</div>
                        <div style={{ fontSize: ".56rem", color: "var(--muted2)", letterSpacing: ".08em", marginTop: ".1rem" }}>{a.coord}</div>
                      </div>
                      <span style={{ fontSize: ".65rem", color: "var(--tq-d)", fontWeight: 700 }}>Explore →</span>
                    </Link>
                  ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{ background: "var(--tq)", padding: "2.2rem 1.1rem", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.3rem", color: "var(--white)", fontWeight: 600, marginBottom: ".5rem", lineHeight: 1.2 }}>
            Ready to see {atoll.name}?
          </div>
          <p style={{ fontSize: ".78rem", color: "rgba(255,255,255,.82)", lineHeight: 1.7, marginBottom: "1.2rem", maxWidth: 380, margin: "0 auto .9rem" }}>
            Small groups. Local guesthouses. Guides who grew up here.
          </p>
          <div style={{ display: "flex", gap: ".55rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/journeys?atoll=${atoll.id}`} className="btn-p" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              View journeys
            </Link>
            <Link href="/experiences" className="btn-g" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Browse experiences
            </Link>
          </div>
        </div>

      </main>
      <Footer />
      <AIJourneyFinder />
    </>
  );
}
