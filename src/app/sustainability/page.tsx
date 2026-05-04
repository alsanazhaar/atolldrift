import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sustainability — AtollDrift",
  description: "How AtollDrift actually operates in the Maldives. Local guesthouses, small groups, and real communities.",
};

export default function SustainabilityPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ── */}
        <div style={{
          background: "#0d1f24",
          padding: "4rem 1.1rem 3rem",
          borderBottom: "1px solid var(--tq-vd)",
        }}>
          <div className="inner">
            <Link href="/" className="dp-back" style={{ marginBottom: "1.4rem", display: "inline-block" }}>← Home</Link>
            <div style={{
              fontSize: ".52rem", fontWeight: 700, letterSpacing: ".18em",
              textTransform: "uppercase", color: "rgba(255,255,255,.45)",
              marginBottom: ".6rem",
            }}>
              AtollDrift · How We Operate
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
              color: "var(--white)",
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-.02em",
              marginBottom: ".75rem",
            }}>
              Sustainability
            </h1>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
              color: "rgba(255,255,255,.7)",
              fontStyle: "italic",
              lineHeight: 1.6,
              maxWidth: 520,
            }}>
              How we actually operate in the Maldives.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "3.5rem 1.1rem 4rem", background: "var(--white)" }}>
          <div className="inner">
            <div style={{ maxWidth: 640 }}>

              {/* Intro */}
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)",
                color: "var(--ink)",
                lineHeight: 1.85,
                marginBottom: "2.8rem",
                fontStyle: "italic",
              }}>
                We are not going to tell you that travelling here has no impact. It does.
                Flying to the Maldives burns fuel. Arriving on an island changes it slightly.
                What we can tell you is how we try to make sure the impact is worth it — for the places, not just for the people visiting them.
              </p>

              {/* Section 1 */}
              <div style={{ marginBottom: "3rem" }}>
                <div className="dp-slabel" style={{ marginBottom: "1rem" }}>Where the money goes</div>
                <p className="dp-desc">
                  The way most Maldives tourism works: money lands at a resort, stays there, and leaves when the guests do. The island it sits on might as well not exist. The people who have lived there for generations are largely invisible to the experience being sold.
                </p>
                <p className="dp-desc" style={{ marginTop: "1rem" }}>
                  AtollDrift works differently, though not because of any policy — because of the structure of the trip itself. We stay in local guesthouses, which are owned and run by island families. We eat food prepared by people who live there. Our guides are from the atolls they are guiding in. Some of them grew up on the water they are showing you.
                </p>
                <p className="dp-desc" style={{ marginTop: "1rem" }}>
                  This means a meaningful portion of what you spend stays on the island. Not all of it — flights, logistics, and coordination have their costs — but substantially more than a resort model returns to the community it occupies.
                </p>
                <div style={{ borderLeft: "2px solid var(--tq-xl)", paddingLeft: "1.1rem", marginTop: "1.4rem" }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "1rem", fontStyle: "italic",
                    color: "var(--ink)", lineHeight: 1.75,
                  }}>
                    We do not claim that staying in a guesthouse makes travel ethical. We claim it makes travel more honest about where it actually is.
                  </p>
                </div>
              </div>

              <div style={{ height: 1, background: "var(--off2)", marginBottom: "3rem" }} />

              {/* Section 2 */}
              <div style={{ marginBottom: "3rem" }}>
                <div className="dp-slabel" style={{ marginBottom: "1rem" }}>Small groups and what that means</div>
                <p className="dp-desc">
                  We run groups of six to ten people. This is not a marketing decision — it is the only size that works in the places we go. Local guesthouses cannot accommodate fifty people. The reefs we dive are not managed for mass tourism. The fishing communities we visit have their own rhythms, and a large group interrupts them in ways a small one does not.
                </p>
                <p className="dp-desc" style={{ marginTop: "1rem" }}>
                  Small groups also mean we do not need infrastructure. No resort platforms built over the reef. No helicopter transfers. No buffet operations. We move through these places closer to the way a careful traveller would move through them — by boat, on foot, in the water.
                </p>
                <p className="dp-desc" style={{ marginTop: "1rem" }}>
                  We are honest about reef travel. Snorkelling and diving disturb marine environments when done badly. We brief guests on behaviour before every water entry. We do not anchor on coral. We do not feed fish. We do not touch anything. These are not rules we invented — they are what the guides ask for, because they dive the same reefs all year.
                </p>
              </div>

              <div style={{ height: 1, background: "var(--off2)", marginBottom: "3rem" }} />

              {/* Section 3 */}
              <div style={{ marginBottom: "3rem" }}>
                <div className="dp-slabel" style={{ marginBottom: "1rem" }}>Inhabited islands, not staged ones</div>
                <p className="dp-desc">
                  The southern atolls are not tourism destinations. They are places where people live — fishing, building boats, running schools, arguing about politics, cooking for their families. We bring small groups into that world without pretending it was built for visitors.
                </p>
                <p className="dp-desc" style={{ marginTop: "1rem" }}>
                  This requires some care. We do not organise performances. We do not arrange for guests to watch cultural demonstrations on a schedule. What we do is create conditions where genuine interaction is possible — a morning on a fishing boat, a meal with a guesthouse family, a conversation with a boat builder who has been doing it for forty years.
                </p>
                <p className="dp-desc" style={{ marginTop: "1rem" }}>
                  Whether that interaction happens well depends on the guests as much as the hosts. We are clear about that in our briefings. These are real places. The people in them are not characters in someone else's holiday.
                </p>
              </div>

              <div style={{ height: 1, background: "var(--off2)", marginBottom: "3rem" }} />

              {/* Section 4 */}
              <div style={{ marginBottom: "3rem" }}>
                <div className="dp-slabel" style={{ marginBottom: "1rem" }}>What we do not claim</div>
                <p className="dp-desc">
                  We are not carbon neutral. We have not offset anything. We think carbon offsetting as a retail product is largely a way to feel better about flying rather than a genuine mechanism for reducing harm, and we would rather be honest about that than sell you a certificate.
                </p>
                <p className="dp-desc" style={{ marginTop: "1rem" }}>
                  We do not claim our presence is good for the Maldives. We believe it is better than the alternative — which is not that people stop visiting, but that they visit differently, through models that extract more and return less. We operate on the assumption that if travel to these places is going to happen, it should happen in a way that the places themselves can absorb and benefit from.
                </p>
                <p className="dp-desc" style={{ marginTop: "1rem" }}>
                  That is the honest version. We think it is a better argument than the other kind.
                </p>
              </div>

              {/* CTA */}
              <div style={{ paddingTop: "2rem", borderTop: "1px solid var(--off2)" }}>
                <Link href="/journeys" style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "1.05rem", color: "var(--tq-d)",
                  textDecoration: "none", fontWeight: 600,
                  borderBottom: "1.5px solid var(--tq-xl)", paddingBottom: ".1rem",
                }}>
                  See the journeys →
                </Link>
                <p style={{
                  fontSize: ".62rem", color: "var(--muted2)",
                  marginTop: ".65rem", lineHeight: 1.6,
                }}>
                  Small groups · Local guesthouses · Southern Maldives
                </p>
              </div>

            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
