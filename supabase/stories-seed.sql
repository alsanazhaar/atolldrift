-- ═══════════════════════════════════════════════════════════════════
-- AtollDrift — Stories Seed
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════

insert into stories (
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  atoll_id,
  author_name,
  is_published,
  published_at
) values (
  'The man who reads the current',
  'the-man-who-reads-the-current',
  'Ahmed Rasheed has been fishing the waters around Huvadhu for forty years. He doesn''t check the weather on his phone.',
  'The boat leaves before sunrise. Ahmed doesn''t say much at this hour. He stands at the stern, one hand on the tiller, watching the water in a way that doesn''t look like watching at all.

He grew up on Thinadhoo, the largest island in Huvadhu. His father fished. His grandfather fished. The knowledge passed without ceremony — not taught so much as absorbed, the way you absorb the smell of salt and diesel when you spend your childhood on the water.

I ask him how he knows where to go. He pauses before answering, the way people do when a question assumes something that isn''t quite right.

"You read the current," he says. "You read the colour. You read the birds." He gestures at the horizon, where the sky is beginning to separate from the ocean in shades of grey. "It''s all there. You just have to be quiet enough to see it."

The reefs around Huvadhu are among the least visited in the Maldives. There are no resort atolls here, no seaplanes, no overwater bungalows. What there is: 250 islands, most of them inhabited by people who have been reading this ocean for generations.

We stop above a reef I couldn''t find on any chart. Ahmed cuts the engine. In the silence you can hear the current moving beneath us. He drops his line without looking at it, still watching the horizon.

Thirty minutes later, we head back with yellowfin tuna heavy in the hull. He hasn''t checked his phone once.',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85',
  'huvadhu',
  'AtollDrift',
  true,
  now()
);
