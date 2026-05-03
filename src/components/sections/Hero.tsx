"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

function HeroSlideshow() {
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    db.from("hero_images")
      .select("src, alt, sort_order")
      .eq("active", true)
      .order("sort_order")
      .then(({ data }) => { if (data?.length) setImages(data); });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        {images.map((img, i) => (
          <div key={img.src} style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${img.src})`,
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.4s ease-in-out",
          }} />
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.2) 0%, transparent 25%)", zIndex: 1 }} />
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: ".45rem", zIndex: 10 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} style={{
              width: i === current ? 20 : 6, height: 6, borderRadius: 3,
              background: i === current ? "#fff" : "rgba(255,255,255,.45)",
              border: "none", cursor: "pointer", padding: 0, transition: "all .35s ease",
            }} />
          ))}
        </div>
      )}
    </>
  );
}

function HeroBgMotif() {
  return (
    <svg className="hero-bg-motif" width="200" height="200" viewBox="0 0 220 220" fill="none">
      <rect x="5" y="5" width="210" height="210" stroke="white" strokeWidth="1" strokeDasharray="3,5" />
      <path d="M110 40 L121 72 L150 52 L135 82 L168 80 L145 103 L168 118 L136 120 L148 152 L121 136 L110 168 L99 136 L72 152 L84 120 L52 118 L75 103 L52 80 L85 82 L70 52 L99 72 Z" stroke="white" strokeWidth="0.8" fill="none" />
      <circle cx="110" cy="110" r="26" stroke="white" strokeWidth="0.7" fill="none" />
      <line x1="110" y1="84" x2="110" y2="136" stroke="white" strokeWidth="0.5" />
      <line x1="84" y1="110" x2="136" y2="110" stroke="white" strokeWidth="0.5" />
      <path d="M30 30 L38 22 L46 30 L38 38 Z" stroke="white" strokeWidth="0.7" fill="none" />
      <path d="M174 30 L182 22 L190 30 L182 38 Z" stroke="white" strokeWidth="0.7" fill="none" />
      <path d="M30 190 L38 182 L46 190 L38 198 Z" stroke="white" strokeWidth="0.7" fill="none" />
      <path d="M174 190 L182 182 L190 190 L182 198 Z" stroke="white" strokeWidth="0.7" fill="none" />
    </svg>
  );
}

function HeroAtollCard({ hemi, name, coord, href, atollId }: { hemi: string; name: string; coord: string; href: string; atollId: string }) {
  return (
    <Link href={href} className="ha" style={{ textDecoration: "none", position: "relative" }}
      onClick={(e) => { e.preventDefault(); document.querySelector(href.replace("/#", "#"))?.scrollIntoView({ behavior: "smooth" }); }}>
      <div className="ha-hemi">{hemi}</div>
      <div className="ha-name">{name}</div>
      <div className="ha-coord">{coord}</div>
      <div style={{ marginTop: ".35rem", fontSize: ".44rem", fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: "rgba(255,255,255,.6)" }}
        onClick={(e) => { e.stopPropagation(); window.location.href = `/atolls/${atollId}`; }}>
        Full guide →
      </div>
    </Link>
  );
}

export default function Hero() {
  return (
    <section className="hero" style={{ position: "relative" }}>
      <HeroSlideshow />
      <HeroBgMotif />
      <div className="inner" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-left hero-left-frost">
          <div className="hero-coord">Indian Ocean · 73°E · Southern Maldives</div>
          <h1>You may have been<br />to the Maldives.<br /><em>But have you seen it?</em></h1>
          <div className="hero-tagline">Have you <span className="seen">seen</span> the Maldives?</div>
          <div className="hero-brand-sub">Authentic Travel · Southern Maldives</div>
          <div className="eq-line">
            <div className="eq-rule" />
            <div className="eq-label">0° 00′ 00″ — The Equator</div>
            <div className="eq-rule" />
          </div>
          <p className="hero-body">
            The resort atolls are north of the equator.{" "}
            <strong>Fuvahmulah and Addu are south of it.</strong> Huvadhu straddles the line.
            AtollDrift takes small groups into the three southern atolls where the Maldives actually
            lives — built by hand, fished by knowledge, shaped by centuries no resort will show you.
          </p>
          <div className="hero-btns">
            <button className="btn-p" onClick={() => document.getElementById("sec-huvadhu")?.scrollIntoView({ behavior: "smooth" })}>
              Explore the Three Atolls
            </button>
            <button className="btn-g" onClick={() => document.getElementById("sec-departures")?.scrollIntoView({ behavior: "smooth" })}>
              View Departures
            </button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-atolls">
            <HeroAtollCard hemi="North of equator" name="Huvadhu" coord="0°30′N · 73°18′E" href="/#sec-huvadhu" atollId="huvadhu" />
            <HeroAtollCard hemi="South of equator" name="Fuvahmulah" coord="0°17′S · 73°25′E" href="/#sec-fuvahmulah" atollId="fuvahmulah" />
            <HeroAtollCard hemi="South of equator" name="Addu" coord="0°41′S · 73°09′E" href="/#sec-addu" atollId="addu" />
          </div>
        </div>
      </div>
    </section>
  );
}
