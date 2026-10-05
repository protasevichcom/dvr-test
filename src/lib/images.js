// @ts-check
/**
 * Pictures for WebGL textures. They are fetched and decoded off the main thread
 * (`createImageBitmap`), so a texture upload never decodes an image synchronously inside a frame.
 * Where that is unavailable, an <img> is decoded with `decode()` before it is handed over.
 */

/** @typedef {ImageBitmap | HTMLImageElement} Picture */

/**
 * @param {string} src
 * @param {AbortSignal} [signal]  aborts the download (e.g. the card left the view)
 * @returns {Promise<Picture>}
 */
export async function loadPicture(src, signal) {
  if (typeof createImageBitmap === 'function') {
    try {
      const response = await fetch(src, { mode: 'cors', signal });
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${src}`);
      // Pre-flipped: WebGL's UNPACK_FLIP_Y does not apply to ImageBitmap (see isPreflipped).
      return await createImageBitmap(await response.blob(), { imageOrientation: 'flipY' });
    } catch (error) {
      if (signal?.aborted) throw error;
      // Fall back to an <img> below (e.g. createImageBitmap options unsupported).
    }
  }
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.src = src;
  await image.decode();
  if (signal?.aborted) throw signal.reason;
  return image;
}

/** URLs already warmed in the HTTP cache (bounded: cleared when it grows past this). */
const warmed = new Set();
const WARMED_LIMIT = 4000;

/**
 * Downloads a picture into the HTTP cache at low priority, without decoding or keeping it, so a later
 * `loadPicture` of the same URL only has to decode. Repeated calls for a URL are ignored.
 * @param {string} src
 */
export function prefetchPicture(src) {
  if (warmed.has(src)) return;
  if (warmed.size >= WARMED_LIMIT) warmed.clear();
  warmed.add(src);
  // `priority` is a Fetch Priority hint (Chromium); other browsers ignore it.
  fetch(src, /** @type {RequestInit} */ ({ mode: 'cors', priority: 'low' }))
    .then((response) => response.blob())
    .catch(() => warmed.delete(src));
}

/**
 * Whether a texture source is already flipped for WebGL (so the texture must not flip it again).
 * @param {unknown} source
 */
export function isPreflipped(source) {
  return typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap;
}

/**
 * Frees a picture's decoded pixels (ImageBitmap); a no-op for <img>, which the browser manages.
 * @param {Picture | null | undefined} picture
 */
export function releasePicture(picture) {
  if (picture && isPreflipped(picture)) /** @type {ImageBitmap} */ (picture).close();
}
