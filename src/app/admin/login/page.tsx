"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/auth";

export default function AdminLoginPage() {
  const router      = useRouter();
  const params      = useSearchParams();
  const next        = params.get("next") || "/admin";
  const [email, setEmail]   = useState("");
  const [pw, setPw]         = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState("");

  const supabase = createBrowserSupabaseClient();

  // If already logged in, bounce straight to admin
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(next);
    });
  }, []);

  const login = async () => {
    if (!email || !pw) return setErr("Email and password are required.");
    setLoading(true);
    setErr("");

    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    router.replace(next);
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--tq-vd)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Montserrat, sans-serif",
    }}>
      {/* Subtle background motif */}
      <svg
        style={{ position: "fixed", right: -40, top: -40, opacity: .06, pointerEvents: "none" }}
        width="340" height="340" viewBox="0 0 220 220" fill="none"
      >
        <path d="M110 40 L121 72 L150 52 L135 82 L168 80 L145 103 L168 118 L136 120 L148 152 L121 136 L110 168 L99 136 L72 152 L84 120 L52 118 L75 103 L52 80 L85 82 L70 52 L99 72 Z"
          stroke="white" strokeWidth="1" fill="none" />
        <circle cx="110" cy="110" r="40" stroke="white" strokeWidth="0.8" fill="none" />
        <circle cx="110" cy="110" r="70" stroke="white" strokeWidth="0.5" strokeDasharray="2,4" fill="none" />
      </svg>

      <div style={{
        background: "var(--white)",
        padding: "2.5rem 2.2rem",
        width: "100%",
        maxWidth: 380,
        position: "relative",
      }}>
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: ".55rem", marginBottom: "1.8rem" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--tq-xxl)", display: "flex", alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="37" stroke="var(--tq-vd)" strokeWidth="1.5"/>
              <path d="M40 27 L42.5 37.5 L40 40 L37.5 37.5 Z" fill="var(--eq)"/>
              <path d="M40 53 L42.5 42.5 L40 40 L37.5 42.5 Z" fill="var(--eq)"/>
              <path d="M27 40 L37.5 42.5 L40 40 L37.5 37.5 Z" fill="var(--eq)" opacity=".85"/>
              <path d="M53 40 L42.5 37.5 L40 40 L42.5 42.5 Z" fill="var(--eq)" opacity=".85"/>
              <circle cx="40" cy="40" r="2.2" fill="var(--eq)"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.25rem", color: "var(--ink)", fontWeight: 600, lineHeight: 1 }}>
              AtollDrift
            </div>
            <div style={{ fontSize: ".42rem", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted2)", marginTop: ".15rem" }}>
              Admin Panel
            </div>
          </div>
        </div>

        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "var(--ink)", fontWeight: 600, marginBottom: ".25rem" }}>
          Sign in
        </div>
        <p style={{ fontSize: ".68rem", color: "var(--muted2)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
          Use the email and password set up in your Supabase dashboard.
        </p>

        <div>
          <label style={{
            display: "block", fontSize: ".55rem", fontWeight: 700,
            letterSpacing: ".12em", textTransform: "uppercase",
            color: "var(--muted2)", marginBottom: ".22rem",
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="you@example.com"
            autoFocus
            style={{
              width: "100%", background: "var(--off)", border: "1.5px solid var(--off3)",
              padding: ".6rem .75rem", fontSize: ".85rem", color: "var(--text)",
              fontFamily: "inherit", outline: "none", marginBottom: ".75rem",
            }}
          />

          <label style={{
            display: "block", fontSize: ".55rem", fontWeight: 700,
            letterSpacing: ".12em", textTransform: "uppercase",
            color: "var(--muted2)", marginBottom: ".22rem",
          }}>
            Password
          </label>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(""); }}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="••••••••"
            style={{
              width: "100%", background: "var(--off)", border: "1.5px solid var(--off3)",
              padding: ".6rem .75rem", fontSize: ".85rem", color: "var(--text)",
              fontFamily: "inherit", outline: "none",
              marginBottom: err ? ".5rem" : ".85rem",
            }}
          />

          {err && (
            <div style={{
              fontSize: ".68rem", color: "var(--coral)",
              marginBottom: ".75rem", lineHeight: 1.5,
            }}>
              {err}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            style={{
              width: "100%", background: loading ? "var(--tq-d)" : "var(--tq)",
              color: "var(--white)", border: "none", padding: ".68rem",
              fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em",
              textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "background .2s",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>

        <div style={{
          marginTop: "1.5rem", paddingTop: "1rem",
          borderTop: "1px solid var(--off2)",
          fontSize: ".6rem", color: "var(--muted2)", lineHeight: 1.7,
        }}>
          <strong style={{ color: "var(--ink)" }}>First time?</strong> Go to your Supabase dashboard →
          Authentication → Users → Add user. Enter your email and set a password.
          That account can then log in here.
        </div>
      </div>
    </div>
  );
}
