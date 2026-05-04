import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIJourneyFinder from "@/components/ui/AIJourneyFinder";
import { getPublishedStories, getStoryBySlug, getAtolls, getJourneys, getExperiences } from "@/lib/data";
import type { StoryImage } from "@/lib/types";

export const revalidate = 180;
export const dynamicParams = true;

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const stories = await getPublishedStories();
  return stories.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await getStoryBySlug(params.slug);
  if (!story) return { title: "Story Not Found — AtollDrift Maldives" };
  return {
    title: `${story.title} — AtollDrift Stories`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      ...(story.coverImageUrl ? { images: [story.coverImageUrl] } : {}),
    },
  };
}

// ── Image collage component ───────────────────────────────────────────
function ImageCollage({ images }: { images: StoryImage[] }) {
  if (!images.length) return null;
  const [first, second, third, ...extra] = images;

  return (
    <div style={{ margin: "2.8rem 0" }}>
      {/* Label */}
      <div style={{ fontSize: ".5rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".85rem" }}>
        Photographs
      </div>

      {/* Layout: one large + two small side by side */}
      {images.length === 1 && (
        <PhotoBlock img={first} size="full" />
      )}

      {images.length === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
          <PhotoBlock img={first} />
          <PhotoBlock img={second} />
        </div>
      )}

      {images.length >= 3 && (
        <>
          {/* Main large image */}
          <PhotoBlock img={first} size="full" style={{ marginBottom: ".5rem" }} />
          {/* Two smaller */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
            <PhotoBlock img={second} />
            <PhotoBlock img={third} />
          </div>
        </>
      )}

      {/* Any additional images stacked below */}
      {extra.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: ".5rem", marginTop: ".5rem" }}>
          {extra.map(img => <PhotoBlock key={img.id} img={img} />)}
        </div>
      )}
    </div>
  );
}

function PhotoBlock({ img, size, style }: { img: StoryImage; size?: "full"; style?: React.CSSProperties }) {
  return (
    <figure style={{ margin: 0, ...style }}>
      <div style={{
        position: "relative",
        aspectRatio: size === "full" ? "16/9" : "4/3",
        background: "var(--tq-vd)",
        overflow: "hidden",
      }}>
        <Image
          src={img.imageUrl}
          alt={img.caption ?? ""}
          fill
          style={{ objectFit: "cover" }}
          sizes={size === "full" ? "100vw" : "(max-width:900px) 50vw, 33vw"}
        />
      </div>
      {img.caption && (
        <figcaption style={{ fontSize: ".6rem", color: "var(--muted2)", marginTop: ".35rem", fontStyle: "italic", lineHeight: 1.5 }}>
          {img.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default async function StoryPage({ params }: Props) {
  const [story, atolls, allJourneys, allExperiences] = await Promise.all([
    getStoryBySlug(params.slug),
    getAtolls(),
    getJourneys(),
    getExperiences(),
  ]);
  if (!story) notFound();

  const atoll = story.atollId ? atolls.find(a => a.id === story.atollId) : null;
  const atollJourneys = allJourneys.filter(j => j.atollId === story.atollId).slice(0, 2);
  const atollExperiences = allExperiences.filter(x => x.atoll.toLowerCase() === atoll?.name.toLowerCase()).slice(0, 2);
  const paragraphs = story.content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  // Decide where to inject the image collage — after 3rd paragraph if enough text
  const collageAfter = Math.min(3, Math.floor(paragraphs.length / 2));

  return (
    <>
      <Navbar />
      <main>

        {/* ── Cover hero ── */}
        <div className="story-hero">
          {/* Cover image */}
          {story.coverImageUrl ? (
            <Image
              src={story.coverImageUrl}
              alt={story.title}
              fill
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
              priority
              sizes="100vw"
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,var(--tq),var(--tq-vd))" }} />
          )}

          {/* Two-layer gradient: light at top (nav), heavy at bottom (text) */}
          <div className="story-hero-gradient" />

          {/* Content anchored to bottom */}
          <div className="story-hero-content">
            <div className="inner">
              <Link href="/stories" className="dp-back" style={{ marginBottom: ".8rem", display: "inline-block" }}>← Stories</Link>

              {atoll && (
                <div className="story-hero-atoll">
                  {atoll.name} · {atoll.coord}
                </div>
              )}

              <h1 className="story-hero-title">{story.title}</h1>

              {/* Hook: first sentence of story */}
              {paragraphs[0] && (() => {
                const dot = paragraphs[0].search(/[.!?](\s|$)/);
                const hook = dot > 0 ? paragraphs[0].slice(0, dot + 1) : paragraphs[0].slice(0, 120);
                return (
                  <p className="story-hero-hook">{hook}</p>
                );
              })()}

              <div className="story-hero-meta">
                {story.authorName && <span className="story-hero-author">{story.authorName}</span>}
                {story.authorName && story.publishedAt && <span className="story-hero-sep">·</span>}
                {story.publishedAt && (
                  <span>{new Date(story.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Story body — 3 column on desktop ── */}
        <div style={{ background: "var(--white)", padding: "3.4rem 1.1rem 3.8rem" }}>
          <div className="inner">
            <div className="story-layout">

              {/* Left — person/subject photo */}
              <div className="story-left-col">
                {story.personImageUrl ? (
                  <div style={{ position: "sticky", top: 88 }}>
                    <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", borderRadius: "2px", background: "var(--tq-vd)" }}>
                      <Image
                        src={story.personImageUrl}
                        alt={story.authorName ?? ""}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="220px"
                      />
                    </div>
                    {story.authorName && (
                      <div style={{ marginTop: ".6rem" }}>
                        <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: ".95rem", color: "var(--ink)", fontWeight: 600 }}>
                          {story.authorName}
                        </div>
                        {atoll && (
                          <div style={{ fontSize: ".56rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted2)", marginTop: ".1rem" }}>
                            {atoll.name}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fallback decorative element if no person photo */
                  <div style={{ position: "sticky", top: 88 }}>
                    <div style={{ width: "100%", aspectRatio: "1/1", background: "var(--tq-xxl)", border: "1.5px solid var(--tq-xl)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "2.5rem", color: "var(--tq-xl)", fontStyle: "italic", textAlign: "center", lineHeight: 1, padding: "1rem" }}>
                        0°
                      </div>
                    </div>
                    {atoll && (
                      <div style={{ marginTop: ".6rem", fontSize: ".56rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted2)" }}>
                        {atoll.name} · {atoll.coord}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Centre — story text */}
              <div className="story-centre-col">

                {paragraphs.map((para, i) => (
                  <div key={i}>
                    {/* First paragraph: split out opening sentence as hook */}
                    {i === 0 ? (() => {
                      const dot = para.search(/[.!?]\s/);
                      const hook = dot > 0 ? para.slice(0, dot + 1) : para;
                      const rest = dot > 0 ? para.slice(dot + 1).trim() : "";
                      return (
                        <div style={{ marginBottom: "1.8rem" }}>
                          <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(1.05rem,2.2vw,1.2rem)", color: "var(--ink)", lineHeight: 1.85, fontWeight: 400 }}>
                            {hook}
                          </p>
                          {rest && (
                            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: ".95rem", color: "var(--muted)", lineHeight: 2, marginTop: "1rem" }}>
                              {rest}
                            </p>
                          )}
                        </div>
                      );
                    })() : (
                    <p style={{
                      fontSize: ".92rem",
                      color: "var(--muted)",
                      lineHeight: 2.1,
                      marginBottom: "1.8rem",
                      maxWidth: "52ch",
                    }}>
                      {para}
                    </p>
                    )}

                    {/* Full-width breakout image after first paragraph */}
                    {i === 0 && story.images && story.images.length > 0 && (
                      <figure style={{ margin: "2.4rem -1.1rem 0", padding: 0 }}>
                        <div style={{ position: "relative", aspectRatio: "16/7", background: "var(--tq-vd)", overflow: "hidden" }}>
                          <Image
                            src={story.images[0].imageUrl}
                            alt={story.images[0].caption ?? ""}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="100vw"
                          />
                        </div>
                        {story.images[0].caption && (
                          <figcaption className="story-caption" style={{ padding: ".55rem 1.1rem 0" }}>
                            {story.images[0].caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {/* Remaining collage after mid-story */}
                    {i === collageAfter - 1 && story.images && story.images.length > 1 && (
                      <div style={{ marginTop: "2.4rem", marginBottom: ".4rem" }}><ImageCollage images={story.images.slice(1)} /></div>
                    )}
                  </div>
                ))}

                {story.images && story.images.length > 1 && collageAfter >= paragraphs.length && (
                  <ImageCollage images={story.images.slice(1)} />
                )}
              </div>

              {/* Right — journey + experience promo */}
              {atoll && (atollJourneys.length > 0 || atollExperiences.length > 0) && (
                <div className="story-right-col">
                  <div style={{ position: "sticky", top: 88 }}>
                    <div style={{ fontSize: ".5rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".7rem" }}>
                      From {atoll.name}
                    </div>

                    {atollJourneys.length > 0 && (
                      <div style={{ marginBottom: "1.1rem" }}>
                        <div style={{ fontSize: ".48rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: ".45rem" }}>
                          Journeys
                        </div>
                        {atollJourneys.map(j => (
                          <Link key={j.id} href={`/journeys/${j.id}`} style={{ textDecoration: "none", display: "block", marginBottom: ".4rem" }}>
                            <div style={{ background: "var(--off)", border: "1.5px solid var(--tq-xl)", borderLeft: "2px solid var(--tq)", padding: ".65rem .75rem" }}>
                              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: ".9rem", color: "var(--ink)", fontWeight: 600, lineHeight: 1.25, marginBottom: ".18rem" }}>
                                {j.title}
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontSize: ".55rem", color: "var(--muted2)" }}>{j.duration} · {j.groupSize}</div>
                                <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: ".85rem", color: "var(--tq-d)", fontWeight: 600 }}>${j.price.toLocaleString()}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {atollExperiences.length > 0 && (
                      <div style={{ marginBottom: "1.1rem" }}>
                        <div style={{ fontSize: ".48rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: ".45rem" }}>
                          Experiences
                        </div>
                        {atollExperiences.map(x => (
                          <Link key={x.id} href={`/experiences/${x.id}`} style={{ textDecoration: "none", display: "block", marginBottom: ".4rem" }}>
                            <div style={{ background: "var(--off)", border: "1.5px solid var(--tq-xl)", borderLeft: "2px solid var(--eq)", padding: ".65rem .75rem" }}>
                              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: ".9rem", color: "var(--ink)", fontWeight: 600, lineHeight: 1.25, marginBottom: ".18rem" }}>
                                {x.title}
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontSize: ".55rem", color: "var(--muted2)" }}>{x.hostName} · {x.duration}</div>
                                <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: ".85rem", color: "var(--tq-d)", fontWeight: 600 }}>${x.price}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    <Link href={`/atolls/${atoll.id}`} style={{
                      display: "inline-flex", alignItems: "center",
                      fontSize: ".58rem", fontWeight: 700, letterSpacing: ".09em",
                      textTransform: "uppercase", color: "var(--tq-d)", textDecoration: "none",
                      borderBottom: "1.5px solid var(--tq-xl)", paddingBottom: ".1rem",
                    }}>
                      Come and see {atoll.name} →
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── Atoll CTA ── */}
        <div style={{ background: "var(--off)", borderTop: "1px solid var(--off2)", padding: "1.6rem 1.1rem" }}>
          <div className="inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: ".75rem" }}>
            <Link href="/stories" style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--tq-d)", textDecoration: "none" }}>
              ← More stories
            </Link>
            <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: "italic", fontSize: ".88rem", color: "var(--muted2)" }}>
              AtollDrift · Southern Maldives
            </span>
          </div>
        </div>

      </main>
      <Footer />
      <AIJourneyFinder />
    </>
  );
}
