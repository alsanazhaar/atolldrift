"use client";

import { useState } from "react";

interface BookingFormProps {
  type: "journey" | "experience";
  itemId: string;
  defaultPrice?: number;
}

const inp: React.CSSProperties = {
  width: "100%",
  background: "var(--white)",
  border: "1.5px solid var(--off3)",
  padding: ".6rem .75rem",
  fontSize: ".85rem",
  color: "var(--text)",
  fontFamily: "inherit",
  outline: "none",
  marginBottom: ".7rem",
  borderRadius: "2px",
  transition: "border-color .15s",
};

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: ".54rem",
  fontWeight: 700,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "var(--muted2)",
  marginBottom: ".2rem",
};

function SuccessState() {
  return (
    <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: "var(--tq-xxl)", border: "1.5px solid var(--tq-xl)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1rem",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="var(--tq)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "1.2rem", color: "var(--ink)", fontWeight: 600, marginBottom: ".4rem",
      }}>
        Request received.
      </div>
      <p style={{ fontSize: ".75rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: "1rem" }}>
        We will contact you within <strong style={{ color: "var(--ink)" }}>24 hours</strong> to confirm your place and check availability for your dates.
      </p>
      <div style={{
        background: "var(--off)", border: "1px solid var(--off3)",
        padding: ".65rem .85rem", fontSize: ".68rem", color: "var(--muted)", lineHeight: 1.6,
      }}>
        No payment required now.<br />
        Payment is arranged only after confirmation.
      </div>
    </div>
  );
}

export default function BookingForm({ type, itemId, defaultPrice }: BookingFormProps) {
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [dateErr, setDateErr] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validateEmail = (v: string) => {
    if (!v) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
    return "";
  };

  const validateDates = () => {
    if (!arrivalDate || !departureDate) return "Both arrival and departure dates are required.";
    if (new Date(arrivalDate) >= new Date(departureDate)) return "Arrival must be before departure.";
    if (new Date(arrivalDate) < new Date()) return "Arrival date must be in the future.";
    return "";
  };

  const submit = async () => {
    const dErr = validateDates();
    const eErr = validateEmail(email);
    if (!name.trim()) { setErrMsg("Your name is required."); return; }
    if (dErr) { setDateErr(dErr); return; }
    if (eErr) { setEmailErr(eErr); return; }

    setStatus("loading");
    setErrMsg(""); setDateErr(""); setEmailErr("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          itemId,
          guestName: name.trim(),
          guestEmail: email.trim(),
          guestCount: parseInt(guests) || 2,
          preferredDate: arrivalDate,
          notes: `Arrival: ${arrivalDate} · Departure: ${departureDate} · Guests: ${guests}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") return <SuccessState />;

  return (
    <div>
      {/* Trust signal */}
      <div style={{
        background: "var(--tq-xxl)",
        border: "1.5px solid var(--tq-xl)",
        borderLeft: "3px solid var(--tq)",
        padding: ".65rem .85rem",
        marginBottom: "1.1rem",
        fontSize: ".65rem",
        color: "var(--tq-d)",
        fontWeight: 600,
        lineHeight: 1.6,
        letterSpacing: ".02em",
      }}>
        Small group journeys (6–10 people) · Flexible dates · We confirm availability within 24 hours
      </div>

      {/* Dates */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 .75rem" }}>
        <div>
          <label style={lbl}>Arrival date *</label>
          <input
            type="date"
            value={arrivalDate}
            onChange={e => { setArrivalDate(e.target.value); setDateErr(""); }}
            onFocus={e => (e.target.style.borderColor = "var(--tq)")}
            onBlur={e => (e.target.style.borderColor = "var(--off3)")}
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Departure date *</label>
          <input
            type="date"
            value={departureDate}
            onChange={e => { setDepartureDate(e.target.value); setDateErr(""); }}
            onFocus={e => (e.target.style.borderColor = "var(--tq)")}
            onBlur={e => (e.target.style.borderColor = "var(--off3)")}
            style={inp}
          />
        </div>
      </div>

      {dateErr && (
        <div style={{ fontSize: ".65rem", color: "var(--coral)", marginTop: "-.5rem", marginBottom: ".7rem" }}>
          {dateErr}
        </div>
      )}

      {/* Guests */}
      <label style={lbl}>Number of guests *</label>
      <input
        type="number"
        min="1"
        max="10"
        value={guests}
        onChange={e => setGuests(e.target.value)}
        onFocus={e => (e.target.style.borderColor = "var(--tq)")}
        onBlur={e => (e.target.style.borderColor = "var(--off3)")}
        style={inp}
      />

      {/* Name */}
      <label style={lbl}>Your name *</label>
      <input
        type="text"
        value={name}
        onChange={e => { setName(e.target.value); setErrMsg(""); }}
        onFocus={e => (e.target.style.borderColor = "var(--tq)")}
        onBlur={e => (e.target.style.borderColor = "var(--off3)")}
        placeholder="Full name"
        style={inp}
        autoComplete="name"
      />

      {/* Email */}
      <label style={lbl}>Email address *</label>
      <input
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setEmailErr(""); setErrMsg(""); }}
        onFocus={e => (e.target.style.borderColor = "var(--tq)")}
        onBlur={e => {
          (e.target.style.borderColor = "var(--off3)");
          const err = validateEmail(e.target.value);
          if (err && e.target.value) setEmailErr(err);
        }}
        placeholder="you@example.com"
        style={{ ...inp, borderColor: emailErr ? "var(--coral)" : "var(--off3)" }}
        autoComplete="email"
        inputMode="email"
      />
      {emailErr && (
        <div style={{ fontSize: ".65rem", color: "var(--coral)", marginTop: "-.5rem", marginBottom: ".7rem" }}>
          {emailErr}
        </div>
      )}

      {errMsg && (
        <div style={{ fontSize: ".7rem", color: "var(--coral)", marginBottom: ".65rem", padding: ".5rem .75rem", background: "#FDE8E0", borderRadius: "2px" }}>
          {errMsg}
        </div>
      )}

      <button onClick={submit} disabled={status === "loading"} className="req-btn">
        {status === "loading" ? "Sending..." : "Request a spot"}
      </button>

      <p className="req-note">No payment now · We confirm within 24 hours</p>
    </div>
  );
}
