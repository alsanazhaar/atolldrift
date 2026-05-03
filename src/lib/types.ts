// ─────────────────────────────────────────────────────────────────────
// AtollDrift — Shared TypeScript Types
// Extracted from content.ts so the app has zero dependency on static data.
// Import types from here, not from @/data/content.
// ─────────────────────────────────────────────────────────────────────

export type Hemisphere = "north" | "south";
export type JourneyStatus = "hot" | "open" | "soldout";
export type ExperienceCategory = "ocean" | "surf" | "food" | "craft" | "culture" | "freedive";

export interface AtollTruth {
  text: string;
  variant?: "gold";
}

export interface AtollPhoto {
  main:   { src: string; alt: string; title: string; sub: string };
  strip1: { src: string; alt: string; label: string };
  strip2: { src: string; alt: string; label: string };
}

export interface Atoll {
  id: string;
  number: string;
  hemisphere: Hemisphere;
  badge: string;
  coord: string;
  name: string;
  italic: string;
  body: string;
  tinted: boolean;
  flip: boolean;
  truths: AtollTruth[];
  photo: AtollPhoto;
  journeyIds: string[];
  ctaLabel: string;
  whyThisAtoll?: string | null;
}

export interface Departure {
  id?: number;
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
  goldAccent: boolean;
  included: string[];
  days: DayItem[];
  departures: Departure[];
}

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

export interface StoryImage {
  id: string;
  storyId: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  personImageUrl: string | null;
  atollId: string | null;
  authorName: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  images?: StoryImage[];
}
