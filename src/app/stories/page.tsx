import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedStories, getAtolls } from "@/lib/data";
import type { Story } from "@/lib/types";

export const revalidate = 180;

export const metadata: Metadata = {
  title: "Stories — AtollDrift Maldives",
  description: "Local voices and real stories from the southern Maldives — Huvadhu, Fuvahmulah, and Addu.",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// ── Featured card (first story, large) ───────────────────────────────
function FeaturedCard({ story, atollName }: { story: Story; atollName?: string }) {
  return (
    <Link href={`/stories/${story.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        position: "relative", width: "100%", aspectRatio: "16/9",
        background: "var(--tq-vd)", overflow: "hidden", marginBottom: "1.1rem",
      }}>
        {story.coverImageUrl ? (
          <Image src={story.coverImageUrl} alt={story.title} fill
            style={{ objectFit: "cover", transition: "transform .5s ease" }} priority sizes="100vw" />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,var(--tq),var(--tq-vd))" }} />
        )}
        {/* Overlay gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(2,40,48,.75))" }} />
        {/* Atoll tag on image */}
        {atollName && (
          <div style={{ position: "absolute", top: "1rem", left: "1rem", fontSize: ".52rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.9)", background: "rgba(2,40,48,.45)", padding: ".18rem .55rem", borderRadius: "2px", backdropFilter: "blur(4px)" }}>
            {atollName}
          </div>
        )}
      </div>
      <div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(1.4rem,4vw,2rem)", color: "var(--ink)", fontWeight: 600, lineHeight: 1.15, marginBottom: ".45rem" }}>
          {story.title}
        </h2>
        <p style={{ fontSize: ".8rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: ".6rem", maxWidth: 560 }}>
          {story.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem", fontSize: ".58rem", color: "var(--muted2)", letterSpacing: ".04em" }}>
          {story.authorName && <span style={{ fontWeight: 600, color: "var(--ink)" }}>{story.authorName}</span>}
          {story.authorName && story.publishedAt && <span style={{ color: "var(--off3)" }}>·</span>}
          {story.publishedAt && <span>{formatDate(story.publishedAt)}</span>}
          <span style={{ marginLeft: ".3rem", color: "var(--tq-d)", fontWeight: 700, fontSize: ".6rem" }}>Read story →</span>
        </div>
      </div>
    </Link>
  );
}

// ── Small card (rest of stories) ─────────────────────────────────────
function SmallCard({ story, atollName }: { story: Story; atollName?: string }) {
  return (
    <Link href={`/stories/${story.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "3/2", background: "var(--tq-vd)", overflow: "hidden", marginBottom: ".65rem" }}>
        {story.coverImageUrl ? (
          <Image src={story.coverImageUrl} alt={story.title} fill style={{ objectFit: "cover" }} sizes="(max-width:900px) 50vw, 33vw" />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,var(--tq),var(--tq-vd))" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 50%, rgba(2,40,48,.55))" }} />
        {atollName && (
          <div style={{ position: "absolute", top: ".6rem", left: ".6rem", fontSize: ".48rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.9)", background: "rgba(2,40,48,.45)", padding: ".14rem .44rem", borderRadius: "2px" }}>
            {atollName}
          </div>
        )}
      </div>
      <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.1rem", color: "var(--ink)", fontWeight: 600, lineHeight: 1.2, marginBottom: ".3rem" }}>
        {story.title}
      </h3>
      <p style={{ fontSize: ".72rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: ".4rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
        {story.excerpt}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".55rem", color: "var(--muted2)" }}>
        {story.authorName && <span style={{ fontWeight: 600 }}>{story.authorName}</span>}
        {story.publishedAt && <span>{formatDate(story.publishedAt)}</span>}
        <span style={{ color: "var(--tq-d)", fontWeight: 700, marginLeft: "auto" }}>Read →</span>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default async function StoriesPage() {
  const [stories, atolls] = await Promise.all([getPublishedStories(), getAtolls()]);
  const atollMap = Object.fromEntries(atolls.map(a => [a.id, a.name]));

  const featured = stories[0] ?? null;
  const rest = stories.slice(1);

  return (
    <>
      <Navbar />
      <main>

        {/* Header */}
        <div style={{ background: "var(--tq)", padding: "2.4rem 1.1rem 2rem" }}>
          <div className="inner">
            <div style={{ fontSize: ".54rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: ".5rem" }}>
              Southern Maldives · Local Voices
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2rem,5vw,2.8rem)", color: "var(--white)", fontWeight: 600, lineHeight: 1.05, marginBottom: ".45rem" }}>
              Stories
            </h1>
            <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,.75)", lineHeight: 1.8, maxWidth: 440, margin: 0 }}>
              The fishermen, the craftspeople, the guides. Not a travel blog — a record of what is actually here.
            </p>
          </div>
        </div>

        {/* Stories */}
        <div style={{ background: "var(--white)", padding: "2.4rem 1.1rem 3.5rem" }}>
          <div className="inner">
            {stories.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.2rem", color: "var(--muted)", fontStyle: "italic" }}>
                  Stories coming soon.
                </div>
              </div>
            ) : (
              <>
                {/* Featured */}
                {featured && (
                  <div style={{ marginBottom: "3rem", paddingBottom: "3rem", borderBottom: "1px solid var(--off2)" }}>
                    <div style={{ fontSize: ".5rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".85rem" }}>
                      Featured
                    </div>
                    <FeaturedCard story={featured} atollName={featured.atollId ? atollMap[featured.atollId] : undefined} />
                  </div>
                )}

                {/* Grid of remaining */}
                {rest.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "2.4rem 1.8rem",
                  }}>
                    {rest.map(story => (
                      <SmallCard key={story.id} story={story} atollName={story.atollId ? atollMap[story.atollId] : undefined} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
