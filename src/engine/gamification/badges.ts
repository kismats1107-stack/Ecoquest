import { badgeDefinitions, type BadgeDefinition } from '@/data/badges';
import { getTopic } from '@/data';
import type { BadgeProgress, ModeProgress } from '@/types';
import { levelFromXp } from './levels';

function metricValue(def: BadgeDefinition, progress: ModeProgress): number {
  const m = def.metric;
  switch (m.kind) {
    case 'stat':
      return progress.stats[m.stat];
    case 'bestStreak':
      return progress.streak.best;
    case 'level':
      return levelFromXp(progress.xp).level;
    case 'groupCorrect':
      return Object.entries(progress.topicStats).reduce((sum, [topicId, stat]) => {
        const topic = getTopic(topicId);
        return topic && m.groups.includes(topic.group) ? sum + stat.correct : sum;
      }, 0);
  }
}

export function badgeProgress(progress: ModeProgress): BadgeProgress[] {
  return badgeDefinitions.map((def) => {
    const current = metricValue(def, progress);
    const unlockedAt = progress.badges[def.id];
    return {
      id: def.id,
      current: Math.min(current, def.target),
      target: def.target,
      unlocked: unlockedAt !== undefined || current >= def.target,
      unlockedAt,
    };
  });
}

/** Unlocks every badge whose requirement is now met. Returns the updated badge map and the newly unlocked ids. */
export function unlockBadges(progress: ModeProgress, now: number): { badges: Record<string, number>; newBadges: string[] } {
  const badges = { ...progress.badges };
  const newBadges: string[] = [];
  for (const def of badgeDefinitions) {
    if (badges[def.id] !== undefined) continue;
    if (metricValue(def, progress) >= def.target) {
      badges[def.id] = now;
      newBadges.push(def.id);
    }
  }
  return { badges, newBadges };
}
