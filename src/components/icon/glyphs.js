// @ts-check
/**
 * Icon set: 24×24 outline glyphs, drawn for this prototype in a single consistent style.
 * Each entry is a list of SVG child specs: [tagName, attributes].
 * @typedef {[string, Record<string, string | number>][]} Glyph
 * @satisfies {Record<string, Glyph>}
 */
export const GLYPHS = {
  home: [['path', { d: 'M3.5 10.2 12 3.5l8.5 6.7V19a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-5v6H5A1.5 1.5 0 0 1 3.5 19z' }]],
  search: [
    ['circle', { cx: 11, cy: 11, r: 6.5 }],
    ['path', { d: 'm20 20-4.2-4.2' }],
  ],
  categories: [
    ['rect', { x: 4, y: 4, width: 6.5, height: 6.5, rx: 1.6 }],
    ['rect', { x: 13.5, y: 4, width: 6.5, height: 6.5, rx: 1.6 }],
    ['rect', { x: 4, y: 13.5, width: 6.5, height: 6.5, rx: 1.6 }],
    ['rect', { x: 13.5, y: 13.5, width: 6.5, height: 6.5, rx: 1.6 }],
  ],
  channels: [
    ['circle', { cx: 9, cy: 8.5, r: 3.5 }],
    ['path', { d: 'M2.5 20c.8-3.4 3.3-5.5 6.5-5.5s5.7 2.1 6.5 5.5' }],
    ['path', { d: 'M15.5 5.2a3.5 3.5 0 0 1 0 6.6' }],
    ['path', { d: 'M18 14.9c1.8.8 3 2.5 3.5 5.1' }],
  ],
  premium: [['path', { d: 'M3.5 8.5 8 12l4-6.5 4 6.5 4.5-3.5-1.8 10H5.3z' }]],
  diamond: [
    ['path', { d: 'M7 4.5h10l3.5 4.8L12 20 3.5 9.3z' }],
    ['path', { d: 'M3.5 9.3h17' }],
    ['path', { d: 'M9.8 4.5 8.3 9.3 12 20l3.7-10.7-1.5-4.8' }],
  ],
  library: [['path', { d: 'M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.2-6.5 4.2v-16a1 1 0 0 1 1-1z' }]],
  monitor: [
    ['rect', { x: 3, y: 4.5, width: 18, height: 12, rx: 2 }],
    ['path', { d: 'M12 16.5V20' }],
    ['path', { d: 'M8.5 20h7' }],
  ],
  headset: [
    ['path', { d: 'M3 9.5A2.5 2.5 0 0 1 5.5 7h13A2.5 2.5 0 0 1 21 9.5v5a2.5 2.5 0 0 1-2.5 2.5h-3.2l-1.8-2.3h-3l-1.8 2.3H5.5A2.5 2.5 0 0 1 3 14.5z' }],
  ],
  user: [
    ['circle', { cx: 12, cy: 8, r: 4 }],
    ['path', { d: 'M4.5 20.5c1-3.8 3.9-5.8 7.5-5.8s6.5 2 7.5 5.8' }],
  ],
  close: [['path', { d: 'm6.5 6.5 11 11m0-11-11 11' }]],
  soundOff: [
    ['path', { d: 'M3.5 9.5h3.5l4.5-4v13l-4.5-4H3.5z' }],
    ['path', { d: 'm15.5 9.5 5 5m0-5-5 5' }],
  ],
  chevronLeft: [['path', { d: 'm14.5 5.5-6.5 6.5 6.5 6.5' }]],
  chevronRight: [['path', { d: 'm9.5 5.5 6.5 6.5-6.5 6.5' }]],
  eye: [
    [
      'path',
      {
        d: 'M12 5C6.5 5 3 10 2.2 11.4a1.2 1.2 0 0 0 0 1.2C3 14 6.5 19 12 19s9-5 9.8-6.4a1.2 1.2 0 0 0 0-1.2C21 10 17.5 5 12 5zm0 3.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8z',
        fill: 'currentColor',
        stroke: 'none',
        'fill-rule': 'evenodd',
      },
    ],
  ],
  heart: [
    [
      'path',
      {
        d: 'M12 20.3s-7.6-4.6-9.2-9.4C1.7 7.5 4 4.3 7.3 4.3c2 0 3.5 1.1 4.7 2.8 1.2-1.7 2.7-2.8 4.7-2.8 3.3 0 5.6 3.2 4.5 6.6-1.6 4.8-9.2 9.4-9.2 9.4z',
        fill: 'currentColor',
        stroke: 'none',
      },
    ],
  ],
  comment: [
    [
      'path',
      {
        d: 'M12 3.5c-5 0-9 3.6-9 8.1 0 2.2 1 4.2 2.6 5.7L5 21l4.2-1.7c.9.3 1.8.4 2.8.4 5 0 9-3.6 9-8.1s-4-8.1-9-8.1zM8 10.4h5.5a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2z',
        fill: 'currentColor',
        stroke: 'none',
        'fill-rule': 'evenodd',
      },
    ],
  ],
  play: [['path', { d: 'M8 5.8v12.4a.8.8 0 0 0 1.2.7l10-6.2a.8.8 0 0 0 0-1.4l-10-6.2A.8.8 0 0 0 8 5.8z', fill: 'currentColor', stroke: 'none' }]],
  verified: [
    ['circle', { cx: 12, cy: 12, r: 8.5 }],
    ['path', { d: 'm8.5 12.2 2.4 2.4 4.7-4.8' }],
  ],
  // Brand feature marks from deovr.com (raw/brand/deovr-feature-icons-2026-10-05.svg), filled.
  featurePremium: [['path', { d: 'm20.413 6.841-4.028 2.902a1.01 1.01 0 0 1-1.531-.466L12.95 4.162c-.322-.883-1.561-.883-1.883 0L9.153 9.266a.99.99 0 0 1-1.52.467l-4.03-2.902c-.805-.568-1.873.233-1.54 1.177l4.19 11.822a1 1 0 0 0 .946.67h9.599c.423 0 .805-.274.946-.67l4.19-11.822c.343-.944-.725-1.745-1.52-1.167m-5.892 9.367H9.485a.764.764 0 0 1-.755-.762c0-.416.342-.76.755-.76h5.036c.413 0 .756.344.756.76a.764.764 0 0 1-.756.761', fill: 'currentColor', stroke: 'none' }]],
  featureTopPicks: [['path', { d: 'M13.442 1.673a.75.75 0 0 0-1.184.32l-2.063 5.663L7.93 5.462a.75.75 0 0 0-1.118.083C4.782 8.205 3.75 10.882 3.75 13.5a8.25 8.25 0 1 0 16.5 0c0-5.574-4.762-10.125-6.808-11.827m3.798 12.703a5.4 5.4 0 0 1-4.365 4.364.75.75 0 1 1-.248-1.48c1.553-.261 2.87-1.58 3.134-3.136a.75.75 0 0 1 1.48.252z', fill: 'currentColor', stroke: 'none' }]],
};

/** @typedef {keyof typeof GLYPHS} IconName */
