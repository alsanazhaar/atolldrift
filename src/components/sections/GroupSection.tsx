"use client";

import Link from "next/link";

const privateGroups = [
  { name: "The Dhoni Journey", desc: "The whole boat. Your group, your pace, your itinerary built with us." },
  { name: "Couple & Small Groups", desc: "Two to four people. We pair you with one other group or you travel solo." },
  { name: "Family Expeditions", desc: "Designed around children who can swim and a pace that keeps everyone whole." },
  { name: "Open Group Journeys", desc: "Join six to ten strangers who will not stay strangers. Our most popular format." },
];

interface Journey {
  id: string;
  title: string;
  atollId: string;
  price: number;
  duration: string;
  groupSize: string;
  tagline: string;
}

interface GroupSectionProps {
  journeys?: Journey[];
}

// Atoll label map
const atollLabel: Record<string, string> = {
  huvadhu: "Huvadhu",
  fuvahmulah: "Fuvahmulah",
  addu: "Addu",
};

// Featured labels — assign to first few journeys
const featuredLabels = ["Popular", "Recommended", "Popular", "Recommended", "Popular", "Recommended"];

export default function GroupSection({ journeys = [] }: GroupSectionProps) {
  const featured = journeys.slice(0, 6);

  return (
    <section className="group-sec" id="sec-journeys">
      <div className="inner">
        <div className="group-left">
          <h2 className="group-title">Popular Journeys</h2>
          <p className="group-sub">
            Small groups of 6–10 people. Flexible dates throughout the season. Confirmed on request within 24 hours.
          </p>
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {["6–10 people per group", "Flexible dates", "Confirmed within 24 hours"].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--tq)", flexShrink: 0 }} />
                <span style={{ fontSize: ".72rem", color: "var(--muted)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="group-right">
          <div style={{ display: "flex", flexDirection: "column", gap: ".65rem" }}>
            {featured.map((j, i) => (
              <Link key={j.id} href={`/journeys/${j.id}`}
                className={`jcard${(j as any).goldAccent ? " gold-l" : ""}`}
                style={{ textDecoration: "none" }}>
                {(j as any).bannerSrc && (
                  <div className="jcard-img">
                    <img src={(j as any).bannerSrc} alt={j.title} loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="jcard-content">
                  <div style={{ fontSize: ".48rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".2rem" }}>
                    {atollLabel[j.atollId] ?? j.atollId} · {featuredLabels[i] ?? "Popular"}
                  </div>
                  <div className="jcard-top">
                    <div className="jcard-title">{j.title}</div>
                    <div className="jcard-price">
                      <span style={{ fontSize: ".5rem", fontFamily: "Montserrat,sans-serif", fontWeight: 600, letterSpacing: ".06em", opacity: .7, marginRight: ".2rem", verticalAlign: "middle" }}>FROM</span>
                      ${j.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="jcard-meta">
                    <span>{j.duration}</span>
                    <span style={{ color: "var(--off3)" }}>·</span>
                    <span>{j.groupSize}</span>
                    <span style={{ color: "var(--off3)" }}>·</span>
                    <span style={{ color: "var(--tq-d)", fontWeight: 600 }}>Flexible dates</span>
                  </div>
                  <div className="jcard-cta">
                    <span>Request a spot</span>
                    <span className="jcard-cta-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/journeys" className="full-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
            View All Journeys
          </Link>
        </div>
      </div>
    </section>
  );
}
