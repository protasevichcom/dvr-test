// @ts-check
/**
 * Featured banners for the home hero (the banner gallery on the dome).
 * Images: Unsplash photos served by picsum.photos (Unsplash License), wide crops.
 */

/**
 * @typedef {object} Banner
 * @property {string} id
 * @property {string} title
 * @property {string} image   wide image URL
 */

/** Fixed photo ids, so each image matches its title. */
const image = (/** @type {number} */ id) => `https://picsum.photos/id/${id}/1600/560.webp`;

/** @type {Banner[]} */
export const BANNERS = [
  { id: 'b1', title: 'Golden Hour over the Countryside', image: image(110) },
  { id: 'b2', title: 'Above the Snowline: Alpine Ridges', image: image(29) },
  { id: 'b3', title: 'Sea Gates of the Andaman Coast', image: image(218) },
  { id: 'b4', title: 'Brooklyn Bridge by Night', image: image(249) },
  { id: 'b5', title: 'Desert Dunes Under the Stars', image: image(184) },
  { id: 'b6', title: 'Tuscan Hills at First Light', image: image(116) },
  { id: 'b7', title: 'Into the Waterfall Canyon', image: image(15) },
];
