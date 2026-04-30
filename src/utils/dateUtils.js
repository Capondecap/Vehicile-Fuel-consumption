/**
 * dateUtils.js  — Person 3
 *
 * Pure date helpers used by the statistics service.
 * No Express dependencies — safe to unit-test in isolation.
 */

/**
 * Returns the ISO 8601 week label for a date string.
 * e.g. '2025-06-15' → '2025-W24'
 *
 * ISO week rule: week 1 is the week containing the first Thursday of the year.
 */
function getISOWeekLabel(dateStr) {
  const d = new Date(dateStr);

  // Shift to nearest Thursday (ISO weeks start Monday, Thursday is the anchor)
  const dayOfWeek = (d.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  d.setUTCDate(d.getUTCDate() - dayOfWeek + 3);

  // Week number relative to Jan 4 of that year (always in week 1)
  const jan4 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const weekNum = Math.ceil(((d - jan4) / 86400000 + 1) / 7);

  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * Returns 'YYYY-MM' label for a date string.
 * e.g. '2025-06-15' → '2025-06'
 */
function getMonthLabel(dateStr) {
  // dateStr is already ISO format YYYY-MM-DD
  return String(dateStr).slice(0, 7);
}

/**
 * Human-readable month label for display.
 * e.g. '2025-06' → 'June 2025'
 */
function formatMonthLabel(yearMonth) {
  const [year, month] = yearMonth.split('-');
  const d = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/**
 * Human-readable date label for display.
 * e.g. '2025-06-15' → 'June 15, 2025'
 */
function formatDate(dateStr) {
  const [year, month, day] = String(dateStr).split('-');
  const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

module.exports = { getISOWeekLabel, getMonthLabel, formatMonthLabel, formatDate };