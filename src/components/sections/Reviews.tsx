const REVIEWS = [
  {
    text: "We have done a lot of travel. AtollDrift was genuinely different — the kind of trip where you come home changed rather than just rested. Huvadhu felt like a place that had not yet decided to become a destination.",
    author: "Sarah M.",
    location: "London",
    journey: "Huvadhu Deep — 10 Days",
  },
  {
    text: "The guide grew up on the water he was showing us. That changes everything. He was not reading from a script — he was sharing his home. The reef channel at Fuvahmulah is the most extraordinary thing I have ever seen underwater.",
    author: "James K.",
    location: "Melbourne",
    journey: "Island & Ocean — 8 Days",
  },
  {
    text: "I was sceptical of a small group trip. By day three I could not imagine doing it any other way. Six people, local guesthouses, meals cooked by families. The southern Maldives nobody talks about.",
    author: "Lena B.",
    location: "Amsterdam",
    journey: "Southern End — 9 Days",
  },
];

export default function Reviews() {
  return (
    <section style={{ background: "var(--off)", padding: "3.5rem 1.1rem 3rem", borderTop: "1px solid var(--off2)" }}>
      <div className="inner">

        {/* Label */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          marginBottom: "2.2rem",
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--off2)" }} />
          <div style={{
            fontSize: ".52rem", fontWeight: 700, letterSpacing: ".18em",
            textTransform: "uppercase", color: "var(--muted2)", whiteSpace: "nowrap",
          }}>
            From people who have been
          </div>
          <div style={{ flex: 1, height: 1, background: "var(--off2)" }} />
        </div>

        {/* Reviews grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{
              background: "var(--white)",
              border: "1.5px solid var(--off2)",
              borderTop: "2px solid var(--tq-xl)",
              padding: "1.4rem 1.3rem",
            }}>
              {/* Stars */}
              <div style={{ color: "var(--eq)", fontSize: ".75rem", marginBottom: ".75rem", letterSpacing: ".1em" }}>
                ★★★★★
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(.9rem, 1.8vw, 1rem)",
                color: "var(--ink)",
                lineHeight: 1.8,
                fontStyle: "italic",
                marginBottom: "1.1rem",
              }}>
                "{r.text}"
              </p>

              {/* Attribution */}
              <div style={{ borderTop: "1px solid var(--off2)", paddingTop: ".75rem" }}>
                <div style={{ fontWeight: 700, fontSize: ".78rem", color: "var(--ink)" }}>
                  {r.author}
                </div>
                <div style={{ fontSize: ".62rem", color: "var(--muted2)", marginTop: ".08rem" }}>
                  {r.location} · {r.journey}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <div style={{
          textAlign: "center", marginTop: "1.6rem",
          fontSize: ".62rem", color: "var(--muted2)", letterSpacing: ".04em",
        }}>
          All reviews are from verified AtollDrift travellers.
        </div>

      </div>
    </section>
  );
}
