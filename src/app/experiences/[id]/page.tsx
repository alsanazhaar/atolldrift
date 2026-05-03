import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIJourneyFinder from "@/components/ui/AIJourneyFinder";
import BookingForm from "@/components/ui/BookingForm";
import { TealBannerBg } from "@/components/ui/TealBanner";
import { getExperiences, getExperienceById } from "@/lib/data";

export const revalidate = 0;
export const dynamicParams = true;

interface Props { params: { id: string } }

export async function generateStaticParams() {
  const experiences = await getExperiences();
  return experiences.map((xp) => ({ id: xp.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const xp = await getExperienceById(params.id);
  if (!xp) return { title: "Experience Not Found — AtollDrift" };
  return { title: `${xp.title} — AtollDrift Experiences`, description: xp.description.slice(0, 150) + "..." };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const [xp, allExperiences] = await Promise.all([
    getExperienceById(params.id),
    getExperiences(),
  ]);
  if (!xp) notFound();
  const relatedXps = allExperiences.filter((x) => x.atoll === xp.atoll && x.id !== xp.id).slice(0, 2);

  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: "var(--tq)", padding: "2rem 1.1rem 1.8rem", position: "relative", overflow: "hidden" }}>
          <TealBannerBg src={(xp as any).bannerSrc ?? null} />
          <div className="inner" style={{ position: "relative", zIndex: 2 }}>
            <div className="hero-text-block">

            <Link href="/experiences" className="dp-back">← Back to Experiences</Link>
            <div className={`exp-cat ${xp.catClass}`} style={{ display: "inline-block", marginBottom: ".5rem" }}>{xp.catLabel}</div>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.5rem,5.5vw,2rem)", color: "var(--white)", lineHeight: 1.1, marginBottom: ".55rem" }}>
              {xp.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".75rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".9rem", fontWeight: 700, color: "var(--white)", flexShrink: 0 }}>
                {xp.hostInitial}
              </div>
              <div>
                <div style={{ fontSize: ".82rem", color: "var(--white)", fontWeight: 600 }}>{xp.hostName}</div>
                <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.65)", letterSpacing: ".08em", textTransform: "uppercase" }}>{xp.hostLocation}</div>
              </div>
            </div>
            <div className="dp-meta">
              <span>{xp.duration}</span>
              <span>Up to {xp.groupSize} guests</span>
              <span>★ {xp.rating} ({xp.ratingCount} reviews)</span>
            </div>
            </div>{/* end hero-text-block */}
          </div>
        </div>

        <div style={{ background: "var(--white)", padding: "1.5rem 1.1rem 3rem" }}>
          <div className="inner" style={{ display: "grid", gap: "2rem" }}>
            <div>
              <div className="dp-sec">
                <div className="dp-slabel">About this experience</div>
                <p className="dp-desc">{xp.description}</p>
              </div>
              <div className="dp-sec">
                <div className="dp-slabel">What&apos;s included</div>
                <div className="igrid" style={{ marginTop: ".5rem" }}>
                  {xp.included.map((item, i) => <div key={i} className="iitem"><div className="idot" />{item}</div>)}
                </div>
              </div>
              <div className="dp-sec">
                <div className="dp-slabel">Good to know</div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", marginTop: ".5rem" }}>
                  {xp.rules.map((rule, i) => (
                    <div key={i} className="iitem">
                      <div className="idot" style={{ background: "var(--eq)" }} />
                      <span style={{ fontSize: ".78rem", color: "var(--muted)" }}>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "var(--tq-xxl)", border: "1.5px solid var(--tq-xl)", borderLeft: "3px solid var(--tq)", padding: "1rem 1.1rem", fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.7 }}>
                This experience is hosted by a local resident of the southern atolls.{" "}
                <strong style={{ color: "var(--ink)" }}>AtollDrift has met and verified every host.</strong>{" "}
                All bookings include our support line.
              </div>
            </div>
            <div>
              <div style={{ background: "var(--off)", border: "1.5px solid var(--off3)", padding: "1.2rem", position: "sticky", top: 80 }}>
                <div style={{ fontFamily: "Georgia,serif", fontSize: "1.6rem", color: "var(--tq-d)", marginBottom: ".15rem" }}>${xp.price}</div>
                <div style={{ fontSize: ".6rem", letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "1rem" }}>{xp.priceLabel}</div>
                <BookingForm type="experience" itemId={xp.id} defaultPrice={xp.price} />
              </div>
            </div>
          </div>
        </div>

        {relatedXps.length > 0 && (
          <div style={{ background: "var(--off)", borderTop: "1.5px solid var(--tq-xl)", padding: "2rem 1.1rem" }}>
            <div className="inner">
              <div className="mkt-section-label">More in {xp.atoll}</div>
              <div className="exp-grid">
                {relatedXps.map((rx) => (
                  <Link key={rx.id} href={`/experiences/${rx.id}`} className="exp-card" style={{ textDecoration: "none" }}>
                    <div className="exp-card-head">
                      <div className="exp-cat-row"><span className={`exp-cat ${rx.catClass}`}>{rx.catLabel}</span></div>
                      <div className="exp-title">{rx.title}</div>
                      <div className="exp-host-row">
                        <div className="exp-avatar">{rx.hostInitial}</div>
                        <span className="exp-host">{rx.hostName}</span>
                      </div>
                    </div>
                    <div className="exp-card-foot">
                      <div className="exp-meta"><span>{rx.duration}</span></div>
                      <div className="exp-price">${rx.price}<small>/person</small></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <AIJourneyFinder />
    </>
  );
}
