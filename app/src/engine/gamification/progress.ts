import { GAMIFICATION } from '@/config/gamification';
import type { GameRecord, ModeProgress, ModeStats, QuizAttempt, RewardOutcome } from '@/types';
import { unlockBadges } from './badges';
import { levelFromXp } from './levels';
import { currentStreak, emptyStreak, registerActivity } from './streak';

/**
 * Pure functions that commit learning activity to a learner's progress.
 * Every function returns a new progress object plus a RewardOutcome for the celebration UI.
 */

export function emptyStats(): ModeStats {
  return {
    questionsAnswered: 0,
    correctAnswers: 0,
    quizzesCompleted: 0,
    perfectQuizzes: 0,
    hardQuizzesAced: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    dailyCompleted: 0,
    hintsUsed: 0,
    fastAnswers: 0,
    lessonsCompleted: 0,
    xpEarned: 0,
    coinsEarned: 0,
  };
}

export function emptyProgress(): ModeProgress {
  return {
    xp: 0,
    coins: GAMIFICATION.startingCoins,
    streak: emptyStreak(),
    stats: emptyStats(),
    topicStats: {},
    badges: {},
    attempts: [],
    games: [],
    lessons: {},
    dailyXp: {},
    daily: null,
    bestGameScores: {},
  };
}

/** Adds XP/coins, records the day's activity, updates the streak and unlocks badges. */
function finalize(prev: ModeProgress, draft: ModeProgress, xp: number, coins: number, today: string, now: number) {
  const streak = registerActivity(draft.streak, today);
  const withRewards: ModeProgress = {
    ...draft,
    xp: draft.xp + xp,
    coins: draft.coins + coins,
    streak,
    stats: { ...draft.stats, xpEarned: draft.stats.xpEarned + xp, coinsEarned: draft.stats.coinsEarned + coins },
    dailyXp: { ...draft.dailyXp, [today]: (draft.dailyXp[today] ?? 0) + xp },
  };
  const { badges, newBadges } = unlockBadges(withRewards, now);
  const progress = { ...withRewards, badges };
  const outcome: RewardOutcome = {
    xpGained: xp,
    coinsGained: coins,
    levelBefore: levelFromXp(prev.xp).level,
    levelAfter: levelFromXp(progress.xp).level,
    newBadges,
    streakBefore: currentStreak(prev.streak, today),
    streakAfter: streak.current,
  };
  return { progress, outcome };
}

function recordGames(progress: ModeProgress, games: GameRecord[]): ModeProgress {
  const played = games.filter((g) => !g.skipped);
  if (!played.length) return progress;
  const best = { ...progress.bestGameScores };
  for (const g of played) best[g.gameId] = Math.max(best[g.gameId] ?? 0, g.score);
  return {
    ...progress,
    games: [...played, ...progress.games].slice(0, GAMIFICATION.maxStoredGames),
    bestGameScores: best,
    stats: {
      ...progress.stats,
      gamesPlayed: progress.stats.gamesPlayed + played.length,
      gamesWon: progress.stats.gamesWon + played.filter((g) => g.success).length,
    },
  };
}

export function applyQuizAttempt(prev: ModeProgress, attempt: QuizAttempt, today: string, now: number) {
  const fast = attempt.answers.filter((a) => a.fast).length;
  const perfect = attempt.total >= GAMIFICATION.perfectMinQuestions && attempt.score === attempt.total;
  const hardAce = attempt.difficulty === 'hard' && attempt.accuracy >= GAMIFICATION.hardAceThreshold;
  const topic = prev.topicStats[attempt.topicId];
  const dailyFirstSuccess = attempt.isDaily && attempt.dailySuccess && !(prev.daily?.dateKey === today && prev.daily.completed);

  let draft: ModeProgress = {
    ...prev,
    stats: {
      ...prev.stats,
      questionsAnswered: prev.stats.questionsAnswered + attempt.total,
      correctAnswers: prev.stats.correctAnswers + attempt.score,
      quizzesCompleted: prev.stats.quizzesCompleted + 1,
      perfectQuizzes: prev.stats.perfectQuizzes + (perfect ? 1 : 0),
      hardQuizzesAced: prev.stats.hardQuizzesAced + (hardAce ? 1 : 0),
      fastAnswers: prev.stats.fastAnswers + fast,
      dailyCompleted: prev.stats.dailyCompleted + (dailyFirstSuccess ? 1 : 0),
    },
    topicStats: {
      ...prev.topicStats,
      [attempt.topicId]: {
        answered: (topic?.answered ?? 0) + attempt.total,
        correct: (topic?.correct ?? 0) + attempt.score,
        quizzes: (topic?.quizzes ?? 0) + 1,
        bestAccuracy: Math.max(topic?.bestAccuracy ?? 0, attempt.accuracy),
        lastAccuracy: attempt.accuracy,
        lastDifficulty: attempt.difficulty,
      },
    },
    attempts: [attempt, ...prev.attempts].slice(0, GAMIFICATION.maxStoredAttempts),
  };

  if (attempt.isDaily) {
    const sameDay = prev.daily?.dateKey === today ? prev.daily : null;
    draft.daily = {
      dateKey: today,
      completed: (sameDay?.completed ?? false) || attempt.dailySuccess,
      attempts: (sameDay?.attempts ?? 0) + 1,
      bestAccuracy: Math.max(sameDay?.bestAccuracy ?? 0, attempt.accuracy),
    };
  }

  draft = recordGames(draft, attempt.games);
  return finalize(prev, draft, attempt.xpEarned, attempt.coinsEarned, today, now);
}

/** Commits a standalone 10-second challenge (games played inside a quiz are committed with the quiz). */
export function applyGameResult(prev: ModeProgress, record: GameRecord, today: string, now: number) {
  const draft = recordGames(prev, [record]);
  return finalize(prev, draft, record.xp, record.coins, today, now);
}

export function applyLessonComplete(prev: ModeProgress, topicId: string, today: string, now: number) {
  if (prev.lessons[topicId]) return null;
  const draft: ModeProgress = {
    ...prev,
    lessons: { ...prev.lessons, [topicId]: now },
    stats: { ...prev.stats, lessonsCompleted: prev.stats.lessonsCompleted + 1 },
  };
  return finalize(prev, draft, GAMIFICATION.lessonXp, GAMIFICATION.lessonCoins, today, now);
}

/** Spends coins on a hint. Returns null when the learner can't afford it. */
export function spendHint(prev: ModeProgress): ModeProgress | null {
  const cost = GAMIFICATION.hintCost;
  if (prev.coins < cost) return null;
  return { ...prev, coins: prev.coins - cost, stats: { ...prev.stats, hintsUsed: prev.stats.hintsUsed + 1 } };
}

export function overallAccuracy(progress: ModeProgress): number {
  const { questionsAnswered, correctAnswers } = progress.stats;
  return questionsAnswered ? correctAnswers / questionsAnswered : 0;
}

/** Mastery of a topic (0–1): accuracy weighted by how much the learner has practised it. */
export function topicMastery(progress: ModeProgress, topicId: string): number {
  const stat = progress.topicStats[topicId];
  const lessonBonus = progress.lessons[topicId] ? 0.1 : 0;
  if (!stat || stat.answered === 0) return lessonBonus;
  const accuracy = stat.correct / stat.answered;
  const coverage = Math.min(1, stat.answered / 15);
  return Math.min(1, accuracy * (0.4 + 0.6 * coverage) + lessonBonus);
}
