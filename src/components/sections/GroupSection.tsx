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
  departures?: any[];
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
    <section className="group-sec" id="sec-departures">
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
          <div className="dep-list">
            {featured.map((j, i) => (
              <div key={j.id} className="dep-row">
                <div className="dep-left">
                  <div className="dep-atoll-tag th">{atollLabel[j.atollId] ?? j.atollId}</div>
                  <div className="dep-name">{j.title}</div>
                  <div className="dep-date">{j.duration} · From ${j.price.toLocaleString()}</div>
                </div>
                <div className="dep-right">
                  <div style={{
                    fontSize: ".52rem", fontWeight: 700, letterSpacing: ".08em",
                    textTransform: "uppercase", color: "var(--tq-d)",
                    marginBottom: ".35rem",
                  }}>
                    {featuredLabels[i] ?? "Popular"}
                  </div>
                  <Link href={`/journeys/${j.id}`} className="djoin">
                    View
                  </Link>
                </div>
              </div>
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
