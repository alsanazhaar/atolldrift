-- ═══════════════════════════════════════════════════════════════════
-- AtollDrift — Seed Data
-- Run AFTER schema.sql in: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════

-- ── ATOLLS ──────────────────────────────────────────────────────────
insert into atolls (id, number, hemisphere, badge, coord, name, italic, body, tinted, flip, sort_order) values
(
  'huvadhu', '01 of 03', 'north', 'Northern Hemisphere',
  '0° 30'' N · 73° 18'' E · Gaafu Alif + Gaafu Dhaalu', 'Huvadhu',
  'The largest natural coral atoll on earth. Almost nobody has been.',
  'Huvadhu spans 130 kilometres with over 250 islands, most inhabited by fishing communities who have read Indian Ocean currents for generations. The lagoon water here is the colour people mean when they say blue lagoon.',
  false, false, 1
),
(
  'fuvahmulah', '02 of 03', 'south', 'Southern Hemisphere',
  '0° 17'' S · 73° 25'' E · Gnaviyani', 'Fuvahmulah',
  'One island. No lagoon. Two freshwater lakes. A channel unlike anything else in this ocean.',
  'A geological anomaly — a single island forming its own atoll with no lagoon, dropping almost immediately into deep ocean. Tiger sharks, threshers, and mantas coexist year-round. Two freshwater lakes in the middle of the Indian Ocean.',
  true, true, 2
),
(
  'addu', '03 of 03', 'south', 'Southern Hemisphere',
  '0° 41'' S · 73° 09'' E · Seenu', 'Addu',
  'The southernmost point of the Maldives. History runs deeper here than anywhere else in the chain.',
  'Addu Atoll sits at the bottom of the Maldivian archipelago. It was a British military base. It briefly declared independence. Its people speak a dialect different enough to feel like another language. The coral cover here is among the best-preserved in the Indian Ocean.',
  false, false, 3
);

-- ── ATOLL TRUTHS ─────────────────────────────────────────────────────
insert into atoll_truths (atoll_id, text, variant, sort_order) values
-- Huvadhu
('huvadhu', '<strong>Gadhdhoo still builds dhonis by hand.</strong> The master builder carries the plans in his head, passed down without interruption.', null, 1),
('huvadhu', '<strong>The scale changes your sense of ocean.</strong> Crossing the interior on a dhoni, you cannot see land in any direction for hours.', null, 2),
('huvadhu', '<strong>The surf passes are largely uncharted.</strong> Your guide knows them because he grew up paddling out on them as a child.', null, 3),
-- Fuvahmulah
('fuvahmulah', '<strong>You are south of the equator.</strong> The sky looks different. The current runs differently. This matters more than it sounds.', 'gold', 1),
('fuvahmulah', '<strong>Dhadimago Kilhi and Bandaara Kilhi</strong> — two freshwater lakes on an ocean island that should not exist here.', 'gold', 2),
('fuvahmulah', '<strong>Liyelaa jahdhu lacquerwork</strong> — intricate geometric patterns in turned wood, unique to this island, made within families.', 'gold', 3),
-- Addu
('addu', '<strong>The RAF left behind a causeway</strong> connecting six islands — the only road in the southern Maldives.', 'gold', 1),
('addu', '<strong>Addu has seen things the rest of the Maldives hasn''t</strong> — independence, occupation, a world that passed through on the way to somewhere else.', 'gold', 2),
('addu', '<strong>The diving at Maakandu is world-class</strong> and almost entirely unmarketed. Your guide will be the only boat at the channel.', 'gold', 3);

-- ── ATOLL PHOTOS ─────────────────────────────────────────────────────
insert into atoll_photos (atoll_id, main_src, main_alt, main_title, main_sub, strip1_src, strip1_alt, strip1_label, strip2_src, strip2_alt, strip2_label) values
(
  'huvadhu',
  'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=700&q=82',
  'Huvadhu Atoll — turquoise lagoon, Maldives', 'Huvadhu Lagoon', '130 km across · world''s largest coral atoll',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
  'Traditional Maldivian dhoni fishing boat', 'Fishing dhoni',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
  'Maldives reef underwater', 'Reef channel'
),
(
  'fuvahmulah',
  'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=700&q=82',
  'Fuvahmulah island, southern Maldives', 'Fuvahmulah', '0°17'' S · one island · no lagoon',
  'https://images.unsplash.com/photo-1621618793792-cb20adcc8025?auto=format&fit=crop&w=400&q=80',
  'Tiger shark underwater Maldives', 'Tiger sharks',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80',
  'Tropical freshwater lake', 'Freshwater lakes'
),
(
  'addu',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82',
  'Addu Atoll — southernmost Maldives', 'Addu Atoll', '0°41'' S · southernmost Maldives',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=400&q=80',
  'Maldives coral reef diving', 'Maakandu channel',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=400&q=80',
  'Maldives island causeway', 'Hithadhoo causeway'
);

-- ── JOURNEYS ─────────────────────────────────────────────────────────
insert into journeys (id, atoll_id, title, price, duration, group_size, tagline, description, hemisphere, coord, gold_accent) values
(
  'huvadhu-deep', 'huvadhu', 'Huvadhu Deep — 10 Days', 1850, '10 days', '6–10 people',
  'The full measure of the largest atoll on earth.',
  'Ten days is the minimum to understand Huvadhu. We cross the interior lagoon by dhoni, stay in local guesthouses on four different islands, watch a dhoni being built, fish at dawn with the community fishermen, and enter surf passes that have no names in any guidebook.',
  'north', '0°30''N · 73°18''E', false
),
(
  'huvadhu-surf', 'huvadhu', 'Surf & Village — 7 Days', 1490, '7 days', '4–8 people',
  'The surf passes of Huvadhu are uncharted. Your guide knows every one.',
  'A focused seven days on the surf and fishing culture of Huvadhu. Two base islands, daily sessions at uncrowded passes, evenings with fishing families. Suitable for intermediate surfers and above.',
  'north', '0°30''N · 73°18''E', false
),
(
  'fuva-channel', 'fuvahmulah', 'Island & Ocean — 8 Days', 1980, '8 days', '6–10 people',
  'One island. The only place in the Maldives where the ocean starts immediately.',
  'Fuvahmulah is unlike any other island in this archipelago. Eight days to understand why: diving the channel with tiger sharks and mantas, visiting the freshwater lakes, watching liyelaa jahdhu lacquerwork being made in the home where it has always been made.',
  'south', '0°17''S · 73°25''E', true
),
(
  'addu-south', 'addu', 'Southern End — 9 Days', 1750, '9 days', '6–10 people',
  'History, coral, and the end of the archipelago.',
  'Addu was a British military base, briefly declared independence, and sits at the bottom of the Maldives. Its history is carried in its architecture, its accent, and its people. Nine days to understand it properly.',
  'south', '0°41''S · 73°09''E', true
),
(
  'addu-dive', 'addu', 'Maakandu Dive — 6 Days', 1380, '6 days', '4–8 people',
  'The most underrated dive site in the Indian Ocean.',
  'Focused liveaboard-style diving from a guesthouse base on Addu. Maakandu channel is world-class and almost entirely without crowds. Six days of diving with a guide who has been diving these channels his entire life.',
  'south', '0°41''S · 73°09''E', true
);

-- ── JOURNEY INCLUDED ─────────────────────────────────────────────────
insert into journey_included (journey_id, item, sort_order) values
('huvadhu-deep','Airport transfers',1),('huvadhu-deep','All island transport by dhoni',2),
('huvadhu-deep','Local guesthouse accommodation',3),('huvadhu-deep','All meals with host families',4),
('huvadhu-deep','Guided surf sessions',5),('huvadhu-deep','Dhoni building visit',6),
('huvadhu-deep','Night fishing trip',7),('huvadhu-deep','Reef snorkelling',8),

('huvadhu-surf','Airport transfers',1),('huvadhu-surf','Dhoni boat transport',2),
('huvadhu-surf','Guesthouse accommodation',3),('huvadhu-surf','Breakfast & dinner daily',4),
('huvadhu-surf','Daily surf guide',5),('huvadhu-surf','Fishing village visits',6),
('huvadhu-surf','Snorkel gear',7),

('fuva-channel','Airport transfers',1),('fuva-channel','All accommodation',2),
('fuva-channel','Full board with local families',3),('fuva-channel','Channel diving (certified divers)',4),
('fuva-channel','Snorkel gear',5),('fuva-channel','Lacquerwork workshop visit',6),
('fuva-channel','Freshwater lake tour',7),('fuva-channel','Guided island walk',8),

('addu-south','Airport transfers',1),('addu-south','Guesthouse accommodation',2),
('addu-south','All meals',3),('addu-south','Guided history walk',4),
('addu-south','Causeway cycling',5),('addu-south','Reef diving & snorkelling',6),
('addu-south','Local fishing trip',7),

('addu-dive','Airport transfers',1),('addu-dive','Guesthouse accommodation',2),
('addu-dive','3 dives per day',3),('addu-dive','All dive gear rental',4),
('addu-dive','Breakfast & dinner',5),('addu-dive','Night dive (one session)',6);

-- ── JOURNEY DAYS ─────────────────────────────────────────────────────
insert into journey_days (journey_id, label, title, description, sort_order) values
('huvadhu-deep','Day 1','Arrival in Thinadhoo','Domestic flight from Malé. Orientation walk at dusk. Dinner with host family.',1),
('huvadhu-deep','Day 2–3','Lagoon crossing','Full-day dhoni journey across the interior. Stop at uninhabited sandbanks.',2),
('huvadhu-deep','Day 4–5','Gadhdhoo — the boatbuilders','Two days with the community who still builds dhonis by hand without plans.',3),
('huvadhu-deep','Day 6–7','Surf passes','Sessions at the uncharted breaks. Your guide grew up here.',4),
('huvadhu-deep','Day 8–9','Deep reef & fishing','Night fishing with local fishermen. Snorkel the outer reef at sunrise.',5),
('huvadhu-deep','Day 10','Departure','Morning at leisure. Afternoon flight back to Malé.',6),

('huvadhu-surf','Day 1','Arrival','Domestic flight, afternoon briefing, meet your surf guide.',1),
('huvadhu-surf','Day 2–5','Surf sessions','Morning and afternoon sessions at the passes. Village evenings.',2),
('huvadhu-surf','Day 6','Fishing at dawn','Join the local fishermen for the early morning run.',3),
('huvadhu-surf','Day 7','Departure','Final surf session if conditions allow. Afternoon flight.',4),

('fuva-channel','Day 1','Arrival in Fuvahmulah','Domestic flight. Island orientation. Dinner overlooking the channel.',1),
('fuva-channel','Day 2–3','The channel','Dive or snorkel with tiger sharks and thresher sharks. Manta sightings common.',2),
('fuva-channel','Day 4','Freshwater lakes','Visit Dhadimago Kilhi and Bandaara Kilhi — two impossible lakes on an ocean island.',3),
('fuva-channel','Day 5–6','Lacquerwork & crafts','Full days with the liyelaa jahdhu artisans. Watch the process. Take something home.',4),
('fuva-channel','Day 7','At your own pace','Free day. Walk the island perimeter. Swim in the channel if conditions allow.',5),
('fuva-channel','Day 8','Departure','Morning market visit. Afternoon flight.',6),

('addu-south','Day 1','Arrival in Hithadhoo','Domestic flight. Orientation. Dinner.',1),
('addu-south','Day 2–3','History walk','The British base, the independence declaration, the buildings that remain.',2),
('addu-south','Day 4–5','Causeway & islands','Cycle the causeway connecting six islands. Stay on each one a night.',3),
('addu-south','Day 6–7','Maakandu channel','Dive or snorkel the best-preserved reef in the southern Maldives.',4),
('addu-south','Day 8','Fishing & community','A day with the fishing community. Join the morning run.',5),
('addu-south','Day 9','Departure','Morning at leisure. Afternoon flight.',6),

('addu-dive','Day 1','Arrival & check dive','Afternoon arrival. Easy check dive in the lagoon.',1),
('addu-dive','Day 2–5','Maakandu channel','Morning and afternoon dives. Different sites each day. Night dive on Day 4.',2),
('addu-dive','Day 6','Departure','Morning dive if conditions allow. Afternoon flight.',3);

-- ── DEPARTURES ───────────────────────────────────────────────────────
insert into departures (journey_id, date, spots, spots_label, kind, status, price) values
('huvadhu-deep','14 Feb 2025',4,'4 spots remaining','Group','hot',1850),
('huvadhu-deep','3 Mar 2025',8,'8 spots open','Group','open',1850),
('huvadhu-deep','15 Apr 2025',10,'10 spots open','Private available','open',1850),
('huvadhu-surf','3 Mar 2025',8,'8 spots open','Group','open',1490),
('huvadhu-surf','22 Mar 2025',8,'8 spots open','Group','open',1490),
('fuva-channel','22 Feb 2025',3,'3 spots remaining','Group','hot',1980),
('fuva-channel','10 Mar 2025',8,'8 spots open','Group','open',1980),
('addu-south','28 Feb 2025',7,'7 spots open','Group','open',1750),
('addu-south','5 Apr 2025',10,'10 spots open','Group','open',1750),
('addu-dive','8 Mar 2025',6,'6 spots open','Group','open',1380),
('addu-dive','20 Apr 2025',8,'8 spots open','Group','open',1380);

-- ── EXPERIENCES ──────────────────────────────────────────────────────
insert into experiences (id, category, cat_label, cat_class, atoll, title, host_name, host_initial, host_location, duration, group_size, price, rating, rating_count, description) values
('dawn-fishing-huva','ocean','Ocean','cat-ocean','Huvadhu','Dawn fishing with Ahmed','Ahmed Rasheed','A','Thinadhoo, Huvadhu','4 hours','2–5',45,4.9,23,
  'Ahmed has been fishing these waters since he was seven years old. He reads the current by feel and knows where the yellowfin tuna will be before the sun is up. You will join him on his dhoni for a real working fishing trip — not a tourist version of one.'),
('lacquerwork-fuva','craft','Craft','cat-craft','Fuvahmulah','Liyelaa jahdhu lacquerwork','Mariyam Ali','M','Fuvahmulah','3 hours','2–4',55,5.0,11,
  'Mariyam learned this craft from her mother, who learned it from hers. Liyelaa jahdhu is unique to Fuvahmulah — intricate geometric lacquerwork in turned wood, made in the home, passed between generations. Mariyam will teach you the basics and you will leave with something you made.'),
('tiger-snorkel-fuva','ocean','Ocean','cat-ocean','Fuvahmulah','Channel snorkel — tigers & threshers','Ibrahim Manik','I','Fuvahmulah','2.5 hours','2–6',75,4.8,34,
  'The Fuvahmulah channel is one of very few places in the world where tiger sharks, thresher sharks, and manta rays coexist in reliable numbers year-round. Ibrahim has been guiding in this channel for twelve years.'),
('taro-cooking-addu','food','Food','cat-cook','Addu','Taro & reef fish with Aminath','Aminath Saeed','A','Hithadhoo, Addu','3 hours','2–6',40,4.9,18,
  'Aminath grows her own taro behind her house and buys reef fish from the fishermen she has known her whole life. This is not a cooking class. It is cooking with someone who cooks this way every day, in her kitchen, with the food she grows.'),
('surf-lesson-huva','surf','Surf','cat-surf','Huvadhu','Surf lesson — the uncharted pass','Hassan Faroog','H','Hoarafushi, Huvadhu','3 hours','1–4',65,4.7,29,
  'Hassan grew up surfing the passes around Huvadhu before the island had guesthouses. He will take you to the break he learned on — no other guides use it. Suitable for beginners to intermediate surfers.'),
('freedive-addu','freedive','Freedive','cat-free','Addu','Freedive intro — Maakandu','Fathmath Didi','F','Maradhoo, Addu','4 hours','2–4',85,5.0,9,
  'Fathmath is one of the few qualified freedive instructors in the southern Maldives. This is an introductory session in the Maakandu channel — breathe-up technique, ear equalisation, and your first proper dive on a single breath.');

-- ── EXPERIENCE INCLUDED ──────────────────────────────────────────────
insert into experience_included (experience_id, item, sort_order) values
('dawn-fishing-huva','Traditional dhoni transport',1),('dawn-fishing-huva','All fishing gear',2),
('dawn-fishing-huva','Fresh catch breakfast',3),('dawn-fishing-huva','Tea and local snacks',4),

('lacquerwork-fuva','All materials and tools',1),('lacquerwork-fuva','Finished piece to take home',2),
('lacquerwork-fuva','Traditional tea and snacks',3),('lacquerwork-fuva','Explanation of the craft history',4),

('tiger-snorkel-fuva','Snorkel gear',1),('tiger-snorkel-fuva','Buoyancy vest',2),
('tiger-snorkel-fuva','Pre-water briefing',3),('tiger-snorkel-fuva','Post-session tea',4),

('taro-cooking-addu','All ingredients (grown or sourced locally)',1),('taro-cooking-addu','Full meal',2),
('taro-cooking-addu','Recipe card to take home',3),('taro-cooking-addu','Tea',4),

('surf-lesson-huva','Surfboard (choose your size)',1),('surf-lesson-huva','Rash vest',2),
('surf-lesson-huva','Dhoni transfer to the break',3),('surf-lesson-huva','Instruction in or out of water',4),

('freedive-addu','Freedive mask, fins & wetsuit',1),('freedive-addu','Breathing theory session',2),
('freedive-addu','Pool warm-up',3),('freedive-addu','Open water session',4);

-- ── EXPERIENCE RULES ─────────────────────────────────────────────────
insert into experience_rules (experience_id, rule, sort_order) values
('dawn-fishing-huva','Meet at Thinadhoo harbour 4:30am',1),
('dawn-fishing-huva','Bring warm layers for pre-dawn departure',2),
('dawn-fishing-huva','Suitable for all fitness levels',3),
('dawn-fishing-huva','Basic swimming ability recommended',4),

('lacquerwork-fuva','Suitable for ages 12+',1),
('lacquerwork-fuva','No experience needed',2),
('lacquerwork-fuva','Meet at Mariyam''s house — address sent on booking',3),

('tiger-snorkel-fuva','Confident swimmers only',1),
('tiger-snorkel-fuva','Age 16+',2),
('tiger-snorkel-fuva','Conditions-dependent — full refund if cancelled',3),

('taro-cooking-addu','Morning sessions only (9am)',1),
('taro-cooking-addu','Dietary requirements accommodated with advance notice',2),
('taro-cooking-addu','Suitable for all ages',3),

('surf-lesson-huva','Basic swim confidence required',1),
('surf-lesson-huva','Beginner welcome — no experience needed',2),
('surf-lesson-huva','Age 14+ (under 18 with guardian)',3),

('freedive-addu','Medical questionnaire required in advance',1),
('freedive-addu','No scuba diving within 12 hours',2),
('freedive-addu','Age 18+',3),
('freedive-addu','Confidence in open water required',4);
