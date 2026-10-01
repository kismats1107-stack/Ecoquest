/** Helpers for building calculation questions with plausible, distinct numeric distractors. */

export function formatNumber(n: number): string {
  if (Math.abs(n) >= 100) return Math.round(n).toLocaleString('en');
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * Returns the correct label plus three distinct wrong labels.
 * `candidates` are typical mistakes (forgot the return trip, wrong unit…); extra multipliers fill any gaps.
 */
export function numericOptions(correct: number, candidates: number[], unit: string): { correct: string; wrong: string[] } {
  const label = (n: number) => `${formatNumber(n)} ${unit}`.trim();
  const correctLabel = label(correct);
  const seen = new Set([correctLabel]);
  const wrong: string[] = [];
  const fallbacks = [0.5, 2, 1.5, 3, 10, 0.25, 4];
  for (const value of [...candidates, ...fallbacks.map((m) => correct * m)]) {
    if (wrong.length === 3) break;
    if (!Number.isFinite(value) || value <= 0) continue;
    const l = label(value);
    if (seen.has(l)) continue;
    seen.add(l);
    wrong.push(l);
  }
  return { correct: correctLabel, wrong };
}
