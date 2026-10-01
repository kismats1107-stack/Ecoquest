import { demoPlayers } from '@/data/demoPlayers';
import { dateKey, lastNDays, weekKey } from '@/engine/dates';
import { levelFromXp } from '@/engine/gamification/levels';
import { currentStreak } from '@/engine/gamification/streak';
import { createRng, hashString } from '@/engine/random';
import type { ExperienceMode, LeaderboardEntry, LeaderboardScope, ModeProgress, UserProfile } from '@/types';
import type { RemoteLeaderboardRow } from './storage/firebaseSync';

export function weeklyXpOf(progress: ModeProgress, today: string = dateKey()): number {
  return lastNDays(7, today).reduce((sum, k) => sum + (progress.dailyXp[k] ?? 0), 0);
}

/**
 * Builds the leaderboard from DEMO players (always flagged isDemo), any real learners synced via
 * Firebase, and the current learner — whose position moves as they earn XP.
 */
export function buildLeaderboard(
  mode: ExperienceMode,
  scope: LeaderboardScope,
  me: { profile: UserProfile; progress: ModeProgress },
  remote: RemoteLeaderboardRow[] = [],
  today: string = dateKey(),
): LeaderboardEntry[] {
  const week = weekKey(today);
  const demo: LeaderboardEntry[] = demoPlayers[mode].map((p) => {
    const rng = createRng(hashString(`${p.id}:${week}`));
    const weeklyXp = Math.round(p.weeklyBase * (0.6 + 0.8 * rng()));
    const xp = p.baseXp + Math.round(weeklyXp * 0.25);
    return {
      id: p.id,
      name: p.name,
      avatarId: p.avatarId,
      xp,
      weeklyXp,
      level: levelFromXp(xp).level,
      streak: p.streak,
      isFriend: p.isFriend,
      isDemo: true,
      isCurrentUser: false,
      rank: 0,
      city: p.city,
    };
  });

  const real: LeaderboardEntry[] = remote.map((r) => ({
    id: r.uid,
    name: r.name,
    avatarId: r.avatarId,
    xp: r.xp,
    weeklyXp: r.weeklyXp,
    level: r.level,
    streak: r.streak,
    isFriend: false,
    isDemo: false,
    isCurrentUser: false,
    rank: 0,
  }));

  const self: LeaderboardEntry = {
    id: me.profile.id,
    name: me.profile.name,
    avatarId: me.profile.avatarId,
    xp: me.progress.xp,
    weeklyXp: weeklyXpOf(me.progress, today),
    level: levelFromXp(me.progress.xp).level,
    streak: currentStreak(me.progress.streak, today),
    isFriend: true,
    isDemo: false,
    isCurrentUser: true,
    rank: 0,
  };

  let entries = [...demo, ...real, self];
  if (scope === 'friends') entries = entries.filter((e) => e.isFriend);
  const key = scope === 'weekly' ? 'weeklyXp' : 'xp';
  entries.sort((a, b) => b[key] - a[key] || Number(b.isCurrentUser) - Number(a.isCurrentUser));
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}
