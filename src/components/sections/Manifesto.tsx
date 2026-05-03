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
      { threshold: 0.1 }
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

        <div className="m-body">

          {/* Main headline */}
          <h2 className="m-headline">
            The Maldives you have seen<br />
            is not the Maldives.
          </h2>

          {/* Short punchy lines — medium size, create rhythm */}
          <div className="m-lines">
            <p className="m-line">The overwater bungalow, the white sand, the infinity pool —</p>
            <p className="m-line">these are real, and they are beautiful.</p>
            <p className="m-line m-line-space">They are on a different set of islands<br />from the ones we work in.</p>
          </div>

          {/* Supporting paragraph — smaller, prose */}
          <p className="m-para">
            The southern atolls are where the fishermen live, where the boats
            are built, where the ocean is read by feel and not by app.
          </p>

          {/* Italic statement line */}
          <p className="m-statement">
            <em>We take small groups there.</em>
          </p>

          {/* Second prose block */}
          <p className="m-para m-para-top">
            Six to ten people. Local guesthouses. Meals with families
            who cook what they grow. Guides who grew up on the water
            they are showing you.
          </p>

          {/* Final statement */}
          <p className="m-statement m-statement-final">
            <em>This is the Maldives before it became a product.</em><br />
            <span>It is still there, if you know where to cross.</span>
          </p>

        </div>
      </div>
    </section>
  );
}
