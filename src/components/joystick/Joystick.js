// @ts-check
import { h } from '../../lib/dom.js';
import { Tooltip } from '../tooltip/Tooltip.js';

const DRAG_THRESHOLD_PX = 4;
/** Taps closer to the center than this share of the radius are ignored (no direction). */
const TAP_DEAD_ZONE = 0.2;

/**
 * Virtual thumbstick for browsing the dome in any direction.
 *  - Drag the knob: continuous movement; the vector (x right, y up, length ≤ 1) is reported each
 *    pointer move, and `onRelease` fires when the knob springs back.
 *  - Tap the base: one step in that direction (`onStep` with the angle, rad, 0 = right, CCW).
 * Rim ticks mark the step directions (`setDirections`): main ones as dots, minor (diagonal) ones smaller.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {(x: number, y: number) => void} props.onMove
 * @param {() => void} props.onRelease
 * @param {(angle: number) => void} props.onStep
 */
export function Joystick({ label, onMove, onRelease, onStep }) {
  const knob = h('span', { class: 'joystick__knob', 'aria-hidden': 'true' });
  const ticks = h('span', { class: 'joystick__ticks', 'aria-hidden': 'true' });
  const base = h('div', { class: 'joystick__base' }, ticks, knob);
  const el = h(
    'div',
    { class: 'joystick', role: 'group', 'aria-label': label },
    base,
    Tooltip({ label: 'Drag to browse · tap to step', placement: 'above' }),
  );

  /** @type {{ id: number, startX: number, startY: number, dragging: boolean } | null} */
  let pointer = null;

  const center = () => {
    const rect = base.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, radius: rect.width / 2 };
  };

  base.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    base.setPointerCapture(event.pointerId);
    pointer = { id: event.pointerId, startX: event.clientX, startY: event.clientY, dragging: false };
  });

  base.addEventListener('pointermove', (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    if (!pointer.dragging && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) < DRAG_THRESHOLD_PX) return;
    pointer.dragging = true;
    el.dataset.active = 'true';
    // The knob is dragged from wherever it was grabbed; its travel is limited to the base radius.
    const { radius } = center();
    let dx = event.clientX - pointer.startX;
    let dy = event.clientY - pointer.startY;
    const length = Math.hypot(dx, dy);
    if (length > radius) {
      dx = (dx / length) * radius;
      dy = (dy / length) * radius;
    }
    knob.style.translate = `${dx}px ${dy}px`;
    onMove(dx / radius, -dy / radius);
  });

  /** @param {PointerEvent} event */
  const end = (event) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const wasDragging = pointer.dragging;
    pointer = null;
    el.dataset.active = 'false';
    knob.style.translate = '';
    if (wasDragging) {
      onRelease();
      return;
    }
    const { x, y, radius } = center();
    const dx = event.clientX - x;
    const dy = event.clientY - y;
    if (Math.hypot(dx, dy) > radius * TAP_DEAD_ZONE) onStep(Math.atan2(-dy, dx));
  };
  base.addEventListener('pointerup', end);
  base.addEventListener('pointercancel', end);

  return {
    el,
    /**
     * Places one tick per step direction.
     * @param {{ angle: number, minor?: boolean }[]} directions  angle in rad, 0 = right, counter-clockwise
     */
    setDirections(directions) {
      ticks.replaceChildren(
        ...directions.map(({ angle, minor }) =>
          h('span', { class: ['joystick__tick', minor && 'joystick__tick--minor'], style: { '--tick-angle': `${-angle}rad` } }),
        ),
      );
    },
  };
}
