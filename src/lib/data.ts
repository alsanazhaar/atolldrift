import { createClient } from "@supabase/supabase-js";
import type { Atoll, Journey, Experience, Story, StoryImage } from "@/lib/types";
// Types re-exported from types.ts for convenience
export type { Atoll, Journey, Experience, ExperienceCategory } from "@/lib/types";

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getAtolls(): Promise<Atoll[]> {
  const client = db();
  const [{ data: atollRows, error }, { data: journeyRows }] = await Promise.all([
    client.from("atolls").select("*, atoll_truths(text,variant,sort_order), atoll_photos(*)").eq("is_active", true).order("sort_order"),
    client.from("journeys").select("id, atoll_id"),
  ]);
  if (error || !atollRows?.length) { console.error("[AtollDrift] getAtolls:", error?.message); return []; }
  return atollRows.map((row: any) => {
    const photo = row.atoll_photos?.[0];
    const truths = (row.atoll_truths ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((t: any) => ({ text: t.text, ...(t.variant ? { variant: t.variant as "gold" } : {}) }));
    const journeyIds = (journeyRows ?? []).filter((j: any) => j.atoll_id === row.id).map((j: any) => j.id);
    return {
      id: row.id, number: row.number, hemisphere: row.hemisphere as "north"|"south",
      badge: row.badge, coord: row.coord, name: row.name, italic: row.italic,
      body: row.body, tinted: row.tinted, flip: row.flip, truths, journeyIds,
      ctaLabel: `See ${row.name} journeys →`,
      whyThisAtoll: row.why_this_atoll ?? null,
      photo: photo ? {
        main:   { src: photo.main_src,   alt: photo.main_alt,   title: photo.main_title, sub: photo.main_sub },
        strip1: { src: photo.strip1_src, alt: photo.strip1_alt, label: photo.strip1_label },
        strip2: { src: photo.strip2_src, alt: photo.strip2_alt, label: photo.strip2_label },
      } : { main:{src:"",alt:"",title:"",sub:""}, strip1:{src:"",alt:"",label:""}, strip2:{src:"",alt:"",label:""} },
    } satisfies Atoll;
  });
}

export async function getJourneys(): Promise<Journey[]> {
  const { data, error } = await db().from("journeys")
    .select("*, banner_src, journey_included(item,sort_order), journey_days(label,title,description,sort_order)")
    .order("atoll_id");
  if (error || !data) { console.error("[AtollDrift] getJourneys:", error?.message); return []; }
  return data.map((row: any) => ({
    id: row.id, atollId: row.atoll_id, title: row.title, price: row.price,
    duration: row.duration, groupSize: row.group_size, tagline: row.tagline,
    description: row.description, hemisphere: row.hemisphere as "north"|"south",
    coord: row.coord, goldAccent: row.gold_accent,
    bannerSrc: row.banner_src ?? null,
    included: (row.journey_included??[]).sort((a:any,b:any)=>a.sort_order-b.sort_order).map((i:any)=>i.item),
    days: (row.journey_days??[]).sort((a:any,b:any)=>a.sort_order-b.sort_order).map((d:any)=>({label:d.label,title:d.title,desc:d.description})),
  }));
}

export async function getJourneyById(id: string): Promise<Journey | null> {
  const journeys = await getJourneys();
  return journeys.find((j) => j.id === id) ?? null;
}

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await db().from("experiences")
    .select("*")
    .order("created_at");
  if (error || !data) { console.error("[AtollDrift] getExperiences:", error?.message); return []; }
  return data.map((row: any) => ({
    id: row.id, category: row.category as Experience["category"],
    catLabel: row.cat_label, catClass: row.cat_class, atoll: row.atoll,
    title: row.title, hostName: row.host_name, hostInitial: row.host_initial,
    hostLocation: row.host_location, duration: row.duration, groupSize: row.group_size,
    price: row.price, priceLabel: row.price_label, rating: Number(row.rating),
    ratingCount: row.rating_count, description: row.description,
    bannerSrc: row.banner_src ?? null,
    included: [], rules: [],
  }));
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const experiences = await getExperiences();
  return experiences.find((x) => x.id === id) ?? null;
}
export async function saveBookingRequest(payload: {
  type: "journey" | "experience"; itemId: string;
  guestName: string; guestEmail: string; guestCount?: number;
  preferredDate?: string; notes?: string;
}) {
  const { error } = await db().from("booking_requests").insert({
    type: payload.type, item_id: payload.itemId, departure_id: null,
    guest_name: payload.guestName, guest_email: payload.guestEmail,
    guest_count: payload.guestCount, preferred_date: payload.preferredDate ?? null,
    notes: payload.notes ?? null,
  });
  return { success: !error, error: error?.message };
}

export async function submitHostApplication(payload: {
  fullName: string; atoll: string; island?: string; yearsHere?: string; contact: string;
  category?: string; xpTitle?: string; xpDescription?: string; duration?: string;
  groupSize?: string; price?: number; included?: string; notes?: string;
}) {
  const { error } = await db().from("host_applications").insert({
    full_name: payload.fullName, atoll: payload.atoll, island: payload.island ?? null,
    years_here: payload.yearsHere ?? null, contact: payload.contact,
    category: payload.category ?? null, xp_title: payload.xpTitle ?? null,
    xp_description: payload.xpDescription ?? null, duration: payload.duration ?? null,
    group_size: payload.groupSize ?? null, price: payload.price ?? null,
    included: payload.included ?? null, notes: payload.notes ?? null,
  });
  return { success: !error, error: error?.message };
}

// ── STORIES ───────────────────────────────────────────────────────────


function mapStory(row: any, images: StoryImage[] = []): Story {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url ?? null,
    personImageUrl: row.person_image_url ?? null,
    atollId: row.atoll_id ?? null,
    authorName: row.author_name ?? null,
    isPublished: row.is_published,
    publishedAt: row.published_at ?? null,
    createdAt: row.created_at,
    images,
  };
}

export async function getPublishedStories(): Promise<Story[]> {
  const { data, error } = await db()
    .from("stories")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error || !data) { console.error("[AtollDrift] getPublishedStories:", error?.message); return []; }
  return data.map((row: any) => mapStory(row));
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const client = db();
  const [{ data: story }, { data: images }] = await Promise.all([
    client.from("stories").select("*").eq("slug", slug).eq("is_published", true).maybeSingle(),
    client.from("story_images").select("*").order("sort_order"),
  ]);
  if (!story) return null;
  const storyImages: StoryImage[] = (images ?? [])
    .filter((img: any) => img.story_id === story.id)
    .map((img: any) => ({
      id: img.id,
      storyId: img.story_id,
      imageUrl: img.image_url,
      caption: img.caption ?? null,
      sortOrder: img.sort_order,
    }));
  return mapStory(story, storyImages);
}

export async function getAllStories(): Promise<Story[]> {
  const { data, error } = await db()
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) { console.error("[AtollDrift] getAllStories:", error?.message); return []; }
  return data.map((row: any) => mapStory(row));
}

// ── REVIEWS ───────────────────────────────────────────────────────────
export interface Review {
  id: string;
  authorName: string;
  location: string;
  journey: string;
  body: string;
  rating: number;
  sortOrder: number;
}

export async function getPublishedReviews(): Promise<Review[]> {
  const { data, error } = await db()
    .from("reviews")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error || !data) { console.error("[AtollDrift] getPublishedReviews:", error?.message); return []; }
  return data.map((r: any) => ({
    id: r.id,
    authorName: r.author_name,
    location: r.location,
    journey: r.journey,
    body: r.body,
    rating: r.rating,
    sortOrder: r.sort_order,
  }));
}
