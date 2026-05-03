# AtollDrift — Next.js App

> **"Have You Seen The Maldives?"**  
> Authentic small-group travel in the southern Maldives.

A production-ready Next.js 14 (App Router) conversion of the AtollDrift HTML prototype.  
All styling, typography, animations, and branding are faithfully preserved.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## Folder Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Home page (/)
│   ├── not-found.tsx           # Custom 404
│   ├── journeys/
│   │   ├── page.tsx            # All journeys listing (/journeys)
│   │   └── [id]/
│   │       └── page.tsx        # Journey detail (/journeys/[id])
│   ├── experiences/
│   │   ├── page.tsx            # Experiences marketplace (/experiences)
│   │   └── [id]/
│   │       └── page.tsx        # Experience detail (/experiences/[id])
│   └── host/
│       └── page.tsx            # Host listing flow (/host)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav with mobile drawer
│   │   └── Footer.tsx          # Site footer
│   ├── sections/
│   │   ├── Hero.tsx            # Homepage hero section
│   │   ├── AtollSection.tsx    # Per-atoll section (photos, cards, truths)
│   │   ├── GroupSection.tsx    # Departures / private groups
│   │   └── Manifesto.tsx       # AtollDrift manifesto
│   └── ui/
│       ├── AIJourneyFinder.tsx # Floating AI chat (Journey Finder)
│       └── ExperienceCard.tsx  # Experience card used in grid
│
├── data/
│   └── content.ts              # All content data (atolls, journeys, experiences)
│
└── styles/
    └── globals.css             # All design tokens, typography, and component CSS
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, three atoll sections, group departures, manifesto |
| `/journeys` | All journeys grouped by atoll |
| `/journeys/[id]` | Journey detail with day-by-day, inclusions, departure picker |
| `/experiences` | Experiences marketplace with category filter |
| `/experiences/[id]` | Experience detail with booking card |
| `/host` | Multi-step host listing flow |

---

## Design System

All design tokens live in `src/styles/globals.css` as CSS variables:

```css
--tq: #0A7B8C;       /* Primary teal */
--tq-vd: #054E5A;    /* Deep teal */
--eq: #C8960C;       /* Equator gold */
--ink: #022830;      /* Near-black text */
--white: #FAF7F2;    /* Warm white */
--off: #F5F0E8;      /* Off-white tint */
--coral: #D85828;    /* Accent coral */
```

**Typography:**
- Display: `Cormorant Garamond` (serif)
- Body/UI: `Montserrat` (sans-serif)

---

## Data Layer

All content is in `src/data/content.ts`. Replace with API calls or CMS data:

```typescript
// Current: static data
import { atolls, journeys, experiences } from '@/data/content';

// Future: fetch from CMS
const journeys = await fetch('/api/journeys').then(r => r.json());
```

**Types exported:** `Atoll`, `Journey`, `Experience`, `Departure`

---

## AI Journey Finder

The floating "Find Trip" button opens an AI chat powered by the Anthropic API.  
The `AIJourneyFinder` component in `src/components/ui/AIJourneyFinder.tsx` calls  
`/v1/messages` directly from the browser (for prototyping).

**For production:** move the API call to a Next.js Route Handler:

```typescript
// src/app/api/journey-finder/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages }),
  });
  return Response.json(await response.json());
}
```

---

## Scroll Animations

Scroll-triggered reveals use `IntersectionObserver` directly in React components  
(no external library needed). Key classes:

- `.reveal` — fade up on scroll
- `.reveal-left` / `.reveal-right` — slide in from side
- `.truth` — truth points stagger in per-element
- `.manifesto.visible` — manifesto text appears in sequence

---

## Image Handling

Images use `next/image` with lazy loading. All Unsplash images are pre-configured  
in `next.config.ts`:

```typescript
images: {
  remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
},
```

---

## Production Checklist

- [ ] Move AI calls to Route Handler with server-side API key
- [ ] Connect data to CMS (Sanity, Contentful, or custom API)
- [ ] Add booking request form submission (email or backend)
- [ ] Add analytics (Plausible or Vercel Analytics)
- [ ] Set up proper `sitemap.xml` via `src/app/sitemap.ts`
- [ ] Add `robots.txt` via `src/app/robots.ts`
- [ ] Configure `ANTHROPIC_API_KEY` environment variable
- [ ] Set up proper image CDN for host-uploaded photos

---

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=your_key_here
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Pure CSS with CSS custom properties (no Tailwind)
- **Images:** `next/image` with lazy loading
- **AI:** Anthropic Claude API
- **Fonts:** Google Fonts (Cormorant Garamond + Montserrat)
- **Animations:** CSS transitions + IntersectionObserver

---

*AtollDrift · Southern Maldives · 0°00′00″ — The Equator*
