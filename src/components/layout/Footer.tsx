import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="inner">
        <div className="fl">
          AtollDrift<span> ·</span>
        </div>
        <div
          style={{
            fontFamily: "Montserrat,sans-serif",
            fontSize: ".5rem",
            fontWeight: 600,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--eq)",
            marginBottom: ".7rem",
          }}
        >
          Have You Seen The Maldives?
        </div>
        <p className="fd">
          Group journeys and local experiences across Huvadhu, Fuvahmulah, and Addu.
        </p>

        <div className="f-cols">
          <div>
            <div className="fh">Atolls</div>
            <ul className="flinks">
              <li><Link href="/atolls/huvadhu">Huvadhu · 0°30′N</Link></li>
              <li><Link href="/atolls/fuvahmulah">Fuvahmulah · 0°17′S</Link></li>
              <li><Link href="/atolls/addu">Addu · 0°41′S</Link></li>
            </ul>
          </div>
          <div>
            <div className="fh">Journeys</div>
            <ul className="flinks">
              <li><Link href="/journeys">All Journeys</Link></li>
              <li><Link href="/journeys/huvadhu-deep">Huvadhu Deep</Link></li>
              <li><Link href="/journeys/fuva-channel">Island &amp; Ocean</Link></li>
              <li><Link href="/journeys/addu-south">Southern End</Link></li>
            </ul>
          </div>
          <div>
            <div className="fh">Experiences</div>
            <ul className="flinks">
              <li><Link href="/experiences">Browse All</Link></li>
              <li><Link href="/stories">Stories</Link></li>
            </ul>
          </div>
          <div>
            <div className="fh">AtollDrift</div>
            <ul className="flinks">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* ── Host CTA ── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.08)",
            borderBottom: "1px solid rgba(255,255,255,.08)",
            padding: "1.4rem 0",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <div
              style={{
                fontSize: ".48rem",
                fontWeight: 700,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: "var(--eq)",
                marginBottom: ".35rem",
              }}
            >
              For locals · Huvadhu · Fuvahmulah · Addu
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.1rem",
                color: "var(--white)",
                fontWeight: 600,
                lineHeight: 1.2,
                marginBottom: ".4rem",
              }}
            >
              Do you have something worth sharing?
            </div>
            <p
              style={{
                fontSize: ".65rem",
                color: "rgba(255,255,255,.5)",
                lineHeight: 1.7,
                maxWidth: 420,
                margin: 0,
              }}
            >
              If you fish, cook, surf, carve, or know these atolls in a way visitors never will —
              list it here. We handle the guests and the payment. You keep 85%.
            </p>
          </div>
          <Link
            href="/host"
            style={{
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,.25)",
              color: "rgba(255,255,255,.85)",
              padding: ".55rem 1.2rem",
              fontSize: ".65rem",
              fontWeight: 700,
              letterSpacing: ".09em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-block",
              transition: "all .2s",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            List My Experience →
          </Link>
        </div>

        <div className="fb">
          © {currentYear} AtollDrift · Southern Maldives · 0°00′00″ — The Equator
        </div>
      </div>
    </footer>
  );
}

