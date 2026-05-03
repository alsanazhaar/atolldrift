// ─────────────────────────────────────────────────────────────────────
// AtollDrift — Content Data
// Replace with API calls or CMS data in production.
// ─────────────────────────────────────────────────────────────────────

export type Hemisphere = "north" | "south";
export type JourneyStatus = "hot" | "open" | "soldout";
export type ExperienceCategory = "ocean" | "surf" | "food" | "craft" | "culture" | "freedive";

// ── ATOLLS ────────────────────────────────────────────────────────────

export interface Atoll {
  id: string;
  number: string;
  hemisphere: Hemisphere;
  badge: string;
  coord: string;
  name: string;
  italic: string;
  body: string;
  truths: { text: string; variant?: "gold" }[];
  photo: {
    main: { src: string; alt: string; title: string; sub: string };
    strip1: { src: string; alt: string; label: string };
    strip2: { src: string; alt: string; label: string };
  };
  journeyIds: string[];
  ctaLabel: string;
  tinted?: boolean;
  flip?: boolean;
}

export const atolls: Atoll[] = [
  {
    id: "huvadhu",
    number: "01 of 03",
    hemisphere: "north",
    badge: "Northern Hemisphere",
    coord: "0° 30' N · 73° 18' E · Gaafu Alif + Gaafu Dhaalu",
    name: "Huvadhu",
    italic: "The largest natural coral atoll on earth. Almost nobody has been.",
    body: "Huvadhu spans 130 kilometres with over 250 islands, most inhabited by fishing communities who have read Indian Ocean currents for generations. The lagoon water here is the colour people mean when they say blue lagoon.",
    truths: [
      { text: "<strong>Gadhdhoo still builds dhonis by hand.</strong> The master builder carries the plans in his head, passed down without interruption." },
      { text: "<strong>The scale changes your sense of ocean.</strong> Crossing the interior on a dhoni, you cannot see land in any direction for hours." },
      { text: "<strong>The surf passes are largely uncharted.</strong> Your guide knows them because he grew up paddling out on them as a child." },
    ],
    photo: {
      main: {
        src: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=700&q=82",
        alt: "Huvadhu Atoll — turquoise lagoon, Maldives",
        title: "Huvadhu Lagoon",
        sub: "130 km across · world's largest coral atoll",
      },
      strip1: {
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
        alt: "Traditional Maldivian dhoni fishing boat",
        label: "Fishing dhoni",
      },
      strip2: {
        src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80",
        alt: "Maldives reef underwater",
        label: "Reef channel",
      },
    },
    journeyIds: ["huvadhu-deep", "huvadhu-surf"],
    ctaLabel: "See Huvadhu journeys →",
  },
  {
    id: "fuvahmulah",
    number: "02 of 03",
    hemisphere: "south",
    badge: "Southern Hemisphere",
    coord: "0° 17' S · 73° 25' E · Gnaviyani",
    name: "Fuvahmulah",
    italic: "One island. No lagoon. Two freshwater lakes. A channel unlike anything else in this ocean.",
    body: "A geological anomaly — a single island forming its own atoll with no lagoon, dropping almost immediately into deep ocean. Tiger sharks, threshers, and mantas coexist year-round. Two freshwater lakes in the middle of the Indian Ocean.",
    truths: [
      { text: "<strong>You are south of the equator.</strong> The sky looks different. The current runs differently. This matters more than it sounds.", variant: "gold" },
      { text: "<strong>Dhadimago Kilhi and Bandaara Kilhi</strong> — two freshwater lakes on an ocean island that should not exist here.", variant: "gold" },
      { text: "<strong>Liyelaa jahdhu lacquerwork</strong> — intricate geometric patterns in turned wood, unique to this island, made within families.", variant: "gold" },
    ],
    photo: {
      main: {
        src: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=700&q=82",
        alt: "Fuvahmulah island, southern Maldives",
        title: "Fuvahmulah",
        sub: "0°17' S · one island · no lagoon",
      },
      strip1: {
        src: "https://images.unsplash.com/photo-1621618793792-cb20adcc8025?auto=format&fit=crop&w=400&q=80",
        alt: "Tiger shark underwater Maldives",
        label: "Tiger sharks",
      },
      strip2: {
        src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80",
        alt: "Tropical freshwater lake",
        label: "Freshwater lakes",
      },
    },
    journeyIds: ["fuva-channel"],
    ctaLabel: "See Fuvahmulah journeys →",
    tinted: true,
    flip: true,
  },
  {
    id: "addu",
    number: "03 of 03",
    hemisphere: "south",
    badge: "Southern Hemisphere",
    coord: "0° 41' S · 73° 09' E · Seenu",
    name: "Addu",
    italic: "The southernmost point of the Maldives. History runs deeper here than anywhere else in the chain.",
    body: "Addu Atoll sits at the bottom of the Maldivian archipelago. It was a British military base. It briefly declared independence. Its people speak a dialect different enough to feel like another language. The coral cover here is among the best-preserved in the Indian Ocean.",
    truths: [
      { text: "<strong>The RAF left behind a causeway</strong> connecting six islands — the only road in the southern Maldives.", variant: "gold" },
      { text: "<strong>Addu has seen things the rest of the Maldives hasn't</strong> — independence, occupation, a world that passed through on the way to somewhere else.", variant: "gold" },
      { text: "<strong>The diving at Maakandu is world-class</strong> and almost entirely unmarketed. Your guide will be the only boat at the channel.", variant: "gold" },
    ],
    photo: {
      main: {
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82",
        alt: "Addu Atoll — southernmost Maldives",
        title: "Addu Atoll",
        sub: "0°41' S · southernmost Maldives",
      },
      strip1: {
        src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=400&q=80",
        alt: "Maldives coral reef diving",
        label: "Maakandu channel",
      },
      strip2: {
        src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80",
        alt: "Maldives island causeway",
        label: "Hithadhoo causeway",
      },
    },
    journeyIds: ["addu-south", "addu-dive"],
    ctaLabel: "See Addu journeys →",
    flip: false,
  },
];

// ── JOURNEYS ──────────────────────────────────────────────────────────

export interface Departure {
  date: string;
  spots: number;
  spotsLabel: string;
  kind: string;
  status: JourneyStatus;
  price: number;
}

export interface DayItem {
  label: string;
  title: string;
  desc: string;
}

export interface Journey {
  id: string;
  atollId: string;
  title: string;
  price: number;
  duration: string;
  groupSize: string;
  tagline: string;
  description: string;
  hemisphere: Hemisphere;
  coord: string;
  included: string[];
  days: DayItem[];
  departures: Departure[];
  goldAccent?: boolean;
}

export const journeys: Journey[] = [
  {
    id: "huvadhu-deep",
    atollId: "huvadhu",
    title: "Huvadhu Deep — 10 Days",
    price: 1850,
    duration: "10 days",
    groupSize: "6–10 people",
    tagline: "The full measure of the largest atoll on earth.",
    description: "Ten days is the minimum to understand Huvadhu. We cross the interior lagoon by dhoni, stay in local guesthouses on four different islands, watch a dhoni being built, fish at dawn with the community fishermen, and enter surf passes that have no names in any guidebook.",
    hemisphere: "north",
    coord: "0°30'N · 73°18'E",
    included: ["Airport transfers", "All island transport by dhoni", "Local guesthouse accommodation", "All meals with host families", "Guided surf sessions", "Dhoni building visit", "Night fishing trip", "Reef snorkelling"],
    days: [
      { label: "Day 1", title: "Arrival in Thinadhoo", desc: "Domestic flight from Malé. Orientation walk at dusk. Dinner with host family." },
      { label: "Day 2–3", title: "Lagoon crossing", desc: "Full-day dhoni journey across the interior. Stop at uninhabited sandbanks." },
      { label: "Day 4–5", title: "Gadhdhoo — the boatbuilders", desc: "Two days with the community who still builds dhonis by hand without plans." },
      { label: "Day 6–7", title: "Surf passes", desc: "Sessions at the uncharted breaks. Your guide grew up here." },
      { label: "Day 8–9", title: "Deep reef & fishing", desc: "Night fishing with local fishermen. Snorkel the outer reef at sunrise." },
      { label: "Day 10", title: "Departure", desc: "Morning at leisure. Afternoon flight back to Malé." },
    ],
    departures: [
      { date: "14 Feb 2025", spots: 4, spotsLabel: "4 spots remaining", kind: "Group", status: "hot", price: 1850 },
      { date: "3 Mar 2025", spots: 8, spotsLabel: "8 spots open", kind: "Group", status: "open", price: 1850 },
      { date: "15 Apr 2025", spots: 10, spotsLabel: "10 spots open", kind: "Private available", status: "open", price: 1850 },
    ],
  },
  {
    id: "huvadhu-surf",
    atollId: "huvadhu",
    title: "Surf & Village — 7 Days",
    price: 1490,
    duration: "7 days",
    groupSize: "4–8 people",
    tagline: "The surf passes of Huvadhu are uncharted. Your guide knows every one.",
    description: "A focused seven days on the surf and fishing culture of Huvadhu. Two base islands, daily sessions at uncrowded passes, evenings with fishing families. Suitable for intermediate surfers and above.",
    hemisphere: "north",
    coord: "0°30'N · 73°18'E",
    included: ["Airport transfers", "Dhoni boat transport", "Guesthouse accommodation", "Breakfast & dinner daily", "Daily surf guide", "Fishing village visits", "Snorkel gear"],
    days: [
      { label: "Day 1", title: "Arrival", desc: "Domestic flight, afternoon briefing, meet your surf guide." },
      { label: "Day 2–5", title: "Surf sessions", desc: "Morning and afternoon sessions at the passes. Village evenings." },
      { label: "Day 6", title: "Fishing at dawn", desc: "Join the local fishermen for the early morning run." },
      { label: "Day 7", title: "Departure", desc: "Final surf session if conditions allow. Afternoon flight." },
    ],
    departures: [
      { date: "3 Mar 2025", spots: 8, spotsLabel: "8 spots open", kind: "Group", status: "open", price: 1490 },
      { date: "22 Mar 2025", spots: 8, spotsLabel: "8 spots open", kind: "Group", status: "open", price: 1490 },
    ],
  },
  {
    id: "fuva-channel",
    atollId: "fuvahmulah",
    title: "Island & Ocean — 8 Days",
    price: 1980,
    duration: "8 days",
    groupSize: "6–10 people",
    tagline: "One island. The only place in the Maldives where the ocean starts immediately.",
    description: "Fuvahmulah is unlike any other island in this archipelago. Eight days to understand why: diving the channel with tiger sharks and mantas, visiting the freshwater lakes, watching liyelaa jahdhu lacquerwork being made in the home where it has always been made.",
    hemisphere: "south",
    coord: "0°17'S · 73°25'E",
    included: ["Airport transfers", "All accommodation", "Full board with local families", "Channel diving (certified divers)", "Snorkel gear", "Lacquerwork workshop visit", "Freshwater lake tour", "Guided island walk"],
    days: [
      { label: "Day 1", title: "Arrival in Fuvahmulah", desc: "Domestic flight. Island orientation. Dinner overlooking the channel." },
      { label: "Day 2–3", title: "The channel", desc: "Dive or snorkel with tiger sharks and thresher sharks. Manta sightings common." },
      { label: "Day 4", title: "Freshwater lakes", desc: "Visit Dhadimago Kilhi and Bandaara Kilhi — two impossible lakes on an ocean island." },
      { label: "Day 5–6", title: "Lacquerwork & crafts", desc: "Full days with the liyelaa jahdhu artisans. Watch the process. Take something home." },
      { label: "Day 7", title: "At your own pace", desc: "Free day. Walk the island perimeter. Swim in the channel if conditions allow." },
      { label: "Day 8", title: "Departure", desc: "Morning market visit. Afternoon flight." },
    ],
    departures: [
      { date: "22 Feb 2025", spots: 3, spotsLabel: "3 spots remaining", kind: "Group", status: "hot", price: 1980 },
      { date: "10 Mar 2025", spots: 8, spotsLabel: "8 spots open", kind: "Group", status: "open", price: 1980 },
    ],
    goldAccent: true,
  },
  {
    id: "addu-south",
    atollId: "addu",
    title: "Southern End — 9 Days",
    price: 1750,
    duration: "9 days",
    groupSize: "6–10 people",
    tagline: "History, coral, and the end of the archipelago.",
    description: "Addu was a British military base, briefly declared independence, and sits at the bottom of the Maldives. Its history is carried in its architecture, its accent, and its people. Nine days to understand it properly.",
    hemisphere: "south",
    coord: "0°41'S · 73°09'E",
    included: ["Airport transfers", "Guesthouse accommodation", "All meals", "Guided history walk", "Causeway cycling", "Reef diving & snorkelling", "Local fishing trip"],
    days: [
      { label: "Day 1", title: "Arrival in Hithadhoo", desc: "Domestic flight. Orientation. Dinner." },
      { label: "Day 2–3", title: "History walk", desc: "The British base, the independence declaration, the buildings that remain." },
      { label: "Day 4–5", title: "Causeway & islands", desc: "Cycle the causeway connecting six islands. Stay on each one a night." },
      { label: "Day 6–7", title: "Maakandu channel", desc: "Dive or snorkel the best-preserved reef in the southern Maldives." },
      { label: "Day 8", title: "Fishing & community", desc: "A day with the fishing community. Join the morning run." },
      { label: "Day 9", title: "Departure", desc: "Morning at leisure. Afternoon flight." },
    ],
    departures: [
      { date: "28 Feb 2025", spots: 7, spotsLabel: "7 spots open", kind: "Group", status: "open", price: 1750 },
      { date: "5 Apr 2025", spots: 10, spotsLabel: "10 spots open", kind: "Group", status: "open", price: 1750 },
    ],
    goldAccent: true,
  },
  {
    id: "addu-dive",
    atollId: "addu",
    title: "Maakandu Dive — 6 Days",
    price: 1380,
    duration: "6 days",
    groupSize: "4–8 people",
    tagline: "The most underrated dive site in the Indian Ocean.",
    description: "Focused liveaboard-style diving from a guesthouse base on Addu. Maakandu channel is world-class and almost entirely without crowds. Six days of diving with a guide who has been diving these channels his entire life.",
    hemisphere: "south",
    coord: "0°41'S · 73°09'E",
    included: ["Airport transfers", "Guesthouse accommodation", "3 dives per day", "All dive gear rental", "Breakfast & dinner", "Night dive (one session)"],
    days: [
      { label: "Day 1", title: "Arrival & check dive", desc: "Afternoon arrival. Easy check dive in the lagoon." },
      { label: "Day 2–5", title: "Maakandu channel", desc: "Morning and afternoon dives. Different sites each day. Night dive on Day 4." },
      { label: "Day 6", title: "Departure", desc: "Morning dive if conditions allow. Afternoon flight." },
    ],
    departures: [
      { date: "8 Mar 2025", spots: 6, spotsLabel: "6 spots open", kind: "Group", status: "open", price: 1380 },
      { date: "20 Apr 2025", spots: 8, spotsLabel: "8 spots open", kind: "Group", status: "open", price: 1380 },
    ],
    goldAccent: true,
  },
];

// ── EXPERIENCES ───────────────────────────────────────────────────────

export interface Experience {
  id: string;
  category: ExperienceCategory;
  catLabel: string;
  catClass: string;
  atoll: string;
  title: string;
  hostName: string;
  hostInitial: string;
  hostLocation: string;
  duration: string;
  groupSize: string;
  price: number;
  priceLabel: string;
  rating: number;
  ratingCount: number;
  description: string;
  included: string[];
  rules: string[];
}

export const experiences: Experience[] = [
  {
    id: "dawn-fishing-huva",
    category: "ocean",
    catLabel: "Ocean",
    catClass: "cat-ocean",
    atoll: "Huvadhu",
    title: "Dawn fishing with Ahmed",
    hostName: "Ahmed Rasheed",
    hostInitial: "A",
    hostLocation: "Thinadhoo, Huvadhu",
    duration: "4 hours",
    groupSize: "2–5",
    price: 45,
    priceLabel: "per person",
    rating: 4.9,
    ratingCount: 23,
    description: "Ahmed has been fishing these waters since he was seven years old. He reads the current by feel and knows where the yellowfin tuna will be before the sun is up. You will join him on his dhoni for a real working fishing trip — not a tourist version of one.",
    included: ["Traditional dhoni transport", "All fishing gear", "Fresh catch breakfast", "Tea and local snacks"],
    rules: ["Meet at Thinadhoo harbour 4:30am", "Bring warm layers for pre-dawn departure", "Suitable for all fitness levels", "Basic swimming ability recommended"],
  },
  {
    id: "lacquerwork-fuva",
    category: "craft",
    catLabel: "Craft",
    catClass: "cat-craft",
    atoll: "Fuvahmulah",
    title: "Liyelaa jahdhu lacquerwork",
    hostName: "Mariyam Ali",
    hostInitial: "M",
    hostLocation: "Fuvahmulah",
    duration: "3 hours",
    groupSize: "2–4",
    price: 55,
    priceLabel: "per person",
    rating: 5.0,
    ratingCount: 11,
    description: "Mariyam learned this craft from her mother, who learned it from hers. Liyelaa jahdhu is unique to Fuvahmulah — intricate geometric lacquerwork in turned wood, made in the home, passed between generations. Mariyam will teach you the basics and you will leave with something you made.",
    included: ["All materials and tools", "Finished piece to take home", "Traditional tea and snacks", "Explanation of the craft history"],
    rules: ["Suitable for ages 12+", "No experience needed", "2 hour minimum commitment", "Meet at Mariyam's house — address sent on booking"],
  },
  {
    id: "tiger-snorkel-fuva",
    category: "ocean",
    catLabel: "Ocean",
    catClass: "cat-ocean",
    atoll: "Fuvahmulah",
    title: "Channel snorkel — tigers & threshers",
    hostName: "Ibrahim Manik",
    hostInitial: "I",
    hostLocation: "Fuvahmulah",
    duration: "2.5 hours",
    groupSize: "2–6",
    price: 75,
    priceLabel: "per person",
    rating: 4.8,
    ratingCount: 34,
    description: "The Fuvahmulah channel is one of very few places in the world where tiger sharks, thresher sharks, and manta rays coexist in reliable numbers year-round. Ibrahim has been guiding in this channel for twelve years.",
    included: ["Snorkel gear", "Buoyancy vest", "Pre-water briefing", "Post-session tea"],
    rules: ["Confident swimmers only", "No diving experience required", "Age 16+", "Conditions-dependent — full refund if cancelled"],
  },
  {
    id: "taro-cooking-addu",
    category: "food",
    catLabel: "Food",
    catClass: "cat-cook",
    atoll: "Addu",
    title: "Taro & reef fish with Aminath",
    hostName: "Aminath Saeed",
    hostInitial: "A",
    hostLocation: "Hithadhoo, Addu",
    duration: "3 hours",
    groupSize: "2–6",
    price: 40,
    priceLabel: "per person",
    rating: 4.9,
    ratingCount: 18,
    description: "Aminath grows her own taro behind her house and buys reef fish from the fishermen she has known her whole life. This is not a cooking class. It is cooking with someone who cooks this way every day, in her kitchen, with the food she grows.",
    included: ["All ingredients (grown or sourced locally)", "Full meal", "Recipe card to take home", "Tea"],
    rules: ["Morning sessions only (9am)", "Dietary requirements accommodated with advance notice", "Suitable for all ages"],
  },
  {
    id: "surf-lesson-huva",
    category: "surf",
    catLabel: "Surf",
    catClass: "cat-surf",
    atoll: "Huvadhu",
    title: "Surf lesson — the uncharted pass",
    hostName: "Hassan Faroog",
    hostInitial: "H",
    hostLocation: "Hoarafushi, Huvadhu",
    duration: "3 hours",
    groupSize: "1–4",
    price: 65,
    priceLabel: "per person",
    rating: 4.7,
    ratingCount: 29,
    description: "Hassan grew up surfing the passes around Huvadhu before the island had guesthouses. He will take you to the break he learned on — no other guides use it. Suitable for beginners to intermediate surfers.",
    included: ["Surfboard (choose your size)", "Rash vest", "Dhoni transfer to the break", "Instruction in or out of water"],
    rules: ["Basic swim confidence required", "Beginner welcome — no experience needed", "Age 14+ (under 18 with guardian)", "Board rental available on-site"],
  },
  {
    id: "freedive-addu",
    category: "freedive",
    catLabel: "Freedive",
    catClass: "cat-free",
    atoll: "Addu",
    title: "Freedive intro — Maakandu",
    hostName: "Fathmath Didi",
    hostInitial: "F",
    hostLocation: "Maradhoo, Addu",
    duration: "4 hours",
    groupSize: "2–4",
    price: 85,
    priceLabel: "per person",
    rating: 5.0,
    ratingCount: 9,
    description: "Fathmath is one of the few qualified freedive instructors in the southern Maldives. This is an introductory session in the Maakandu channel — breathe-up technique, ear equalisation, and your first proper dive on a single breath.",
    included: ["Freedive mask, fins & wetsuit", "Breathing theory session", "Pool warm-up", "Open water session", "Certification documentation if applicable"],
    rules: ["Medical questionnaire required in advance", "No scuba diving within 12 hours", "Age 18+", "Confidence in open water required"],
  },
];

// ── DEPARTURES (for group section) ───────────────────────────────────

export const allDepartures = [
  { atoll: "Huvadhu", atollClass: "th", journey: "Huvadhu Deep — 10 Days", date: "14 Feb 2025", spots: 4, spotsLabel: "4 spots", status: "hot" as const, journeyId: "huvadhu-deep" },
  { atoll: "Fuvahmulah", atollClass: "th", journey: "Island & Ocean — 8 Days", date: "22 Feb 2025", spots: 3, spotsLabel: "3 spots", status: "hot" as const, journeyId: "fuva-channel" },
  { atoll: "Huvadhu", atollClass: "th", journey: "Surf & Village — 7 Days", date: "3 Mar 2025", spots: 8, spotsLabel: "8 spots", status: "open" as const, journeyId: "huvadhu-surf" },
  { atoll: "Addu", atollClass: "th", journey: "Southern End — 9 Days", date: "28 Feb 2025", spots: 7, spotsLabel: "7 spots", status: "open" as const, journeyId: "addu-south" },
  { atoll: "Addu", atollClass: "th", journey: "Maakandu Dive — 6 Days", date: "8 Mar 2025", spots: 6, spotsLabel: "6 spots", status: "open" as const, journeyId: "addu-dive" },
];
