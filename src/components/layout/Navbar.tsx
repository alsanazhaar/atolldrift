"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// The AtollDrift compass logo — pure SVG, faithfully preserved
function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="37" stroke="#022830" strokeWidth="1" />
      <circle cx="40" cy="40" r="30" stroke="#022830" strokeWidth=".6" strokeDasharray="1.5,3" />
      <line x1="40" y1="3" x2="40" y2="7" stroke="#022830" strokeWidth=".8" />
      <line x1="40" y1="73" x2="40" y2="77" stroke="#022830" strokeWidth=".8" />
      <line x1="3" y1="40" x2="7" y2="40" stroke="#022830" strokeWidth=".8" />
      <line x1="73" y1="40" x2="77" y2="40" stroke="#022830" strokeWidth=".8" />
      <line x1="65.9" y1="14.1" x2="63.1" y2="16.9" stroke="#022830" strokeWidth=".5" />
      <line x1="14.1" y1="65.9" x2="16.9" y2="63.1" stroke="#022830" strokeWidth=".5" />
      <line x1="14.1" y1="14.1" x2="16.9" y2="16.9" stroke="#022830" strokeWidth=".5" />
      <line x1="65.9" y1="65.9" x2="63.1" y2="63.1" stroke="#022830" strokeWidth=".5" />
      <text x="40" y="12" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="5.5" fontWeight="700" fill="#022830" letterSpacing=".08em">N</text>
      <text x="40" y="72.5" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="5.5" fontWeight="700" fill="#022830" letterSpacing=".08em">S</text>
      <text x="72.5" y="41.8" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="5.5" fontWeight="700" fill="#022830" letterSpacing=".08em">E</text>
      <text x="7.5" y="41.8" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="5.5" fontWeight="700" fill="#022830" letterSpacing=".08em">W</text>
      <text x="46" y="16" fontFamily="Montserrat,sans-serif" fontSize="3.8" fill="#022830" opacity=".55" letterSpacing=".04em">00°10&apos;S</text>
      <text x="57" y="36" fontFamily="Montserrat,sans-serif" fontSize="3.8" fill="#022830" opacity=".55" letterSpacing=".04em">73°30&apos;E</text>
      {/* Atoll island ellipses around the ring */}
      {[0, 30, 55, 80, 105, 130, 155, 180, 205, 235, 265, 295, 325].map((deg, i) => (
        <ellipse
          key={i}
          cx="40" cy="13.5"
          rx={[4.5, 4.5, 5, 4, 3.5, 4.5, 5, 3.5, 3, 4, 4.5, 3.5, 3][i]}
          ry={[2, 2, 2, 1.8, 1.6, 2, 2, 1.8, 1.5, 1.8, 2, 1.6, 1.5][i]}
          fill="#0A7B8C"
          opacity={i >= 8 && i <= 9 ? ".6" : ".85"}
          transform={`rotate(${deg} 40 40)`}
        />
      ))}
      <line x1="40" y1="19" x2="40" y2="61" stroke="#022830" strokeWidth=".6" opacity=".4" />
      <line x1="19" y1="40" x2="61" y2="40" stroke="#022830" strokeWidth=".6" opacity=".4" />
      {/* 4-pointed gold compass star */}
      <path d="M40 27 L42.5 37.5 L40 40 L37.5 37.5 Z" fill="#C8960C" />
      <path d="M40 53 L42.5 42.5 L40 40 L37.5 42.5 Z" fill="#C8960C" />
      <path d="M27 40 L37.5 42.5 L40 40 L37.5 37.5 Z" fill="#C8960C" opacity=".85" />
      <path d="M53 40 L42.5 37.5 L40 40 L42.5 42.5 Z" fill="#C8960C" opacity=".85" />
      <circle cx="40" cy="40" r="2.2" fill="#C8960C" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`nav-wrapper${scrolled ? " scrolled" : ""}`}>
      <nav>
        <Link href="/" className="logo" onClick={closeMenu}>
          <LogoMark />
          <div className="logo-text">
            <span className="logo-name">AtollDrift</span>
            <span className="logo-tagline">Southern Maldives</span>
          </div>
        </Link>

        <div className="nav-right">
          {/* Desktop nav coords */}
          <div className="nav-coords">
            <Link href="/atolls/huvadhu" className="nav-coord" style={{ background: "none", border: "none" }}>
              0°30′N · Huvadhu
            </Link>
            <Link href="/atolls/fuvahmulah" className="nav-coord" style={{ background: "none", border: "none" }}>
              0°17′S · Fuvahmulah
            </Link>
            <Link href="/atolls/addu" className="nav-coord" style={{ background: "none", border: "none" }}>
              0°41′S · Addu
            </Link>
            <Link
              href="/experiences"
              className="nav-coord"
              style={{ color: "var(--tq-d)", fontWeight: 700, background: "none", border: "none" }}
            >
              Experiences
            </Link>
            <Link
              href="/stories"
              className="nav-coord"
              style={{ background: "none", border: "none" }}
            >
              Stories
            </Link>
            <Link
              href="/sustainability"
              className="nav-coord"
              style={{ background: "none", border: "none" }}
            >
              Sustainability
            </Link>
          </div>

          <Link
            href="/journeys"
            className="nav-cta"
            style={{
              textDecoration: "none",
              background: "var(--tq)",
              color: "var(--white)",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Plan My Journey
          </Link>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div ref={drawerRef} className={`nav-drawer${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <Link href="/atolls/huvadhu" onClick={closeMenu}>Huvadhu · 0°30′ N</Link>
        <Link href="/atolls/fuvahmulah" onClick={closeMenu}>Fuvahmulah · 0°17′ S</Link>
        <Link href="/atolls/addu" onClick={closeMenu}>Addu · 0°41′ S</Link>
        <Link href="/journeys" onClick={closeMenu} style={{ color: "var(--tq-d)", fontWeight: 600 }}>
          View All Journeys
        </Link>
        <Link href="/experiences" onClick={closeMenu}>
          Local Experiences
        </Link>
        <Link href="/stories" onClick={closeMenu}>
          Stories
        </Link>
        <Link href="/sustainability" onClick={closeMenu}>
          Sustainability
        </Link>
        <Link href="/journeys" onClick={closeMenu} style={{ fontWeight: 700 }}>
          Plan My Journey →
        </Link>
      </div>
    </div>
  );
}
