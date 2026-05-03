"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Atoll, Journey } from "@/lib/types";

function TruthPoint({ text, variant }: { text: string; variant?: "gold" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="truth" ref={ref}>
      <div className={`tdot${variant === "gold" ? " gold" : ""}`} />
      <div className="ttext" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

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

function AtollPhoto({ atoll, side }: { atoll: Atoll; side: "left" | "right" }) {
  const revealClass = side === "right" ? "reveal-right" : "reveal-left";
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`atoll-photo ${revealClass}`} ref={ref}>
      <div className="photo-frame">
        <Image src={atoll.photo.main.src} alt={atoll.photo.main.alt} fill
          style={{ objectFit: "cover" }} sizes="(max-width: 600px) 100vw, (max-width: 900px) 300px, 420px" loading="lazy" />
        <div className="photo-overlay">
          <div className="photo-title">{atoll.photo.main.title}</div>
          <div className="photo-sub">{atoll.photo.main.sub}</div>
        </div>
      </div>
      <div className="photo-strips">
        <div className="photo-strip">
          <Image src={atoll.photo.strip1.src} alt={atoll.photo.strip1.alt} fill
            style={{ objectFit: "cover" }} sizes="(max-width: 600px) 50vw, 150px" loading="lazy" />
          <div className="photo-strip-lbl">{atoll.photo.strip1.label}</div>
        </div>
        <div className="photo-strip">
          <Image src={atoll.photo.strip2.src} alt={atoll.photo.strip2.alt} fill
            style={{ objectFit: "cover" }} sizes="(max-width: 600px) 50vw, 150px" loading="lazy" />
          <div className="photo-strip-lbl">{atoll.photo.strip2.label}</div>
        </div>
      </div>
      <div className="photo-credit">Photos via Unsplash</div>
    </div>
  );
}

interface AtollSectionProps {
  atoll: Atoll;
  journeys: Journey[];
  showDividerAfter?: boolean;
}

export default function AtollSection({ atoll, journeys, showDividerAfter }: AtollSectionProps) {
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = textRef.current;
    if (!container) return;
    const elements = container.querySelectorAll(".atoll-name, .atoll-italic, .atoll-body");
    elements.forEach((el, i) => {
      el.classList.add("reveal");
      (el as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
    });
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }); },
      { threshold: 0.12 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Filter journeys for this atoll from Supabase data
  const atollJourneys = journeys.filter((j) => j.atollId === atoll.id);
  const photoSide = atoll.flip ? "left" : "right";

  return (
    <>
      <section id={`sec-${atoll.id}`} className={`atoll-sec${atoll.tinted ? " tinted" : ""}`}>
        <div className="inner">
          <div className={`atoll-layout${atoll.flip ? " flip" : ""}`}>
            <div ref={textRef}>
              <div className="atoll-num-row">
                <span className="atoll-num">{atoll.number}</span>
                <span className={`hemi-badge ${atoll.hemisphere === "north" ? "hemi-n" : "hemi-s"}`}>
                  {atoll.badge}
                </span>
              </div>
              <div className="atoll-coord">{atoll.coord}</div>
              <h2 className="atoll-name">{atoll.name}</h2>
              <p className="atoll-italic">{atoll.italic}</p>
              <p className="atoll-body">{atoll.body}</p>
              <div className="truths">
                {atoll.truths.map((truth, i) => (
                  <TruthPoint key={i} text={truth.text} variant={truth.variant} />
                ))}
              </div>
              <div className="jcards">
                {atollJourneys.length > 0 && (
                  <div className="jcards-label">
                    <span className="jcards-label-step">Journeys</span>
                    <span className="jcards-label-arrow">›</span>
                    <span>Select</span>
                    <span className="jcards-label-arrow">›</span>
                    <span>Request</span>
                  </div>
                )}
                {atollJourneys.map((journey) => (
                  <JourneyCard key={journey.id} journey={journey} />
                ))}
              </div>
              <Link href={`/journeys?atoll=${atoll.id}`} className={`atoll-cta${atoll.hemisphere === "south" ? " gold" : ""}`}>
                {atoll.ctaLabel}
              </Link>
            </div>
            <AtollPhoto atoll={atoll} side={photoSide} />
          </div>
        </div>
      </section>
      {showDividerAfter && (
        <div className="eq-divider">
          <div className="eq-divider-inner">
            <div className="eq-divider-rule" />
            <div className="eq-divider-txt">Crossing the Equator · 0° 00′ 00″</div>
            <div className="eq-divider-rule" />
          </div>
        </div>
      )}
    </>
  );
}
