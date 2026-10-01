/** Local-calendar date helpers. Streaks and daily challenges are based on the learner's local day. */

const pad = (n: number) => String(n).padStart(2, '0');

export function dateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

/** Whole days from `a` to `b` (positive when b is later). */
export function daysBetween(a: string, b: string): number {
  const ms = parseDateKey(b).getTime() - parseDateKey(a).getTime();
  return Math.round(ms / 86_400_000);
}

/** The last `n` local days ending today, oldest first. */
export function lastNDays(n: number, today: string = dateKey()): string[] {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}

export function weekdayShort(key: string): string {
  return parseDateKey(key).toLocaleDateString('en', { weekday: 'short' });
}

/** Monday-based ISO-ish week key used to vary demo leaderboard numbers week to week. */
export function weekKey(key: string = dateKey()): string {
  const d = parseDateKey(key);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return dateKey(d);
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m ${pad(s)}s` : `${s}s`;
}

export function formatRelative(timestamp: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - timestamp);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString('en', { day: 'numeric', month: 'short' });
}
