import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: "var(--tq)", padding: "4rem 1.1rem 3.5rem", minHeight: "60dvh", display: "flex", alignItems: "center" }}>
          <div className="inner" style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: ".6rem",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.45)",
                marginBottom: "1rem",
              }}
            >
              0° 00′ 00″ · Lost at the Equator
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2rem, 6vw, 3.2rem)",
                color: "var(--white)",
                lineHeight: 1.1,
                marginBottom: ".75rem",
                fontWeight: 600,
              }}
            >
              The page drifted.
            </h1>
            <p
              style={{
                fontSize: ".88rem",
                color: "rgba(255,255,255,.75)",
                lineHeight: 1.8,
                maxWidth: 400,
                margin: "0 auto 2rem",
              }}
            >
              We couldn&apos;t find what you were looking for. The southern atolls are vast —
              perhaps we can help you find the right heading.
            </p>
            <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/" className="btn-p">Return to home</Link>
              <Link href="/journeys" className="btn-g">View journeys</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
