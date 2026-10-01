import { DAILY_CHALLENGE, GAMIFICATION, type DailyChallengeConfig } from '@/config/gamification';
import { getTopics } from '@/data';
import type { ExperienceMode, ModeProgress, Topic } from '@/types';
import { hashString } from './random';

export interface DailyChallenge {
  dateKey: string;
  topic: Topic;
  config: DailyChallengeConfig;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
  attempts: number;
  bestAccuracy: number;
}

/** Today's Eco Challenge: one topic per day per mode, rotating deterministically. */
export function dailyChallengeFor(mode: ExperienceMode, today: string, progress: ModeProgress): DailyChallenge {
  const topics = getTopics(mode);
  const topic = topics[hashString(`${mode}:${today}`) % topics.length];
  const state = progress.daily?.dateKey === today ? progress.daily : null;
  return {
    dateKey: today,
    topic,
    config: DAILY_CHALLENGE[mode],
    rewardXp: GAMIFICATION.daily.rewardXp,
    rewardCoins: GAMIFICATION.daily.rewardCoins,
    completed: state?.completed ?? false,
    attempts: state?.attempts ?? 0,
    bestAccuracy: state?.bestAccuracy ?? 0,
  };
}
