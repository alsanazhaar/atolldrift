"use client";

import { useEffect, useRef } from "react";

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="manifesto" ref={ref}>
      <div className="inner">
        <div className="m-eq">
          <div className="m-eq-rule" />
          <div className="m-eq-txt">AtollDrift · Why We Exist</div>
          <div className="m-eq-rule" />
        </div>

        <h2>
          The Maldives you have seen is not the Maldives.
        </h2>

        <p>
          The overwater bungalow, the white sand, the infinity pool — these are real, and they
          are beautiful, and they are on a different set of islands from the ones we work in.
          The southern atolls are where the fishermen live, where the boats are built, where
          the ocean is read by feel and not by app.{" "}
          <em>We take small groups there.</em>
        </p>

        <p>
          Six to ten people. Local guesthouses. Meals with families who cook what they grow.
          Guides who grew up on the water they are showing you.{" "}
          <em>This is not adventure tourism.</em> It is the Maldives before it became a
          product — and it is still there, if you know where to cross.
        </p>
      </div>
    </section>
  );
}
