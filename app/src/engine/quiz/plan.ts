import type { GameId, Topic } from '@/types';

/**
 * Where the 10-second challenges sit inside a quiz. Values are "after N answered questions".
 * 10 questions → after Q3 and Q6, then Q7–Q10 → result.
 */
export function planGameBreaks(questionCount: number, games?: number): number[] {
  if (games === undefined) {
    if (questionCount === 5) return [3];
    if (questionCount === 10) return [3, 6];
    if (questionCount === 15) return [4, 8, 12];
  }
  const count = Math.max(0, Math.min(games ?? Math.round(questionCount / 5), questionCount - 1));
  const breaks = new Set<number>();
  for (let i = 1; i <= count; i++) {
    const at = Math.floor((i * questionCount) / (count + 1));
    if (at >= 1 && at < questionCount) breaks.add(at);
  }
  return [...breaks].sort((a, b) => a - b);
}

/** The game for the n-th break rotates through the topic's reinforcing games. */
export function gameForBreak(topic: Pick<Topic, 'games'>, breakIndex: number): GameId {
  return topic.games[breakIndex % topic.games.length];
}
