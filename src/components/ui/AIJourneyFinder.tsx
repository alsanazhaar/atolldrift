"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "ai" | "user";
  text: string;
}

const CHIPS_INITIAL = [
  "I want to dive",
  "Best for surfers",
  "Cultural immersion",
  "I have 8 days",
];

export default function AIJourneyFinder() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<string[]>(CHIPS_INITIAL);
  const [inputVal, setInputVal] = useState("");
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Welcome message on open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "ai",
          text: "Welcome. I can help you find the right AtollDrift journey. Tell me what draws you — diving, surfing, culture, fishing, a specific atoll — or how many days you have. I will match you to something real.",
        },
      ]);
    }
  }, [open, messages.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg = text.trim();
    setInputVal("");
    setChips([]);
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setThinking(true);

    try {
      const response = await fetch("/api/journey-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
            { role: "user", content: userMsg },
          ],
        }),
      });

      const data = await response.json();
      const aiText = data.text ?? "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
      setChips(["Tell me more", "What local experiences?", "Start over"]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
      setChips(["Try again"]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      {/* Circle FAB */}
      <button
        className="ai-fab"
        onClick={() => setOpen(true)}
        aria-label="Find my journey"
        title="Find my journey"
      >
        <div className="ai-fab-pulse" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={`ai-backdrop${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={`ai-sheet${open ? " open" : ""}`}
        role="dialog"
        aria-label="Journey Finder"
        aria-modal="true"
      >
        {/* Header */}
        <div style={{ background: "var(--tq-vd)", padding: ".85rem 1.1rem", display: "flex", alignItems: "center", gap: ".7rem" }}>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,.7)", fontSize: ".68rem", cursor: "pointer", letterSpacing: ".06em", textTransform: "uppercase" }}
          >
            ✕ Close
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem", color: "var(--white)", fontWeight: 600 }}>
              Journey Finder
            </div>
            <div style={{ fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.55)" }}>
              AI · Southern Maldives
            </div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: thinking ? "var(--coral)" : "var(--eql)" }} />
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
                background: msg.role === "user" ? "var(--tq)" : "var(--off)",
                border: msg.role === "ai" ? "1px solid var(--off3)" : "none",
                color: msg.role === "user" ? "var(--white)" : "var(--text)",
                padding: ".65rem .85rem",
                borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
                fontSize: ".82rem",
                lineHeight: 1.7,
              }}
            >
              {msg.text}
            </div>
          ))}
          {thinking && (
            <div style={{ alignSelf: "flex-start", background: "var(--off)", border: "1px solid var(--off3)", padding: ".65rem .85rem", borderRadius: "2px 12px 12px 12px", fontSize: ".82rem", color: "var(--muted)" }}>
              <span style={{ letterSpacing: ".1em" }}>···</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chips */}
        {chips.length > 0 && (
          <div style={{ padding: "0 1.1rem .5rem", display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                style={{
                  background: "var(--white)",
                  border: "1.5px solid var(--tq-xl)",
                  color: "var(--tq-d)",
                  padding: ".28rem .75rem",
                  fontSize: ".65rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderRadius: "100px",
                  transition: "all .2s",
                  fontFamily: "inherit",
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div style={{ padding: ".6rem 1.1rem .9rem", borderTop: "1.5px solid var(--tq-xl)", display: "flex", gap: ".5rem" }}>
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(inputVal)}
            placeholder="Tell me what you're looking for…"
            disabled={thinking}
            style={{
              flex: 1,
              background: "var(--off)",
              border: "1.5px solid var(--off3)",
              padding: ".55rem .75rem",
              fontSize: ".82rem",
              color: "var(--text)",
              fontFamily: "inherit",
              outline: "none",
              borderRadius: "2px",
              transition: "border-color .2s",
            }}
          />
          <button
            onClick={() => sendMessage(inputVal)}
            disabled={thinking || !inputVal.trim()}
            style={{
              background: "var(--tq)",
              color: "var(--white)",
              border: "none",
              padding: ".55rem .85rem",
              fontSize: ".9rem",
              cursor: "pointer",
              borderRadius: "2px",
              opacity: thinking || !inputVal.trim() ? 0.5 : 1,
              transition: "opacity .2s",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
