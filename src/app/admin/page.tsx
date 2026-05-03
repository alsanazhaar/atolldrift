"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/auth";

// ── Types ─────────────────────────────────────────────────────────────
type Section = "journeys" | "experiences" | "atolls" | "hero" | "banners" | "stories" | "reviews" | "bookings" | "hosts";

interface Toast { msg: string; type: "ok" | "err" }

// ── Shared UI ─────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: "100%", background: "var(--off)", border: "1.5px solid var(--off3)",
  padding: ".55rem .75rem", fontSize: ".85rem", color: "var(--text)",
  fontFamily: "inherit", outline: "none", borderRadius: "2px", marginBottom: ".75rem",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: ".55rem", fontWeight: 700, letterSpacing: ".12em",
  textTransform: "uppercase", color: "var(--muted2)", marginBottom: ".22rem",
};
const btn = (color = "var(--tq)"): React.CSSProperties => ({
  background: color, color: "var(--white)", border: "none", padding: ".45rem 1rem",
  fontSize: ".68rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase",
  cursor: "pointer", fontFamily: "inherit", borderRadius: "2px",
});
const ghostBtn: React.CSSProperties = {
  background: "none", border: "1.5px solid var(--off3)", color: "var(--muted2)",
  padding: ".4rem .85rem", fontSize: ".65rem", fontWeight: 700, letterSpacing: ".07em",
  textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", borderRadius: "2px",
};
const badge = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-block", background: bg, color, fontSize: ".52rem", fontWeight: 700,
  letterSpacing: ".1em", textTransform: "uppercase", padding: ".12rem .45rem", borderRadius: "2px",
});
const card: React.CSSProperties = {
  background: "var(--white)", border: "1.5px solid var(--tq-xl)",
  borderLeft: "3px solid var(--tq)", padding: "1rem 1.1rem", marginBottom: ".55rem",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={lbl}>{label}</label>{children}</div>;
}

function ToastBar({ toast }: { toast: Toast | null }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)",
      background: toast.type === "ok" ? "var(--tq-vd)" : "var(--coral)",
      color: "var(--white)", padding: ".65rem 1.4rem", fontSize: ".78rem", fontWeight: 600,
      borderRadius: "2px", zIndex: 999, boxShadow: "0 4px 16px rgba(0,0,0,.2)",
    }}>
      {toast.msg}
    </div>
  );
}

// ── JOURNEYS SECTION ──────────────────────────────────────────────────
function JourneysSection({ toast }: { toast: (t: Toast) => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [form, setForm] = useState({
    id: "", atoll_id: "huvadhu", title: "", price: "", duration: "", group_size: "",
    tagline: "", description: "", hemisphere: "north", coord: "", gold_accent: false,
    banner_src: "",
  });
  const supabase = createBrowserSupabaseClient();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("journeys").select("*").order("atoll_id");
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => setForm({
    id: "", atoll_id: "huvadhu", title: "", price: "", duration: "", group_size: "",
    tagline: "", description: "", hemisphere: "north", coord: "", gold_accent: false,
    banner_src: "",
  });

  const startEdit = (row: any) => {
    setEditing(row);
    setForm({ ...row, price: String(row.price) });
    setAdding(true);
  };

  const uploadBanner = async (file: File) => {
    if (!form.id) return toast({ msg: "Set a Journey ID before uploading an image", type: "err" });
    setUploadingBanner(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `banners/journeys/${form.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("atoll-photos").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) { toast({ msg: upErr.message, type: "err" }); return; }
      const { data: { publicUrl } } = supabase.storage.from("atoll-photos").getPublicUrl(path);
      set("banner_src", publicUrl);
      toast({ msg: "Image uploaded", type: "ok" });
    } finally { setUploadingBanner(false); }
  };

  const save = async () => {
    const payload = { ...form, price: parseInt(form.price) || 0 };
    if (!payload.id || !payload.title) return toast({ msg: "ID and title are required", type: "err" });
    const { error } = editing
      ? await supabase.from("journeys").update(payload).eq("id", editing.id)
      : await supabase.from("journeys").insert(payload);
    if (error) return toast({ msg: error.message, type: "err" });
    toast({ msg: editing ? "Journey updated" : "Journey added", type: "ok" });
    setAdding(false); setEditing(null); resetForm(); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this journey and all its data?")) return;
    const { error } = await supabase.from("journeys").delete().eq("id", id);
    if (error) return toast({ msg: error.message, type: "err" });
    toast({ msg: "Journey deleted", type: "ok" }); load();
  };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
        <div style={{ fontSize: ".58rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted2)" }}>
          {rows.length} journeys
        </div>
        <button style={btn()} onClick={() => { resetForm(); setEditing(null); setAdding(true); }}>
          + Add Journey
        </button>
      </div>

      {adding && (
        <div style={{ background: "var(--off)", border: "1.5px solid var(--tq-xl)", padding: "1.4rem", marginBottom: "1.2rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "var(--ink)", marginBottom: "1rem", fontWeight: 600 }}>
            {editing ? "Edit Journey" : "New Journey"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <Field label="Journey ID (no spaces, e.g. huvadhu-culture)">
              <input style={inp} value={form.id} onChange={e => set("id", e.target.value)} disabled={!!editing} placeholder="huvadhu-culture" />
            </Field>
            <Field label="Atoll">
              <select style={inp} value={form.atoll_id} onChange={e => set("atoll_id", e.target.value)}>
                <option value="huvadhu">Huvadhu</option>
                <option value="fuvahmulah">Fuvahmulah</option>
                <option value="addu">Addu</option>
              </select>
            </Field>
            <Field label="Title">
              <input style={inp} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Culture & Craft — 8 Days" />
            </Field>
            <Field label="Price (USD)">
              <input style={inp} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="1650" />
            </Field>
            <Field label="Duration">
              <input style={inp} value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="8 days" />
            </Field>
            <Field label="Group Size">
              <input style={inp} value={form.group_size} onChange={e => set("group_size", e.target.value)} placeholder="6–10 people" />
            </Field>
            <Field label="Hemisphere">
              <select style={inp} value={form.hemisphere} onChange={e => set("hemisphere", e.target.value)}>
                <option value="north">North</option>
                <option value="south">South</option>
              </select>
            </Field>
            <Field label="Coordinates">
              <input style={inp} value={form.coord} onChange={e => set("coord", e.target.value)} placeholder="0°30'N · 73°18'E" />
            </Field>
          </div>
          <Field label="Tagline (one sentence)">
            <input style={inp} value={form.tagline} onChange={e => set("tagline", e.target.value)} placeholder="Short compelling tagline" />
          </Field>
          <Field label="Description (full paragraph)">
            <textarea style={{ ...inp, minHeight: 90, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} />
          </Field>

          {/* Banner image */}
          <Field label="Banner / card image">
            <div style={{ display: "flex", alignItems: "flex-start", gap: ".85rem", flexWrap: "wrap" }}>
              {form.banner_src && (
                <div style={{ width: 140, aspectRatio: "16/9", borderRadius: "2px", overflow: "hidden", background: "var(--tq-vd)", flexShrink: 0 }}>
                  <img src={form.banner_src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
                <label style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", cursor: uploadingBanner ? "not-allowed" : "pointer" }}>
                  {uploadingBanner ? "Uploading…" : form.banner_src ? "Replace image" : "Upload image"}
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadBanner(f); e.target.value = ""; }}
                    disabled={uploadingBanner} />
                </label>
                {form.banner_src && (
                  <button style={{ ...ghostBtn, fontSize: ".58rem", color: "var(--muted2)" }} onClick={() => set("banner_src", "")}>Remove</button>
                )}
                <div style={{ fontSize: ".58rem", color: "var(--muted2)", lineHeight: 1.5 }}>
                  Shown on journey cards across the site.<br />Landscape, min 800px wide.
                </div>
              </div>
            </div>
          </Field>

          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".75rem" }}>
            <input type="checkbox" id="gold" checked={form.gold_accent} onChange={e => set("gold_accent", e.target.checked)} />
            <label htmlFor="gold" style={{ ...lbl, margin: 0 }}>Gold accent (for southern hemisphere journeys)</label>
          </div>
          <div style={{ display: "flex", gap: ".6rem" }}>
            <button style={btn()} onClick={save}>{editing ? "Save Changes" : "Add Journey"}</button>
            <button style={ghostBtn} onClick={() => { setAdding(false); setEditing(null); resetForm(); }}>Cancel</button>
          </div>
        </div>
      )}

      {rows.map(row => (
        <div key={row.id} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem" }}>
            <div style={{ display: "flex", gap: ".85rem", flex: 1, minWidth: 0 }}>
              {row.banner_src && (
                <div style={{ width: 72, aspectRatio: "16/9", borderRadius: "2px", overflow: "hidden", background: "var(--tq-vd)", flexShrink: 0 }}>
                  <img src={row.banner_src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              )}
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "var(--ink)", fontWeight: 600 }}>{row.title}</div>
                <div style={{ fontSize: ".6rem", color: "var(--muted2)", marginTop: ".12rem" }}>
                  {row.id} · {row.atoll_id} · ${row.price.toLocaleString()} · {row.duration}
                  {!row.banner_src && <span style={{ color: "var(--coral)", marginLeft: ".4rem" }}>· no image</span>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: ".4rem", flexShrink: 0 }}>
              <button style={ghostBtn} onClick={() => startEdit(row)}>Edit</button>
              <button style={{ ...ghostBtn, color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => del(row.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── EXPERIENCES SECTION ───────────────────────────────────────────────
function ExperiencesSection({ toast }: { toast: (t: Toast) => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    id: "", category: "ocean", cat_label: "Ocean", cat_class: "cat-ocean",
    atoll: "Huvadhu", title: "", host_name: "", host_initial: "", host_location: "",
    duration: "", group_size: "", price: "", price_label: "per person",
    rating: "5.0", rating_count: "0", description: "",
  });
  const supabase = createBrowserSupabaseClient();

  const CATS: Record<string, { label: string; cls: string }> = {
    ocean: { label: "Ocean", cls: "cat-ocean" },
    surf: { label: "Surf", cls: "cat-surf" },
    food: { label: "Food", cls: "cat-cook" },
    craft: { label: "Craft", cls: "cat-craft" },
    culture: { label: "Culture", cls: "cat-culture" },
    freedive: { label: "Freedive", cls: "cat-free" },
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("experiences").select("*").order("atoll");
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const resetForm = () => setForm({
    id: "", category: "ocean", cat_label: "Ocean", cat_class: "cat-ocean",
    atoll: "Huvadhu", title: "", host_name: "", host_initial: "", host_location: "",
    duration: "", group_size: "", price: "", price_label: "per person",
    rating: "5.0", rating_count: "0", description: "",
  });

  const startEdit = (row: any) => {
    setEditing(row);
    setForm({ ...row, price: String(row.price), rating: String(row.rating), rating_count: String(row.rating_count) });
    setAdding(true);
  };

  const save = async () => {
    const payload = {
      ...form, price: parseInt(form.price) || 0,
      rating: parseFloat(form.rating) || 5.0,
      rating_count: parseInt(form.rating_count) || 0,
      cat_label: CATS[form.category]?.label ?? form.cat_label,
      cat_class: CATS[form.category]?.cls ?? form.cat_class,
    };
    if (!payload.id || !payload.title) return toast({ msg: "ID and title required", type: "err" });
    const { error } = editing
      ? await supabase.from("experiences").update(payload).eq("id", editing.id)
      : await supabase.from("experiences").insert(payload);
    if (error) return toast({ msg: error.message, type: "err" });
    toast({ msg: editing ? "Experience updated" : "Experience added", type: "ok" });
    setAdding(false); setEditing(null); resetForm(); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    await supabase.from("experiences").delete().eq("id", id);
    toast({ msg: "Experience deleted", type: "ok" }); load();
  };

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
        <div style={{ fontSize: ".58rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted2)" }}>
          {rows.length} experiences
        </div>
        <button style={btn()} onClick={() => { resetForm(); setEditing(null); setAdding(true); }}>+ Add Experience</button>
      </div>

      {adding && (
        <div style={{ background: "var(--off)", border: "1.5px solid var(--tq-xl)", padding: "1.4rem", marginBottom: "1.2rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "var(--ink)", marginBottom: "1rem", fontWeight: 600 }}>
            {editing ? "Edit Experience" : "New Experience"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <Field label="Experience ID (no spaces)">
              <input style={inp} value={form.id} onChange={e => set("id", e.target.value)} disabled={!!editing} placeholder="dawn-fishing-huva" />
            </Field>
            <Field label="Category">
              <select style={inp} value={form.category} onChange={e => set("category", e.target.value)}>
                {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </Field>
            <Field label="Atoll (display name)">
              <select style={inp} value={form.atoll} onChange={e => set("atoll", e.target.value)}>
                <option>Huvadhu</option>
                <option>Fuvahmulah</option>
                <option>Addu</option>
              </select>
            </Field>
            <Field label="Title">
              <input style={inp} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Dawn fishing with Ahmed" />
            </Field>
            <Field label="Host Name">
              <input style={inp} value={form.host_name} onChange={e => {
                set("host_name", e.target.value);
                set("host_initial", e.target.value.charAt(0).toUpperCase());
              }} placeholder="Ahmed Rasheed" />
            </Field>
            <Field label="Host Location">
              <input style={inp} value={form.host_location} onChange={e => set("host_location", e.target.value)} placeholder="Thinadhoo, Huvadhu" />
            </Field>
            <Field label="Duration">
              <input style={inp} value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="4 hours" />
            </Field>
            <Field label="Group Size">
              <input style={inp} value={form.group_size} onChange={e => set("group_size", e.target.value)} placeholder="2–5" />
            </Field>
            <Field label="Price (USD)">
              <input style={inp} type="number" value={form.price} onChange={e => set("price", e.target.value)} />
            </Field>
            <Field label="Rating (0–5)">
              <input style={inp} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set("rating", e.target.value)} />
            </Field>
          </div>
          <Field label="Description">
            <textarea style={{ ...inp, minHeight: 90, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} />
          </Field>
          <div style={{ display: "flex", gap: ".6rem" }}>
            <button style={btn()} onClick={save}>{editing ? "Save Changes" : "Add Experience"}</button>
            <button style={ghostBtn} onClick={() => { setAdding(false); setEditing(null); resetForm(); }}>Cancel</button>
          </div>
        </div>
      )}

      {rows.map(row => (
        <div key={row.id} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem" }}>
            <div>
              <div style={{ fontSize: ".88rem", color: "var(--ink)", fontWeight: 600 }}>{row.title}</div>
              <div style={{ fontSize: ".62rem", color: "var(--muted2)", marginTop: ".1rem" }}>
                {row.host_name} · {row.atoll} · ${row.price} · {row.duration} · ★ {row.rating}
              </div>
            </div>
            <div style={{ display: "flex", gap: ".4rem", flexShrink: 0 }}>
              <button style={ghostBtn} onClick={() => startEdit(row)}>Edit</button>
              <button style={{ ...ghostBtn, color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => del(row.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ATOLLS SECTION ────────────────────────────────────────────────────
function AtollsSection({ toast }: { toast: (t: Toast) => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", coord: "", italic: "", body: "", why_this_atoll: "", is_active: true,
  });
  const supabase = createBrowserSupabaseClient();

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: atollData }, { data: photoData }] = await Promise.all([
      supabase.from("atolls").select("*").order("sort_order"),
      supabase.from("atoll_photos").select("*"),
    ]);
    setRows(atollData ?? []);
    setPhotos(photoData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (row: any) => {
    setEditing(row);
    setForm({
      name: row.name ?? "",
      coord: row.coord ?? "",
      italic: row.italic ?? "",
      body: row.body ?? "",
      why_this_atoll: row.why_this_atoll ?? "",
      is_active: row.is_active ?? true,
    });
  };

  const save = async () => {
    const { error } = await supabase.from("atolls").update({
      name: form.name,
      coord: form.coord,
      italic: form.italic,
      body: form.body,
      why_this_atoll: form.why_this_atoll,
      is_active: form.is_active,
    }).eq("id", editing.id);
    if (error) return toast({ msg: error.message, type: "err" });
    toast({ msg: "Atoll updated", type: "ok" });
    setEditing(null); load();
  };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const uploadPhoto = async (atollId: string, slot: "main" | "strip1" | "strip2", file: File) => {
    const slotKey = `${atollId}-${slot}`;
    setUploadingSlot(slotKey);
    try {
      const ext = file.name.split(".").pop();
      const path = `${atollId}/${slot}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("atoll-photos")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) { toast({ msg: `Upload failed: ${upErr.message}`, type: "err" }); return; }
      const { data: { publicUrl } } = supabase.storage.from("atoll-photos").getPublicUrl(path);
      const srcCol = slot === "main" ? "main_src" : slot === "strip1" ? "strip1_src" : "strip2_src";
      const existing = photos.find(p => p.atoll_id === atollId);
      if (existing) {
        await supabase.from("atoll_photos").update({ [srcCol]: publicUrl }).eq("atoll_id", atollId);
      } else {
        await supabase.from("atoll_photos").insert({
          atoll_id: atollId, [srcCol]: publicUrl,
          main_src: "", main_alt: "", main_title: "", main_sub: "",
          strip1_src: "", strip1_alt: "", strip1_label: "",
          strip2_src: "", strip2_alt: "", strip2_label: "",
        });
      }
      toast({ msg: `${slot} photo updated`, type: "ok" });
      load();
    } finally { setUploadingSlot(null); }
  };

  const handleFileInput = (atollId: string, slot: "main" | "strip1" | "strip2") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadPhoto(atollId, slot, file);
      e.target.value = "";
    };

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading…</div>;

  return (
    <div>
      <div style={{ fontSize: ".62rem", color: "var(--muted)", marginBottom: "1.2rem", lineHeight: 1.7 }}>
        Edit atoll content, upload photos, and toggle visibility. Changes appear on the site immediately.
      </div>
      {rows.map(row => {
        const photo = photos.find(p => p.atoll_id === row.id);
        return (
          <div key={row.id} style={{ ...card, borderLeftColor: row.hemisphere === "south" ? "var(--eq)" : "var(--tq)", marginBottom: "1.4rem", opacity: row.is_active === false ? 0.6 : 1 }}>

            {/* Header row */}
            {editing?.id === row.id ? (
              <div style={{ marginBottom: "1.2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                  <Field label="Name">
                    <input style={inp} value={form.name} onChange={e => set("name", e.target.value)} />
                  </Field>
                  <Field label="Coordinates">
                    <input style={inp} value={form.coord} onChange={e => set("coord", e.target.value)} />
                  </Field>
                </div>
                <Field label="Hero tagline (italic)">
                  <input style={inp} value={form.italic} onChange={e => set("italic", e.target.value)} placeholder="One sentence that captures the atoll" />
                </Field>
                <Field label="Description (shown in About section)">
                  <textarea style={{ ...inp, minHeight: 90, resize: "vertical" }} value={form.body} onChange={e => set("body", e.target.value)} />
                </Field>
                <Field label="Why this atoll (extra editorial content, optional)">
                  <textarea style={{ ...inp, minHeight: 90, resize: "vertical" }} value={form.why_this_atoll} onChange={e => set("why_this_atoll", e.target.value)} placeholder="Additional context about what makes this atoll special..." />
                </Field>
                <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".75rem" }}>
                  <input type="checkbox" id={`active-${row.id}`} checked={form.is_active} onChange={e => set("is_active", e.target.checked)} />
                  <label htmlFor={`active-${row.id}`} style={{ ...lbl, margin: 0 }}>Visible on site</label>
                </div>
                <div style={{ display: "flex", gap: ".6rem" }}>
                  <button style={btn()} onClick={save}>Save changes</button>
                  <button style={ghostBtn} onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".1rem" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "var(--ink)", fontWeight: 600 }}>{row.name}</div>
                    {row.is_active === false && (
                      <span style={{ ...badge("var(--muted2)", "var(--off2)") as any, fontSize: ".46rem" }}>Hidden</span>
                    )}
                  </div>
                  <div style={{ fontSize: ".6rem", color: "var(--muted2)" }}>{row.coord}</div>
                  <div style={{ fontSize: ".7rem", color: "var(--muted)", fontStyle: "italic", marginTop: ".28rem", lineHeight: 1.5, maxWidth: 420 }}>{row.italic}</div>
                  {row.why_this_atoll && (
                    <div style={{ fontSize: ".62rem", color: "var(--tq-d)", marginTop: ".3rem", fontWeight: 600 }}>✓ Why this atoll content added</div>
                  )}
                </div>
                <button style={{ ...ghostBtn, flexShrink: 0 }} onClick={() => startEdit(row)}>Edit</button>
              </div>
            )}

            {/* Photo uploads */}
            <div style={{ borderTop: "1.5px solid var(--off2)", paddingTop: ".9rem" }}>
              <div style={{ fontSize: ".56rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".75rem" }}>
                Photos
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".65rem" }}>
                {(["main", "strip1", "strip2"] as const).map(slot => {
                  const colMap: any = {
                    main:   { src: photo?.main_src,   label: "Main photo", ratio: "4/3" },
                    strip1: { src: photo?.strip1_src, label: "Left strip",  ratio: "1/1" },
                    strip2: { src: photo?.strip2_src, label: "Right strip", ratio: "1/1" },
                  };
                  const { src, label, ratio } = colMap[slot];
                  const isUploading = uploadingSlot === `${row.id}-${slot}`;
                  return (
                    <div key={slot}>
                      <div style={{ fontSize: ".52rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: ".3rem" }}>
                        {label}
                      </div>
                      <div style={{ aspectRatio: ratio, background: src ? "var(--tq-vd)" : "var(--off2)", border: "1.5px solid var(--off3)", borderRadius: "2px", overflow: "hidden", marginBottom: ".3rem", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {src ? (
                          <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        ) : (
                          <div style={{ fontSize: ".58rem", color: "var(--off3)", textAlign: "center", padding: ".3rem" }}>No photo</div>
                        )}
                        {isUploading && (
                          <div style={{ position: "absolute", inset: 0, background: "rgba(2,40,48,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", color: "#fff", fontWeight: 700 }}>
                            Uploading…
                          </div>
                        )}
                      </div>
                      <label style={{ display: "block", background: "var(--off)", border: "1.5px solid var(--off3)", padding: ".28rem .5rem", fontSize: ".6rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", cursor: "pointer", textAlign: "center", color: "var(--muted2)" }}>
                        {src ? "Replace" : "Upload"}
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileInput(row.id, slot)} disabled={isUploading} />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}

// ── REVIEWS SECTION ──────────────────────────────────────────────────
function ReviewsSection({ toast }: { toast: (t: Toast) => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const supabase = createBrowserSupabaseClient();

  const emptyForm = () => ({
    author_name: "", location: "", journey: "", body: "", rating: 5, is_published: false, sort_order: 0,
  });
  const [form, setForm] = useState(emptyForm());
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("sort_order");
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.author_name || !form.body) return toast({ msg: "Name and review are required", type: "err" });
    const { error } = editing
      ? await supabase.from("reviews").update(form).eq("id", editing.id)
      : await supabase.from("reviews").insert(form);
    if (error) return toast({ msg: error.message, type: "err" });
    toast({ msg: editing ? "Review updated" : "Review added", type: "ok" });
    setEditing(null); setForm(emptyForm()); load();
  };

  const togglePublish = async (row: any) => {
    await supabase.from("reviews").update({ is_published: !row.is_published }).eq("id", row.id);
    toast({ msg: !row.is_published ? "Published" : "Unpublished", type: "ok" }); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    toast({ msg: "Deleted", type: "ok" }); load();
  };

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading...</div>;

  return (
    <div>
      <div style={{ fontSize: ".58rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "1.2rem" }}>
        {rows.length} reviews · {rows.filter(r => r.is_published).length} published
      </div>

      {/* Form */}
      <div style={{ background: "var(--off)", border: "1.5px solid var(--tq-xl)", padding: "1.2rem", marginBottom: "1.4rem" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "var(--ink)", fontWeight: 600, marginBottom: "1rem" }}>
          {editing ? "Edit Review" : "Add Review"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <Field label="Author name *"><input style={inp} value={form.author_name} onChange={e => set("author_name", e.target.value)} placeholder="Sarah M." /></Field>
          <Field label="Location"><input style={inp} value={form.location} onChange={e => set("location", e.target.value)} placeholder="London" /></Field>
          <Field label="Journey"><input style={inp} value={form.journey} onChange={e => set("journey", e.target.value)} placeholder="Huvadhu Deep — 10 Days" /></Field>
          <Field label="Rating">
            <select style={inp} value={form.rating} onChange={e => set("rating", parseInt(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
            </select>
          </Field>
        </div>
        <Field label="Review *">
          <textarea style={{ ...inp, minHeight: 100, resize: "vertical" }} value={form.body} onChange={e => set("body", e.target.value)} placeholder="Write the review..." />
        </Field>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".85rem" }}>
          <input type="checkbox" id="rev-pub" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} />
          <label htmlFor="rev-pub" style={{ ...lbl, margin: 0 }}>Publish immediately</label>
        </div>
        <div style={{ display: "flex", gap: ".6rem" }}>
          <button style={btn()} onClick={save}>{editing ? "Save" : "Add review"}</button>
          {editing && <button style={ghostBtn} onClick={() => { setEditing(null); setForm(emptyForm()); }}>Cancel</button>}
        </div>
      </div>

      {/* List */}
      {rows.map(row => (
        <div key={row.id} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".75rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".2rem" }}>
                <span style={{ fontSize: ".85rem", fontWeight: 600, color: "var(--ink)" }}>{row.author_name}</span>
                <span style={badge(row.is_published ? "#2A8050" : "var(--muted2)", row.is_published ? "#E8F5EE" : "var(--off2)") as any}>
                  {row.is_published ? "Published" : "Draft"}
                </span>
                <span style={{ color: "var(--eq)", fontSize: ".65rem" }}>{"★".repeat(row.rating)}</span>
              </div>
              <div style={{ fontSize: ".6rem", color: "var(--muted2)" }}>{row.location} · {row.journey}</div>
              <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: ".25rem", fontStyle: "italic", lineHeight: 1.5 }}>
                "{row.body?.slice(0, 100)}{row.body?.length > 100 ? "..." : ""}"
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", flexShrink: 0 }}>
              <button style={ghostBtn} onClick={() => { setEditing(row); setForm({ author_name: row.author_name, location: row.location, journey: row.journey, body: row.body, rating: row.rating, is_published: row.is_published, sort_order: row.sort_order }); }}>Edit</button>
              <button style={{ ...ghostBtn, color: row.is_published ? "var(--muted2)" : "#2A8050", borderColor: row.is_published ? "var(--off3)" : "#2A8050" }} onClick={() => togglePublish(row)}>
                {row.is_published ? "Unpublish" : "Publish"}
              </button>
              <button style={{ ...ghostBtn, color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => del(row.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── BOOKINGS SECTION ──────────────────────────────────────────────────
function BookingsSection({ toast }: { toast: (t: Toast) => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const supabase = createBrowserSupabaseClient();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("booking_requests").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await supabase.from("booking_requests").update({ status }).eq("id", id);
    toast({ msg: `Marked as ${status}`, type: "ok" }); load();
  };

  const statusColor: Record<string, [string, string]> = {
    pending: ["var(--eq)", "#FFF8E6"],
    confirmed: ["#2A8050", "#E8F5EE"],
    cancelled: ["var(--muted2)", "var(--off2)"],
  };

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading…</div>;

  return (
    <div>
      <div style={{ fontSize: ".58rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "1.2rem" }}>
        {rows.length} booking requests
      </div>
      {rows.length === 0 && <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>No booking requests yet.</div>}
      {rows.map(row => {
        const [color, bg] = statusColor[row.status] ?? ["var(--muted2)", "var(--off2)"];
        return (
          <div key={row.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".25rem" }}>
                  <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>{row.guest_name}</span>
                  <span style={badge(color, bg)}>{row.status}</span>
                  <span style={badge("var(--muted2)", "var(--off2)")}>{row.type}</span>
                </div>
                <div style={{ fontSize: ".65rem", color: "var(--muted2)" }}>{row.guest_email} · {row.guest_count} guest{row.guest_count !== 1 ? "s" : ""}</div>
                <div style={{ fontSize: ".62rem", color: "var(--muted2)", marginTop: ".1rem" }}>
                  {row.item_id} {row.preferred_date ? `· ${row.preferred_date}` : ""}
                </div>
                {row.notes && <div style={{ fontSize: ".68rem", color: "var(--muted)", marginTop: ".3rem", fontStyle: "italic" }}>"{row.notes}"</div>}
                <div style={{ fontSize: ".55rem", color: "var(--off3)", marginTop: ".35rem" }}>{new Date(row.created_at).toLocaleDateString()}</div>
              </div>
              {row.status === "pending" && (
                <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", flexShrink: 0 }}>
                  <button style={btn("#2A8050")} onClick={() => updateStatus(row.id, "confirmed")}>Confirm</button>
                  <button style={{ ...ghostBtn, color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => updateStatus(row.id, "cancelled")}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── STORIES SECTION ───────────────────────────────────────────────────
function StoriesSection({ toast }: { toast: (t: Toast) => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [atolls, setAtolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [storyImages, setStoryImages] = useState<any[]>([]);
  const [newImgUrl, setNewImgUrl] = useState("");
  const supabase = createBrowserSupabaseClient();

  const emptyForm = () => ({
    title: "", slug: "", excerpt: "", content: "",
    cover_image_url: "", person_image_url: "", atoll_id: "", author_name: "", is_published: false,
  });
  const [form, setForm] = useState(emptyForm());
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: storiesData }, { data: atollData }] = await Promise.all([
      supabase.from("stories").select("*").order("created_at", { ascending: false }),
      supabase.from("atolls").select("id, name").order("sort_order"),
    ]);
    setRows(storiesData ?? []);
    setAtolls(atollData ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadImages = useCallback(async (storyId: string) => {
    const { data } = await supabase.from("story_images").select("*")
      .eq("story_id", storyId).order("sort_order");
    setStoryImages(data ?? []);
  }, []);

  const autoSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const startEdit = (row: any) => {
    setEditing(row);
    setForm({
      title: row.title ?? "", slug: row.slug ?? "",
      excerpt: row.excerpt ?? "", content: row.content ?? "",
      cover_image_url: row.cover_image_url ?? "",
      person_image_url: row.person_image_url ?? "",
      atoll_id: row.atoll_id ?? "", author_name: row.author_name ?? "",
      is_published: row.is_published ?? false,
    });
    loadImages(row.id);
    setAdding(true);
  };

  const save = async () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content)
      return toast({ msg: "Title, slug, excerpt and content are required", type: "err" });
    const payload = {
      title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content,
      cover_image_url: form.cover_image_url || null,
      person_image_url: form.person_image_url || null,
      atoll_id: form.atoll_id || null, author_name: form.author_name || null,
      is_published: form.is_published,
      published_at: form.is_published ? (editing?.published_at ?? new Date().toISOString()) : null,
    };
    const { error } = editing
      ? await supabase.from("stories").update(payload).eq("id", editing.id)
      : await supabase.from("stories").insert(payload);
    if (error) return toast({ msg: error.message, type: "err" });
    toast({ msg: editing ? "Story updated" : "Story created", type: "ok" });
    setAdding(false); setEditing(null); setForm(emptyForm()); setStoryImages([]); load();
  };

  const togglePublish = async (row: any) => {
    const pub = !row.is_published;
    await supabase.from("stories").update({
      is_published: pub, published_at: pub ? new Date().toISOString() : null,
    }).eq("id", row.id);
    toast({ msg: pub ? "Published" : "Unpublished", type: "ok" }); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this story permanently?")) return;
    await supabase.from("stories").delete().eq("id", id);
    toast({ msg: "Story deleted", type: "ok" }); load();
  };

  const uploadFile = async (file: File, prefix: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${prefix}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("atoll-photos")
      .upload(path, file, { upsert: false, contentType: file.type });
    if (error) { toast({ msg: error.message, type: "err" }); return null; }
    return supabase.storage.from("atoll-photos").getPublicUrl(path).data.publicUrl;
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    const url = await uploadFile(file, "stories");
    if (url) set("cover_image_url", url);
    setUploading(false);
  };

  const uploadPortrait = async (file: File) => {
    const url = await uploadFile(file, "stories/people");
    if (url) set("person_image_url", url);
  };

  const addImage = async (file?: File, url?: string) => {
    if (!editing) return toast({ msg: "Save the story first", type: "err" });
    let imageUrl = url;
    if (file) {
      setUploadingImg(true);
      imageUrl = await uploadFile(file, "stories/images") ?? undefined;
      setUploadingImg(false);
    }
    if (!imageUrl) return;
    await supabase.from("story_images").insert({
      story_id: editing.id, image_url: imageUrl, caption: "", sort_order: storyImages.length,
    });
    loadImages(editing.id);
    toast({ msg: "Image added", type: "ok" });
  };

  const updateCaption = async (imgId: string, caption: string) => {
    await supabase.from("story_images").update({ caption }).eq("id", imgId);
    setStoryImages(prev => prev.map(img => img.id === imgId ? { ...img, caption } : img));
  };

  const moveImage = async (imgId: string, dir: "up" | "down") => {
    const idx = storyImages.findIndex(i => i.id === imgId);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= storyImages.length) return;
    const a = storyImages[idx], b = storyImages[swapIdx];
    await Promise.all([
      supabase.from("story_images").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("story_images").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    loadImages(editing.id);
  };

  const removeImage = async (imgId: string) => {
    if (!confirm("Remove this image?")) return;
    await supabase.from("story_images").delete().eq("id", imgId);
    loadImages(editing.id);
  };

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
        <div style={{ fontSize: ".58rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted2)" }}>
          {rows.length} stories
        </div>
        <button style={btn()} onClick={() => { setForm(emptyForm()); setEditing(null); setStoryImages([]); setAdding(true); }}>
          + New Story
        </button>
      </div>

      {adding && (
        <div style={{ background: "var(--off)", border: "1.5px solid var(--tq-xl)", padding: "1.4rem", marginBottom: "1.4rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "var(--ink)", marginBottom: "1.1rem", fontWeight: 600 }}>
            {editing ? "Edit Story" : "New Story"}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
            <Field label="Title *">
              <input style={inp} value={form.title} onChange={e => {
                set("title", e.target.value);
                if (!editing) set("slug", autoSlug(e.target.value));
              }} placeholder="The man who reads the current" />
            </Field>
            <Field label="Slug *">
              <input style={inp} value={form.slug} onChange={e => set("slug", e.target.value)} />
            </Field>
            <Field label="Author name">
              <input style={inp} value={form.author_name} onChange={e => set("author_name", e.target.value)} />
            </Field>
            <Field label="Atoll">
              <select style={inp} value={form.atoll_id} onChange={e => set("atoll_id", e.target.value)}>
                <option value="">No atoll</option>
                {atolls.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Excerpt *">
            <textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} />
          </Field>

          <Field label="Story content * (blank line between paragraphs)">
            <textarea style={{ ...inp, minHeight: 240, resize: "vertical", lineHeight: 1.7 }} value={form.content} onChange={e => set("content", e.target.value)} />
          </Field>

          <Field label="Cover image">
            <div style={{ display: "flex", gap: ".75rem", alignItems: "flex-start" }}>
              {form.cover_image_url && (
                <div style={{ position: "relative", width: 110, aspectRatio: "16/9", borderRadius: "2px", overflow: "hidden", background: "var(--tq-vd)", flexShrink: 0 }}>
                  <img src={form.cover_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input style={{ ...inp, marginBottom: ".4rem" }} value={form.cover_image_url}
                  onChange={e => set("cover_image_url", e.target.value)} placeholder="Paste URL or upload" />
                <label style={{ ...ghostBtn, display: "inline-block", cursor: "pointer", fontSize: ".58rem" }}>
                  {uploading ? "Uploading..." : "Upload cover"}
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }}
                    disabled={uploading} />
                </label>
              </div>
            </div>
          </Field>

          <Field label="Person / subject photo (shown left of story text)">
            <div style={{ display: "flex", gap: ".75rem", alignItems: "flex-start" }}>
              {form.person_image_url && (
                <div style={{ position: "relative", width: 70, aspectRatio: "3/4", borderRadius: "2px", overflow: "hidden", background: "var(--tq-vd)", flexShrink: 0 }}>
                  <img src={form.person_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input style={{ ...inp, marginBottom: ".4rem" }} value={form.person_image_url}
                  onChange={e => set("person_image_url", e.target.value)} placeholder="Paste URL or upload portrait" />
                <label style={{ ...ghostBtn, display: "inline-block", cursor: "pointer", fontSize: ".58rem" }}>
                  Upload portrait
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadPortrait(f); e.target.value = ""; }} />
                </label>
              </div>
            </div>
          </Field>

          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: editing ? "1.8rem" : "1rem" }}>
            <input type="checkbox" id="story-pub" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} />
            <label htmlFor="story-pub" style={{ ...lbl, margin: 0 }}>Publish immediately</label>
          </div>

          <div style={{ display: "flex", gap: ".6rem", marginBottom: editing ? "1.8rem" : 0 }}>
            <button style={btn()} onClick={save}>{editing ? "Save changes" : "Create story"}</button>
            <button style={ghostBtn} onClick={() => { setAdding(false); setEditing(null); setForm(emptyForm()); setStoryImages([]); }}>Cancel</button>
          </div>

          {editing && (
            <div style={{ borderTop: "1.5px solid var(--off2)", paddingTop: "1.2rem" }}>
              <div style={{ fontSize: ".56rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".65rem" }}>
                Story images
              </div>
              {storyImages.map((img, i) => (
                <div key={img.id} style={{ display: "flex", gap: ".75rem", alignItems: "flex-start", marginBottom: ".85rem", padding: ".75rem", background: "var(--white)", border: "1.5px solid var(--off3)" }}>
                  <div style={{ position: "relative", width: 80, aspectRatio: "4/3", borderRadius: "2px", overflow: "hidden", flexShrink: 0, background: "var(--tq-vd)" }}>
                    <img src={img.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input style={{ ...inp, marginBottom: ".4rem", fontSize: ".75rem" }}
                      value={img.caption ?? ""} onChange={e => updateCaption(img.id, e.target.value)}
                      placeholder="Caption (optional)" />
                    <div style={{ display: "flex", gap: ".35rem" }}>
                      {i > 0 && <button style={{ ...ghostBtn, fontSize: ".55rem", padding: ".18rem .5rem" }} onClick={() => moveImage(img.id, "up")}>Up</button>}
                      {i < storyImages.length - 1 && <button style={{ ...ghostBtn, fontSize: ".55rem", padding: ".18rem .5rem" }} onClick={() => moveImage(img.id, "down")}>Down</button>}
                      <button style={{ ...ghostBtn, fontSize: ".55rem", padding: ".18rem .5rem", color: "var(--coral)", borderColor: "var(--coral)", marginLeft: "auto" }} onClick={() => removeImage(img.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ background: "var(--white)", border: "1.5px dashed var(--off3)", padding: ".85rem", display: "flex", gap: ".6rem", alignItems: "center", flexWrap: "wrap" }}>
                <input style={{ ...inp, flex: 1, minWidth: 160, marginBottom: 0 }}
                  value={newImgUrl} onChange={e => setNewImgUrl(e.target.value)} placeholder="Paste image URL" />
                <button style={ghostBtn} onClick={() => { if (newImgUrl) { addImage(undefined, newImgUrl); setNewImgUrl(""); } }}>Add URL</button>
                <label style={{ ...ghostBtn, cursor: "pointer", fontSize: ".62rem" }}>
                  {uploadingImg ? "Uploading..." : "Upload image"}
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) addImage(f); e.target.value = ""; }}
                    disabled={uploadingImg} />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {rows.map(row => (
        <div key={row.id} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".75rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".2rem" }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "var(--ink)", fontWeight: 600 }}>{row.title}</div>
                <span style={badge(row.is_published ? "#2A8050" : "var(--muted2)", row.is_published ? "#E8F5EE" : "var(--off2)") as any}>
                  {row.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <div style={{ fontSize: ".6rem", color: "var(--muted2)" }}>/stories/{row.slug}</div>
              <div style={{ fontSize: ".7rem", color: "var(--muted)", fontStyle: "italic", marginTop: ".25rem", lineHeight: 1.5 }}>
                {row.excerpt?.slice(0, 110)}{row.excerpt?.length > 110 ? "..." : ""}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", flexShrink: 0 }}>
              <button style={ghostBtn} onClick={() => startEdit(row)}>Edit</button>
              <button style={{ ...ghostBtn, color: row.is_published ? "var(--muted2)" : "#2A8050", borderColor: row.is_published ? "var(--off3)" : "#2A8050" }}
                onClick={() => togglePublish(row)}>
                {row.is_published ? "Unpublish" : "Publish"}
              </button>
              <button style={{ ...ghostBtn, color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => del(row.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PAGE BANNERS SECTION ──────────────────────────────────────────────
function PageBannersSection({ toast }: { toast: (t: Toast) => void }) {
  const supabase = createBrowserSupabaseClient();
  const [uploading, setUploading] = useState<string | null>(null);
  const [banners, setBanners] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: pb } = await supabase.from("page_banners").select("page, src");
    const map: Record<string, string> = {};
    (pb ?? []).forEach((r: any) => { map[r.page] = r.src; });
    setBanners(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const uploadBanner = async (page: string, file: File) => {
    setUploading(page);
    try {
      const ext = file.name.split(".").pop();
      const path = `banners/${page}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("atoll-photos").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) { toast({ msg: upErr.message, type: "err" }); return; }
      const { data: { publicUrl } } = supabase.storage.from("atoll-photos").getPublicUrl(path);
      await supabase.from("page_banners").upsert({ page, src: publicUrl, alt: page }, { onConflict: "page" });
      toast({ msg: `${page} banner updated`, type: "ok" });
      load();
    } finally { setUploading(null); }
  };

  const UploadBtn = ({ page, src, label }: { page: string; src?: string; label: string }) => (
    <div style={{ ...card, borderLeftColor: "var(--eq)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "var(--ink)", fontWeight: 600, marginBottom: ".1rem" }}>{label}</div>
          <div style={{ fontSize: ".6rem", color: "var(--muted2)" }}>{page}</div>
          {src && (
            <div style={{ marginTop: ".55rem", aspectRatio: "16/5", overflow: "hidden", borderRadius: "2px", position: "relative", background: "var(--tq-vd)", maxWidth: 360 }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}
        </div>
        <label style={{ ...ghostBtn, display: "inline-flex", alignItems: "center", cursor: uploading === page ? "not-allowed" : "pointer", flexShrink: 0 }}>
          {uploading === page ? "Uploading…" : src ? "Replace" : "Upload"}
          <input type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadBanner(page, f); e.target.value = ""; }}
            disabled={uploading === page} />
        </label>
      </div>
    </div>
  );

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading…</div>;

  return (
    <div>
      <div style={{ fontSize: ".62rem", color: "var(--muted)", marginBottom: "1.4rem", lineHeight: 1.7 }}>
        Upload background photos for page heroes and the homepage manifesto section.
        Recommended: landscape photos, 1400px+ wide.
      </div>

      {/* Listing pages */}
      <div style={{ fontSize: ".56rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--tq-d)", marginBottom: ".75rem" }}>
        Listing Pages
      </div>
      <UploadBtn page="journeys" src={banners["journeys"]} label="Journeys page" />
      <UploadBtn page="experiences" src={banners["experiences"]} label="Experiences page" />

      {/* Manifesto */}
      <div style={{ fontSize: ".56rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--tq-d)", margin: "1.4rem 0 .75rem" }}>
        Homepage Manifesto Section
      </div>
      <UploadBtn page="manifesto" src={banners["manifesto"]} label="Manifesto background" />

    </div>
  );
}

// ── HERO IMAGES SECTION ───────────────────────────────────────────────
function HeroSection({ toast }: { toast: (t: Toast) => void }) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("hero_images").select("*").order("sort_order");
    setImages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `hero/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("atoll-photos")
        .upload(path, file, { upsert: false, contentType: file.type });

      if (upErr) { toast({ msg: `Upload failed: ${upErr.message}`, type: "err" }); return; }

      const { data: { publicUrl } } = supabase.storage.from("atoll-photos").getPublicUrl(path);

      const { error: dbErr } = await supabase.from("hero_images").insert({
        src: publicUrl,
        alt: file.name.replace(/\.[^.]+$/, ""),
        sort_order: images.length,
        active: true,
      });

      if (dbErr) { toast({ msg: dbErr.message, type: "err" }); return; }
      toast({ msg: "Hero image added", type: "ok" });
      load();
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: number, active: boolean) => {
    await supabase.from("hero_images").update({ active: !active }).eq("id", id);
    load();
  };

  const moveUp = async (img: any, i: number) => {
    if (i === 0) return;
    const prev = images[i - 1];
    await Promise.all([
      supabase.from("hero_images").update({ sort_order: prev.sort_order }).eq("id", img.id),
      supabase.from("hero_images").update({ sort_order: img.sort_order }).eq("id", prev.id),
    ]);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Remove this image from the slideshow?")) return;
    await supabase.from("hero_images").delete().eq("id", id);
    toast({ msg: "Image removed", type: "ok" });
    load();
  };

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading…</div>;

  return (
    <div>
      <div style={{ fontSize: ".62rem", color: "var(--muted)", marginBottom: "1.2rem", lineHeight: 1.7 }}>
        Upload photos to display as a crossfading slideshow behind the hero headline.
        Images rotate every 5 seconds. Drag to reorder or toggle visibility.
        Best results: landscape photos, at least 1400px wide.
      </div>

      {/* Upload button */}
      <label style={{
        display: "inline-flex", alignItems: "center", gap: ".5rem",
        background: uploading ? "var(--tq-d)" : "var(--tq)", color: "var(--white)",
        padding: ".5rem 1.1rem", fontSize: ".68rem", fontWeight: 700,
        letterSpacing: ".07em", textTransform: "uppercase",
        cursor: uploading ? "not-allowed" : "pointer", borderRadius: "2px", marginBottom: "1.4rem",
      }}>
        {uploading ? "Uploading…" : "+ Add Photo"}
        <input type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }}
          disabled={uploading} />
      </label>

      {images.length === 0 && (
        <div style={{ fontSize: ".8rem", color: "var(--muted)", padding: "2rem 0", textAlign: "center" }}>
          No hero images yet. Upload your first photo above.
        </div>
      )}

      {/* Image grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
        {images.map((img, i) => (
          <div key={img.id} style={{
            background: "var(--white)", border: `1.5px solid ${img.active ? "var(--tq-xl)" : "var(--off3)"}`,
            borderRadius: "2px", overflow: "hidden",
            opacity: img.active ? 1 : 0.55,
          }}>
            {/* Preview */}
            <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative", background: "var(--tq-vd)" }}>
              <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", top: ".4rem", left: ".4rem" }}>
                <span style={{
                  background: img.active ? "var(--tq)" : "rgba(0,0,0,.5)", color: "#fff",
                  fontSize: ".48rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                  padding: ".14rem .42rem", borderRadius: "2px",
                }}>
                  {img.active ? `Slide ${i + 1}` : "Hidden"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ padding: ".6rem .75rem", display: "flex", gap: ".35rem", flexWrap: "wrap", alignItems: "center" }}>
              <button style={ghostBtn} onClick={() => toggleActive(img.id, img.active)}>
                {img.active ? "Hide" : "Show"}
              </button>
              {i > 0 && (
                <button style={ghostBtn} onClick={() => moveUp(img, i)}>↑ Move up</button>
              )}
              <button
                style={{ ...ghostBtn, color: "var(--coral)", borderColor: "var(--coral)", marginLeft: "auto" }}
                onClick={() => remove(img.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HOST APPLICATIONS SECTION ─────────────────────────────────────────
function HostsSection({ toast }: { toast: (t: Toast) => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("host_applications").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await supabase.from("host_applications").update({ status }).eq("id", id);
    toast({ msg: `Application ${status}`, type: "ok" }); load();
  };

  const statusColor: Record<string, [string, string]> = {
    pending: ["var(--eq)", "#FFF8E6"],
    reviewing: ["var(--tq-d)", "var(--tq-xxl)"],
    approved: ["#2A8050", "#E8F5EE"],
    rejected: ["var(--muted2)", "var(--off2)"],
  };

  if (loading) return <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>Loading…</div>;

  return (
    <div>
      <div style={{ fontSize: ".58rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted2)", marginBottom: "1.2rem" }}>
        {rows.length} host applications
      </div>
      {rows.length === 0 && <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>No host applications yet.</div>}
      {rows.map(row => {
        const [color, bg] = statusColor[row.status] ?? ["var(--muted2)", "var(--off2)"];
        return (
          <div key={row.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".25rem" }}>
                  <span style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--ink)" }}>{row.full_name}</span>
                  <span style={badge(color, bg)}>{row.status}</span>
                </div>
                <div style={{ fontSize: ".65rem", color: "var(--muted2)" }}>{row.contact} · {row.atoll} {row.island ? `· ${row.island}` : ""}</div>
                {row.xp_title && <div style={{ fontSize: ".75rem", color: "var(--ink)", fontWeight: 600, marginTop: ".3rem" }}>{row.xp_title}</div>}
                {row.xp_description && <div style={{ fontSize: ".68rem", color: "var(--muted)", marginTop: ".15rem", lineHeight: 1.55 }}>{row.xp_description}</div>}
                {row.price && <div style={{ fontSize: ".65rem", color: "var(--tq-d)", marginTop: ".2rem" }}>Asking ${row.price}/person · {row.duration}</div>}
                {row.notes && <div style={{ fontSize: ".65rem", fontStyle: "italic", color: "var(--muted)", marginTop: ".2rem" }}>"{row.notes}"</div>}
                <div style={{ fontSize: ".55rem", color: "var(--off3)", marginTop: ".35rem" }}>{new Date(row.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".35rem", flexShrink: 0 }}>
                {row.status === "pending" && <button style={ghostBtn} onClick={() => updateStatus(row.id, "reviewing")}>Review</button>}
                {(row.status === "pending" || row.status === "reviewing") && (
                  <>
                    <button style={btn("#2A8050")} onClick={() => updateStatus(row.id, "approved")}>Approve</button>
                    <button style={{ ...ghostBtn, color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => updateStatus(row.id, "rejected")}>Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN ADMIN PAGE ───────────────────────────────────────────────────
export default function AdminPage() {
  const router   = useRouter();
  const authClient = createBrowserSupabaseClient();
  const [userEmail, setUserEmail] = useState("");
  const [section, setSection] = useState<Section>("journeys");
  const [toast, setToast]     = useState<Toast | null>(null);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    authClient.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/admin/login");
      else setUserEmail(data.user.email ?? "");
    });
  }, []);

  const signOut = async () => {
    await authClient.auth.signOut();
    router.replace("/admin/login");
  };

  const showToast = (t: Toast) => {
    setToast(t);
    setTimeout(() => setToast(null), 3000);
  };

  const NAV: { id: Section; label: string }[] = [
    { id: "journeys",   label: "Journeys" },
    { id: "departures", label: "Departures" },
    { id: "experiences",label: "Experiences" },
    { id: "atolls",     label: "Atolls" },
    { id: "hero",       label: "Hero Images" },
    { id: "banners",    label: "Page Banners" },
    { id: "stories",    label: "Stories" },
    { id: "reviews",    label: "Reviews" },
    { id: "bookings",   label: "Bookings" },
    { id: "hosts",      label: "Host Applications" },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--off)", fontFamily: "Montserrat, sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "var(--tq-vd)", padding: ".6rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "var(--white)", fontWeight: 600 }}>AtollDrift</div>
          <div style={{ fontSize: ".48rem", letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,.45)" }}>Admin Panel</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {userEmail && (
            <span style={{ fontSize: ".6rem", color: "rgba(255,255,255,.5)" }}>{userEmail}</span>
          )}
          <a href="/" style={{ fontSize: ".58rem", color: "rgba(255,255,255,.6)", textDecoration: "none", letterSpacing: ".07em", textTransform: "uppercase" }}>
            ← View site
          </a>
          <button
            onClick={signOut}
            style={{
              background: "none", border: "1px solid rgba(255,255,255,.25)", color: "rgba(255,255,255,.7)",
              padding: ".3rem .75rem", fontSize: ".58rem", fontWeight: 700, letterSpacing: ".07em",
              textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", borderRadius: "2px",
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100dvh - 44px)" }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: "var(--white)", borderRight: "1.5px solid var(--tq-xl)", padding: "1.4rem 0", flexShrink: 0 }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: ".6rem 1.4rem", background: section === n.id ? "var(--tq-xxl)" : "none",
                border: "none", borderLeft: section === n.id ? "3px solid var(--tq)" : "3px solid transparent",
                fontSize: ".68rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase",
                color: section === n.id ? "var(--tq-d)" : "var(--muted2)", cursor: "pointer",
                fontFamily: "inherit", transition: "all .15s",
              }}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "1.8rem 2rem", maxWidth: 860, overflowY: "auto" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "var(--ink)", fontWeight: 600, marginBottom: "1.5rem" }}>
            {NAV.find(n => n.id === section)?.label}
          </div>
          {section === "journeys"    && <JourneysSection    toast={showToast} />}
          {section === "departures"  && <DeparturesSection  toast={showToast} />}
          {section === "experiences" && <ExperiencesSection toast={showToast} />}
          {section === "atolls"      && <AtollsSection      toast={showToast} />}
          {section === "hero"        && <HeroSection        toast={showToast} />}
          {section === "banners"     && <PageBannersSection toast={showToast} />}
          {section === "stories"     && <StoriesSection     toast={showToast} />}
          {section === "reviews"     && <ReviewsSection     toast={showToast} />}
          {section === "bookings"    && <BookingsSection    toast={showToast} />}
          {section === "hosts"       && <HostsSection       toast={showToast} />}
        </div>
      </div>

      <ToastBar toast={toast} />
    </div>
  );
}
