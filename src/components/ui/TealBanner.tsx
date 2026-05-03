"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Fetch a page banner by page key ──────────────────────────────────
export function usePageBanner(page: string) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    db.from("page_banners")
      .select("src")
      .eq("page", page)
      .maybeSingle()
      .then(({ data }) => { if (data?.src) setSrc(data.src); });
  }, [page]);

  return src;
}

// ── TealBanner — drop-in background for any teal section ─────────────
// Usage: wrap your existing section content with this, passing the image src.
// If no src, section renders as plain teal (existing behaviour).
interface TealBannerProps {
  src: string | null;
}

export function TealBannerBg({ src }: TealBannerProps) {
  if (!src) return null;
  return (
    <>
      {/* Photo layer */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      {/* Strong bottom gradient — no teal tint, just darkness for text readability */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,.15) 0%, transparent 25%, rgba(0,0,0,.5) 65%, rgba(0,0,0,.8) 100%)",
          zIndex: 1,
        }}
      />
    </>
  );
}
