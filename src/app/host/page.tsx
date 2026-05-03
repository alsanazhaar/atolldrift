"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1
  fullName: string; atoll: string; island: string; yearsHere: string; contact: string;
  // Step 2
  category: string; xpTitle: string; xpDescription: string;
  // Step 3
  duration: string; groupSize: string; price: string; included: string;
  // Step 4
  notes: string; agreed: boolean;
}

const EMPTY: FormData = {
  fullName: "", atoll: "", island: "", yearsHere: "", contact: "",
  category: "", xpTitle: "", xpDescription: "",
  duration: "", groupSize: "", price: "", included: "",
  notes: "", agreed: false,
};

// ── Shared field styles ───────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: "100%", background: "var(--off)", border: "1.5px solid var(--off3)",
  padding: ".6rem .75rem", fontSize: ".85rem", color: "var(--text)",
  fontFamily: "inherit", outline: "none", borderRadius: "2px", marginBottom: "1rem",
};
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: ".58rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: ".28rem" }}>
      {children} {required && <span style={{ color: "var(--coral)" }}>*</span>}
    </label>
  );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function HostPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const next = () => setStep(s => Math.min(s + 1, 4) as Step);
  const prev = () => setStep(s => Math.max(s - 1, 1) as Step);

  const submit = async () => {
    if (!form.agreed) { setError("Please agree to the host terms to continue."); return; }
    if (!form.fullName || !form.atoll || !form.contact) {
      setError("Name, atoll and contact are required. Please go back and fill them in.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/host", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName, atoll: form.atoll, island: form.island,
          yearsHere: form.yearsHere, contact: form.contact,
          category: form.category, xpTitle: form.xpTitle,
          xpDescription: form.xpDescription, duration: form.duration,
          groupSize: form.groupSize,
          price: form.price ? parseInt(form.price) : undefined,
          included: form.included, notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const steps = [
    { label: "1 · About You" },
    { label: "2 · Your Experience" },
    { label: "3 · Logistics" },
    { label: "4 · Review" },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <div style={{ background: "var(--tq)", padding: "2.5rem 1.1rem 2rem" }}>
          <div className="inner">
            <Link href="/experiences" className="dp-back">← Back to experiences</Link>
            <div style={{ fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.65)", marginBottom: ".5rem" }}>
              For Locals · Southern Maldives
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 5vw, 2.4rem)", color: "var(--white)", lineHeight: 1.1, marginBottom: ".55rem", fontWeight: 600 }}>
              Share what you know.
            </h1>
            <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.82)", lineHeight: 1.8, maxWidth: 480 }}>
              You don&apos;t need a tourism certificate. We handle the guests and the payment. You keep 85%.
            </p>
          </div>
        </div>

        {/* Success state */}
        {submitted ? (
          <div style={{ padding: "3rem 1.1rem", maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--tq-xxl)", border: "1.5px solid var(--tq-xl)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--tq)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", color: "var(--ink)", fontWeight: 600, marginBottom: ".5rem" }}>
              Application received.
            </h2>
            <p style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: "1rem" }}>
              We review every application personally and will be in touch within <strong style={{ color: "var(--ink)" }}>3 working days</strong>.
              If it&apos;s a good fit, we&apos;ll arrange a call to meet you.
            </p>
            <Link href="/experiences" style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--tq-d)", textDecoration: "none" }}>
              ← Back to experiences
            </Link>
          </div>
        ) : (
          <>
            {/* Step tabs */}
            <div style={{ background: "var(--off2)", borderBottom: "1.5px solid var(--off3)", padding: ".65rem 1.1rem" }}>
              <div className="inner" style={{ display: "flex", gap: ".4rem" }}>
                {steps.map((s, i) => (
                  <button key={i} onClick={() => setStep((i + 1) as Step)} style={{
                    flex: 1, padding: ".45rem", fontSize: ".62rem", fontWeight: 700,
                    letterSpacing: ".07em", textTransform: "uppercase", cursor: "pointer",
                    border: "1.5px solid", fontFamily: "inherit",
                    borderColor: step === i + 1 ? "var(--tq)" : "var(--off3)",
                    background: step === i + 1 ? "var(--tq)" : "var(--white)",
                    color: step === i + 1 ? "var(--white)" : "var(--muted2)",
                    transition: "all .2s",
                  }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div style={{ background: "var(--white)", padding: "2rem 1.1rem 3rem" }}>
              <div style={{ maxWidth: 640, margin: "0 auto" }}>

                {step === 1 && (
                  <div>
                    <div style={{ marginBottom: ".85rem" }}><FieldLabel required>Full name</FieldLabel><input style={inp} value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Your name" /></div>
                    <div style={{ marginBottom: ".85rem" }}>
                      <FieldLabel required>Which atoll are you from?</FieldLabel>
                      <select style={inp} value={form.atoll} onChange={e => set("atoll", e.target.value)}>
                        <option value="">Select your atoll</option>
                        <option>Huvadhu (Gaafu Alif / Gaafu Dhaalu)</option>
                        <option>Fuvahmulah (Gnaviyani)</option>
                        <option>Addu (Seenu)</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: ".85rem" }}><FieldLabel>Which island?</FieldLabel><input style={inp} value={form.island} onChange={e => set("island", e.target.value)} placeholder="e.g. Thinadhoo" /></div>
                    <div style={{ marginBottom: ".85rem" }}>
                      <FieldLabel>How long have you lived here?</FieldLabel>
                      <select style={inp} value={form.yearsHere} onChange={e => set("yearsHere", e.target.value)}>
                        <option value="">Select</option>
                        <option>Born here, whole life</option>
                        <option>10+ years</option>
                        <option>5–10 years</option>
                        <option>1–5 years</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: ".85rem" }}><FieldLabel required>Contact (WhatsApp or email)</FieldLabel><input style={inp} value={form.contact} onChange={e => set("contact", e.target.value)} placeholder="+960 ... or email" /></div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div style={{ marginBottom: ".85rem" }}>
                      <FieldLabel>What do you offer?</FieldLabel>
                      <select style={inp} value={form.category} onChange={e => set("category", e.target.value)}>
                        <option value="">Select a category</option>
                        <option>Fishing / Ocean</option>
                        <option>Surfing</option>
                        <option>Cooking / Food</option>
                        <option>Craft / Art</option>
                        <option>Culture / History</option>
                        <option>Freediving / Diving</option>
                        <option>Something else</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: ".85rem" }}><FieldLabel>Give it a title</FieldLabel><input style={inp} value={form.xpTitle} onChange={e => set("xpTitle", e.target.value)} placeholder="e.g. Dawn fishing on the reef channel" /></div>
                    <div style={{ marginBottom: ".85rem" }}><FieldLabel>Describe it in your own words</FieldLabel><textarea rows={5} style={{ ...inp, resize: "vertical" }} value={form.xpDescription} onChange={e => set("xpDescription", e.target.value)} placeholder="What happens? What will guests experience?" /></div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div style={{ marginBottom: ".85rem" }}>
                      <FieldLabel>How long does it last?</FieldLabel>
                      <select style={inp} value={form.duration} onChange={e => set("duration", e.target.value)}>
                        <option value="">Select</option>
                        <option>1–2 hours</option>
                        <option>2–4 hours</option>
                        <option>Half day (4–6 hours)</option>
                        <option>Full day</option>
                        <option>Multiple days</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: ".85rem" }}>
                      <FieldLabel>How many guests can you take?</FieldLabel>
                      <select style={inp} value={form.groupSize} onChange={e => set("groupSize", e.target.value)}>
                        <option value="">Select</option>
                        <option>1–2</option>
                        <option>2–4</option>
                        <option>2–6</option>
                        <option>Up to 8</option>
                        <option>Up to 10</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: ".85rem" }}>
                      <FieldLabel>Price per person (USD)</FieldLabel>
                      <input type="number" style={inp} value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. 45" />
                      <div style={{ fontSize: ".62rem", color: "var(--muted2)", marginTop: "-.7rem", marginBottom: "1rem" }}>AtollDrift takes 15%. You keep 85%.</div>
                    </div>
                    <div style={{ marginBottom: ".85rem" }}><FieldLabel>What is included?</FieldLabel><textarea rows={3} style={{ ...inp, resize: "vertical" }} value={form.included} onChange={e => set("included", e.target.value)} placeholder="e.g. Equipment, transport, food, tea..." /></div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div style={{ background: "var(--tq-xxl)", border: "1.5px solid var(--tq-xl)", borderLeft: "3px solid var(--tq)", padding: "1.1rem", marginBottom: "1.5rem" }}>
                      <div style={{ fontSize: ".56rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".35rem" }}>What happens next</div>
                      <p style={{ fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.75, margin: 0 }}>
                        We review every application personally. If we think it&apos;s a good fit, we will contact you within 3 working days to arrange a call. We will not list anything we have not verified.
                      </p>
                    </div>
                    <div style={{ marginBottom: ".85rem" }}><FieldLabel>Anything else we should know?</FieldLabel><textarea rows={4} style={{ ...inp, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Questions, languages spoken, anything else..." /></div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: ".6rem", marginBottom: "1rem" }}>
                      <input type="checkbox" id="agree" checked={form.agreed} onChange={e => set("agreed", e.target.checked)} style={{ marginTop: ".15rem", flexShrink: 0 }} />
                      <label htmlFor="agree" style={{ fontSize: ".75rem", color: "var(--muted)", lineHeight: 1.6, cursor: "pointer" }}>
                        I understand that AtollDrift will review my application and contact me. I agree to the host terms.
                      </label>
                    </div>
                    {error && (
                      <div style={{ fontSize: ".72rem", color: "var(--coral)", marginBottom: ".75rem", padding: ".5rem .75rem", background: "#FDE8E0", borderRadius: "2px" }}>
                        {error}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", gap: ".75rem" }}>
                  {step > 1 && (
                    <button onClick={prev} style={{ background: "none", border: "1.5px solid var(--off3)", color: "var(--muted2)", padding: ".65rem 1.2rem", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", minHeight: 48 }}>
                      ← Previous
                    </button>
                  )}
                  {step < 4 ? (
                    <button onClick={next} className="full-btn" style={{ flex: 1, margin: 0 }}>
                      Continue →
                    </button>
                  ) : (
                    <button onClick={submit} disabled={submitting} className="full-btn" style={{ flex: 1, margin: 0, opacity: submitting ? 0.6 : 1 }}>
                      {submitting ? "Submitting…" : "Submit Application"}
                    </button>
                  )}
                </div>

              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
