"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePageBanner } from "@/components/ui/TealBanner";

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const bgSrc = usePageBanner("manifesto");

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
    <section className="manifesto" ref={ref} style={{ position: "relative", overflow: "hidden" }}>

      {/* Background image — only rendered when uploaded in admin */}
      {bgSrc && (
        <>
          <Image
            src={bgSrc}
            alt="Manifesto background"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="100vw"
          />
          {/* Dark gradient overlay — no teal tint */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.45) 100%)",
            zIndex: 1,
          }} />
        </>
      )}

      <div className="inner" style={{ position: "relative", zIndex: 2 }}>
        <div className="m-eq">
          <div className="m-eq-rule" />
          <div className="m-eq-txt">AtollDrift · Why We Exist</div>
          <div className="m-eq-rule" />
        </div>

        <div className="m-body">
          <h2 className="m-headline">
            The Maldives you have seen<br />
            is not the Maldives.
          </h2>

          <div className="m-lines">
            <p className="m-line">The overwater bungalow, the white sand, the infinity pool —</p>
            <p className="m-line">these are real, and they are beautiful.</p>
            <p className="m-line m-line-space">They are on a different set of islands<br />from the ones we work in.</p>
          </div>

          <p className="m-para">
            The southern atolls are where the fishermen live, where the boats
            are built, where the ocean is read by feel and not by app.
          </p>

          <p className="m-statement">
            <em>We take small groups there.</em>
          </p>

          <p className="m-para m-para-top">
            Six to ten people. Local guesthouses. Meals with families
            who cook what they grow. Guides who grew up on the water
            they are showing you.
          </p>

          <p className="m-statement m-statement-final">
            <em>This is the Maldives before it became a product.</em><br />
            <span>It is still there, if you know where to cross.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
