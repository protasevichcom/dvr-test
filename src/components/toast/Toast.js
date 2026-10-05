// @ts-check
import { h } from '../../lib/dom.js';
import { readDurationToken } from '../../lib/tokens.js';

/**
 * Single polite status message (announced by screen readers via role="status").
 */
export function Toast() {
  const title = h('strong', { class: 'toast__title' });
  const detail = h('span', { class: 'toast__detail' });
  const el = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }, title, detail);

  /** @type {number | undefined} */
  let timer;

  return {
    el,
    /**
     * @param {string} heading
     * @param {string} [body]
     */
    show(heading, body = '') {
      title.textContent = heading;
      detail.textContent = body;
      el.dataset.visible = 'true';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        el.dataset.visible = 'false';
      }, readDurationToken('--toast-duration'));
    },
  };
}
