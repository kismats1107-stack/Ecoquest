import { addDays } from '@/engine/dates';
import type { StreakState } from '@/types';

export const emptyStreak = (): StreakState => ({ current: 0, best: 0, lastActiveDate: null });

/** Streak as it should be displayed today: a streak survives until the end of the day after the last activity. */
export function currentStreak(streak: StreakState, today: string): number {
  if (!streak.lastActiveDate) return 0;
  if (streak.lastActiveDate === today || streak.lastActiveDate === addDays(today, -1)) return streak.current;
  return 0;
}

/** Records learning activity on `today`, extending or restarting the streak. Idempotent within a day. */
export function registerActivity(streak: StreakState, today: string): StreakState {
  if (streak.lastActiveDate === today) return streak;
  const continues = streak.lastActiveDate === addDays(today, -1);
  const current = continues ? streak.current + 1 : 1;
  return { current, best: Math.max(streak.best, current), lastActiveDate: today };
}
