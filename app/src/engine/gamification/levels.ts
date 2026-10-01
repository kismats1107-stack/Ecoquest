import { KIDS_RANKS, PLUS_TITLES, type Rank } from '@/config/gamification';
import type { ExperienceMode, LevelInfo } from '@/types';

/** Total XP required to reach `level`: 0, 100, 300, 600, 1000, 1500 … (50·L·(L−1)). */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(xp));
  let level = 1;
  while (xpForLevel(level + 1) <= safeXp) level++;
  const levelStartXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpForThisLevel = nextLevelXp - levelStartXp;
  const xpIntoLevel = safeXp - levelStartXp;
  return {
    level,
    xp: safeXp,
    levelStartXp,
    nextLevelXp,
    xpIntoLevel,
    xpForLevel: xpForThisLevel,
    progress: xpForThisLevel > 0 ? xpIntoLevel / xpForThisLevel : 1,
  };
}

export function rankFor(mode: ExperienceMode, level: number): Rank {
  const ranks = mode === 'kids' ? KIDS_RANKS : PLUS_TITLES;
  let current = ranks[0];
  for (const r of ranks) if (level >= r.minLevel) current = r;
  return current;
}

export function nextRank(mode: ExperienceMode, level: number): Rank | null {
  const ranks = mode === 'kids' ? KIDS_RANKS : PLUS_TITLES;
  return ranks.find((r) => r.minLevel > level) ?? null;
}
