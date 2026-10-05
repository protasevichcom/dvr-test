// @ts-check
/**
 * Mock catalog. Deterministic (seeded) so the prototype looks the same on every load.
 * Content is neutral and SFW: travel, nature, music, sport, space.
 *
 * Media credits:
 *  - Posters: Unsplash photos served by picsum.photos (Unsplash License).
 *  - flower.mp4, friday.mp4: MDN interactive-examples, CC0 (served with CORS, so they can be
 *    drawn into WebGL textures).
 */

/**
 * @typedef {object} Channel
 * @property {string} name
 * @property {number} hue    Avatar tint (0–360); keeps avatars on-brand without network images.
 * @property {boolean} verified
 */

/**
 * @typedef {object} Video
 * @property {string} id
 * @property {string} title
 * @property {Channel} channel
 * @property {Date} uploadedAt
 * @property {number} durationSec
 * @property {number} views
 * @property {number} likes
 * @property {number} comments
 * @property {boolean} premium     Premium Content (crown mark)
 * @property {boolean} topPick     Curated Top Picks (flame mark)
 * @property {string} poster      16:9 poster image URL.
 * @property {string} [previewSrc] Muted preview clip played on hover / gaze dwell.
 * @property {string} videoSrc     Full video for the player (prototype: the CC0 sample clips).
 */

const NOW = new Date('2026-10-05T12:00:00Z');

/** @type {Channel[]} */
const CHANNELS = [
  { name: 'Horizon Atlas', hue: 210, verified: true },
  { name: 'Northbound VR', hue: 190, verified: true },
  { name: 'Stagefront 360', hue: 330, verified: true },
  { name: 'Deep Blue Lab', hue: 200, verified: false },
  { name: 'Summit Lens', hue: 25, verified: true },
  { name: 'Orbit Collective', hue: 265, verified: false },
  { name: 'Wild Frames', hue: 140, verified: true },
  { name: 'City Pulse', hue: 15, verified: false },
  { name: 'Slow Travel Club', hue: 45, verified: true },
  { name: 'Studio Lumen', hue: 300, verified: true },
  { name: 'Track & Field VR', hue: 0, verified: false },
  { name: 'Quiet Places', hue: 160, verified: false },
];

const TITLES = [
  'Sunrise over the Lofoten Islands',
  'Front Row at a Berlin Techno Set',
  'Swimming with Manta Rays in Komodo',
  'Night Market Walk, Taipei',
  'Above the Clouds: Paragliding the Alps',
  'Inside the Cockpit of a Glider',
  'Northern Lights Timelapse, Iceland',
  'Jazz Quartet Rehearsal, Up Close',
  'Rainforest Canopy at Dawn',
  'Kyoto Temples in the Rain',
  'Desert Dunes at Golden Hour',
  'Courtside: Street Basketball Finals',
  'Orbiting Earth: ISS Window View',
  'Sailing the Greek Islands',
  'Snowboarding Fresh Powder',
  'Venice Canals by Gondola',
  'Coral Reef Meditation',
  'Live Orchestra: Seat in the Strings',
  'Hot Air Balloons over Cappadocia',
  'Tokyo Crossing at Midnight',
  'Glacier Hike in Patagonia',
  'Behind the Scenes: Ballet Rehearsal',
  'Lighthouse Storm Watch',
  'Safari Morning in the Serengeti',
  'Skatepark Session, Barcelona',
  'Cherry Blossoms, Slow Walk',
  'Volcano Rim Expedition',
  'Rooftop Yoga at Sunset',
  'Formula Student Pit Lane',
  'Underwater Cave Diving, Mexico',
  'Mountain Train through Switzerland',
  'Planetarium Show: Journey to Saturn',
];

/** @type {{ src: string }[]} */
const PREVIEWS = [
  { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
  { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4' },
];

/** Every n-th video gets a playable preview clip (a handful are enough for the prototype). */
const PREVIEW_EVERY = 7;

/**
 * Small deterministic PRNG (mulberry32).
 * @param {number} seed
 */
function createRandom(seed) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @template T
 * @param {() => number} random
 * @param {readonly T[]} items
 * @returns {T}
 */
const pick = (random, items) => items[Math.floor(random() * items.length)];

/** @typedef {'for-you' | 'new' | 'trending'} FeedId */

/** @type {Record<FeedId, number>} */
const FEED_SALT = { 'for-you': 20261005, new: 91138233, trending: 52972411 };

/**
 * Infinite feed: every cell of the dome's lattice has its own video, so turning a full circle
 * (or scrolling rows) reaches new content instead of repeating. Deterministic per feed and cell, so
 * no cache is needed: the endless feed would only grow it.
 * @param {number} row
 * @param {number} column  half-integer on offset rows
 * @param {FeedId} [feed]
 * @returns {Video}
 */
export function videoForCell(row, column, feed = 'for-you') {
  // Spread neighbouring cells across the seed space.
  const seed = (Math.imul(row, 73856093) ^ Math.imul(Math.round(column * 2), 19349663) ^ FEED_SALT[feed]) >>> 0;
  const random = createRandom(seed);
  const views = Math.round(2_000 + random() ** 3 * 4_800_000);
  const index = Math.floor(random() * 1_000_000);

  return {
    id: `v${seed.toString(36)}`,
    title: TITLES[index % TITLES.length],
    channel: pick(random, CHANNELS),
    uploadedAt: new Date(NOW.getTime() - Math.round(random() ** 2 * 420) * 86_400_000),
    durationSec: Math.round(180 + random() * 2_400),
    views,
    likes: Math.round(views * (0.02 + random() * 0.06)),
    comments: Math.round(views * (0.001 + random() * 0.004)),
    premium: random() > 0.72,
    topPick: random() > 0.68,
    poster: `https://picsum.photos/seed/deovr-${seed % 1000003}/640/360.webp`,
    previewSrc: index % PREVIEW_EVERY === 0 ? PREVIEWS[index % PREVIEWS.length].src : undefined,
    videoSrc: PREVIEWS[index % PREVIEWS.length].src,
  };
}
