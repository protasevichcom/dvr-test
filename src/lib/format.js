// @ts-check
/** Display formatting for catalog metadata. */

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const fullDate = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });

/** @param {number} value */
export const formatCount = (value) => compact.format(value);

/** @param {number} seconds */
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/** @param {Date} date */
export const formatFullDate = (date) => fullDate.format(date);

/**
 * Compact upload age: "today", "3d ago", "2w ago", "5mo ago", "1y ago".
 * @param {Date} date
 * @param {Date} [now]
 */
export function formatRelativeDate(date, now = new Date()) {
  const days = Math.max(0, Math.round((now.getTime() - date.getTime()) / 86_400_000));
  if (days === 0) return 'today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}
