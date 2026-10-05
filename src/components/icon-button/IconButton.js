// @ts-check
import { h } from '../../lib/dom.js';
import { Icon } from '../icon/Icon.js';
import { Tooltip } from '../tooltip/Tooltip.js';

/**
 * Round icon-only button with a built-in tooltip.
 * The tooltip appears on hover (mouse, or the controller ray in headsets) and on keyboard focus,
 * so it never depends on hover alone (wiki/concepts/vr-input-models.md).
 *
 * @param {object} props
 * @param {import('../icon/Icon.js').IconName} props.icon
 * @param {string} props.label             Accessible name and tooltip text.
 * @param {'below' | 'above'} [props.tooltipPlacement]
 * @param {'ghost' | 'glass' | 'accent'} [props.variant]  accent: the brand call to action (e.g. Get Premium)
 * @param {boolean} [props.current]       Marks the current page item.
 * @param {boolean} [props.pressed]       Renders a toggle button (aria-pressed).
 * @param {(event: MouseEvent) => void} [props.onClick]
 */
export function IconButton({ icon, label, tooltipPlacement = 'below', variant = 'ghost', current, pressed, onClick }) {
  const button = h(
    'button',
    {
      type: 'button',
      class: ['icon-button', `icon-button--${variant}`],
      'aria-label': label,
      'aria-current': current ? 'page' : undefined,
      'aria-pressed': pressed === undefined ? undefined : String(pressed),
      onClick,
    },
    Icon({ name: icon }),
    Tooltip({ label, placement: tooltipPlacement }),
  );

  return {
    el: button,
    /** @param {boolean} value */
    setPressed(value) {
      button.setAttribute('aria-pressed', String(value));
    },
  };
}
