"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Slide {
  src: string;
  alt: string;
}

interface AtollHeroSlideshowProps {
  slides: Slide[];
}

export default function AtollHeroSlideshow({ slides }: AtollHeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setCurrent(i => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <>
      {/* Slides */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === current ? 1 : 0,
              transition: "opacity 1.4s ease-in-out",
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Dot indicators — only show if more than one slide */}
      {slides.length > 1 && (
        <div style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          display: "flex",
          gap: ".4rem",
          zIndex: 10,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? "#fff" : "rgba(255,255,255,.45)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all .35s ease",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
