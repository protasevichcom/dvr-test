// @ts-check
import { h } from '../../lib/dom.js';

/**
 * Even, translucent black layer between the room and the interface; keeps the UI legible.
 * The circular falloff to black lives in ScreenVignette, above the dome.
 */
export function SceneShade() {
  return h('div', { class: 'scene-shade', 'aria-hidden': 'true' });
}
