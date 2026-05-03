"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExperienceCard from "@/components/ui/ExperienceCard";
import AIJourneyFinder from "@/components/ui/AIJourneyFinder";
import ExperiencesBanner from "@/components/ui/ExperiencesBanner";
import { getExperiences } from "@/lib/data";
import type { Experience, ExperienceCategory } from "@/lib/types";

type Filter = "all" | ExperienceCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ocean", label: "🌊 Ocean" },
  { value: "surf", label: "🏄 Surf" },
  { value: "food", label: "🍽 Food" },
  { value: "craft", label: "🪡 Craft" },
  { value: "culture", label: "🕌 Culture" },
  { value: "freedive", label: "🤿 Freedive" },
];

const STATS = [
  { n: "3", l: "Atolls" },
  { n: "40+", l: "Hosts" },
  { n: "100%", l: "Local" },
];

export default function ExperiencesPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperiences().then((data) => { setExperiences(data); setLoading(false); });
  }, []);

  const filtered = activeFilter === "all"
    ? experiences
    : experiences.filter((xp) => xp.category === activeFilter);

  return (
    <>
      <Navbar />
      <main>
        <div className="mkt-hero" style={{ position: "relative", overflow: "hidden" }}>
          <ExperiencesBanner />
          <svg className="mkt-hero-bg" width="180" height="180" viewBox="0 0 220 220" fill="none" aria-hidden="true" style={{ position: "relative", zIndex: 2 }}>
            <path d="M110 40 L121 72 L150 52 L135 82 L168 80 L145 103 L168 118 L136 120 L148 152 L121 136 L110 168 L99 136 L72 152 L84 120 L52 118 L75 103 L52 80 L85 82 L70 52 L99 72 Z" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="110" cy="110" r="28" stroke="white" strokeWidth="0.8" fill="none" />
          </svg>
          <div className="inner" style={{ position: "relative", zIndex: 2 }}>
            <div className="hero-text-block">

            <div className="mkt-kicker">Southern Maldives · Local Experiences</div>
            <h1>Experiences from people<br /><em>who live here.</em></h1>
            <p>
              Surf lessons from the guide who grew up on the pass. Cooking with the woman who
              grows her own taro. Fishing at dawn with the man who reads the current by feel.
            </p>
            <div className="mkt-hero-btns">
              <button className="btn-p" onClick={() => document.getElementById("xp-grid")?.scrollIntoView({ behavior: "smooth" })}>
                Browse Experiences
              </button>
              <Link href="/host" className="btn-g" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                List Your Experience
              </Link>
            </div>
            </div>
            </div>{/* end hero-text-block */}
          </div>
        </div>

        <div className="mkt-stats">
          {STATS.map((s) => (
            <div key={s.l} className="mkt-stat">
              <div className="mkt-stat-n">{s.n}</div>
              <div className="mkt-stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mkt-filters" id="xp-grid">
          <span className="mkt-filter-lbl">Filter:</span>
          {FILTERS.map((f) => (
            <button key={f.value} className={`mkt-ftag${activeFilter === f.value ? " active" : ""}`}
              onClick={() => setActiveFilter(f.value)}>{f.label}</button>
          ))}
        </div>

        <div className="mkt-body">
          <div className="inner">
            <div className="mkt-section-label">
              {activeFilter === "all" ? "All Experiences" : FILTERS.find((f) => f.value === activeFilter)?.label}
              {" "}· {loading ? "…" : `${filtered.length} available`}
            </div>
            {loading ? (
              <div style={{ fontSize: ".8rem", color: "var(--muted)", padding: "2rem 0" }}>Loading experiences…</div>
            ) : (
              <div className="exp-grid">
                {filtered.map((xp) => <ExperienceCard key={xp.id} experience={xp} />)}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "var(--off)", borderTop: "1.5px solid var(--off3)", padding: "2rem 1.1rem", textAlign: "center" }}>
          <div style={{ fontSize: ".58rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".5rem" }}>For Locals</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.3rem", color: "var(--ink)", marginBottom: ".5rem", lineHeight: 1.3 }}>Do you have something to share?</h2>
          <p style={{ fontSize: ".8rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.1rem", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
            If you fish, cook, surf, carve, weave, dive, or know something about these atolls that the world should know — list it here.
          </p>
          <Link href="/host" className="btn-p" style={{ background: "var(--tq)", color: "var(--white)", minHeight: 48, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            List My Experience
          </Link>
        </div>
      </main>
      <Footer />
      <AIJourneyFinder />
    </>
  );
}
