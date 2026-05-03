import Link from "next/link";
import { getPublishedReviews } from "@/lib/data";

const FALLBACK_REVIEWS = [
  {
    id: "1", authorName: "Sarah M.", location: "London", journey: "Huvadhu Deep — 10 Days",
    body: "We have done a lot of travel. AtollDrift was genuinely different — the kind of trip where you come home changed rather than just rested. Huvadhu felt like a place that had not yet decided to become a destination.",
    rating: 5, sortOrder: 0,
  },
  {
    id: "2", authorName: "James K.", location: "Melbourne", journey: "Island & Ocean — 8 Days",
    body: "The guide grew up on the water he was showing us. That changes everything. He was not reading from a script — he was sharing his home. The reef channel at Fuvahmulah is the most extraordinary thing I have ever seen underwater.",
    rating: 5, sortOrder: 1,
  },
  {
    id: "3", authorName: "Lena B.", location: "Amsterdam", journey: "Southern End — 9 Days",
    body: "I was sceptical of a small group trip. By day three I could not imagine doing it any other way. Six people, local guesthouses, meals cooked by families. The southern Maldives nobody talks about.",
    rating: 5, sortOrder: 2,
  },
];

function ReviewCard({ review, featured }: { review: typeof FALLBACK_REVIEWS[0]; featured?: boolean }) {
  const initial = review.authorName.charAt(0);

  return (
    <div style={{
      padding: featured ? "2.4rem 0" : "1.8rem 0",
      borderBottom: "1px solid var(--off2)",
    }}>
      {/* Stars */}
      <div style={{
        color: "var(--eq)",
        fontSize: featured ? ".8rem" : ".7rem",
        letterSpacing: ".12em",
        marginBottom: ".9rem",
      }}>
        {"★".repeat(review.rating)}
      </div>

      {/* Quote */}
      <p style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: featured ? "clamp(1.1rem, 2.5vw, 1.35rem)" : "clamp(.92rem, 1.8vw, 1.05rem)",
        color: "var(--ink)",
        lineHeight: featured ? 1.85 : 1.8,
        fontStyle: "italic",
        fontWeight: 400,
        marginBottom: "1.2rem",
        maxWidth: featured ? 680 : 520,
        position: "relative",
      }}>
        {/* Large opening quote mark */}
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: featured ? "3.5rem" : "2.8rem",
          color: "var(--tq-xl)",
          lineHeight: 0,
          verticalAlign: "-0.5em",
          marginRight: "0.15em",
          display: "inline-block",
        }}>"</span>
        {review.body}
      </p>

      {/* Reviewer identity */}
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        {/* Avatar circle */}
        <div style={{
          width: featured ? 40 : 34,
          height: featured ? 40 : 34,
          borderRadius: "50%",
          background: "var(--tq)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--white)",
          fontWeight: 700,
          fontSize: featured ? ".88rem" : ".75rem",
          fontFamily: "inherit",
        }}>
          {initial}
        </div>
        <div>
          <div style={{
            fontWeight: 700,
            fontSize: featured ? ".85rem" : ".78rem",
            color: "var(--ink)",
            letterSpacing: ".02em",
            marginBottom: ".08rem",
          }}>
            {review.authorName}
          </div>
          <div style={{
            fontSize: ".6rem",
            color: "var(--muted2)",
            letterSpacing: ".05em",
          }}>
            {review.location} &middot; <span style={{ color: "var(--tq-d)", fontWeight: 600 }}>{review.journey}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Reviews() {
  const dbReviews = await getPublishedReviews();
  const reviews = dbReviews.length > 0 ? dbReviews : FALLBACK_REVIEWS;
  const [featured, ...rest] = reviews;

  return (
    <section style={{ background: "var(--white)", padding: "4rem 1.1rem 3rem", borderTop: "1px solid var(--off2)" }}>
      <div className="inner">

        {/* Intro */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            fontSize: ".52rem", fontWeight: 700, letterSpacing: ".18em",
            textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".5rem",
          }}>
            Traveller voices
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
            color: "var(--ink)",
            fontWeight: 400,
            lineHeight: 1.4,
          }}>
            From people who have seen the Maldives differently.
          </p>
        </div>

        {/* Featured review — full width */}
        {featured && <ReviewCard review={featured} featured />}

        {/* Remaining — two column on desktop */}
        {rest.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "0 3rem",
          }}>
            {rest.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: "2.4rem", paddingTop: "1.8rem", borderTop: "1px solid var(--off2)" }}>
          <Link href="/journeys" style={{
            fontSize: ".68rem", fontWeight: 700, letterSpacing: ".08em",
            textTransform: "uppercase", color: "var(--tq-d)", textDecoration: "none",
            borderBottom: "1.5px solid var(--tq-xl)", paddingBottom: ".1rem",
          }}>
            See journeys that travellers are talking about →
          </Link>
        </div>

      </div>
    </section>
  );
}
