// @ts-check
import { h } from '../../lib/dom.js';

/**
 * Full-screen circular vignette above the dome: clear in the middle, almost black at the edges.
 * Frames the gaze like a headset lens and sinks the periphery of the dome into darkness.
 */
export function ScreenVignette() {
  return h('div', { class: 'screen-vignette', 'aria-hidden': 'true' });
}
