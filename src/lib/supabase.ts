// ─────────────────────────────────────────────────────────────────────
// AtollDrift — Supabase Browser Client
// Used only in Client Components (admin panel, etc.)
// All server-side data fetching uses createClient from @supabase/supabase-js
// directly inside data.ts — see src/lib/data.ts
// ─────────────────────────────────────────────────────────────────────
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
