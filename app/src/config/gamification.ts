import type { Difficulty, ExperienceMode } from '@/types';

/** Central tuning for XP, coins and progression. Business logic reads from here — never hard-coded in UI. */
export const GAMIFICATION = {
  startingCoins: 50,
  hintCost: 25,

  /** Coins for a correct answer by difficulty. */
  coinsByDifficulty: { easy: 2, medium: 3, hard: 5 } satisfies Record<Difficulty, number>,

  /** A correct answer within this share of the timer (and without a hint) counts as "fast". */
  fastAnswerShare: 0.35,
  fastBonusXp: 5,
  rapidBonusXp: 5,
  /** Bonus on every answer while the learner is on a 3+ correct-answer combo. */
  comboThreshold: 3,
  comboBonusXp: 5,

  accuracyBonusThreshold: 0.8,
  accuracyBonusXp: 20,
  perfectBonusXp: 50,
  perfectBonusCoins: 20,
  perfectMinQuestions: 5,
  hardAceThreshold: 0.8,

  lessonXp: 10,
  lessonCoins: 5,

  daily: {
    rewardXp: 150,
    rewardCoins: 50,
  },

  /** Mini-game rewards scale between these bounds based on performance. */
  game: {
    minXp: 10,
    maxXp: 50,
    winBaseXp: 20,
    winMinCoins: 5,
    winMaxCoins: 20,
    lossCoins: 2,
  },

  maxStoredAttempts: 60,
  maxStoredGames: 120,
} as const;

export interface DailyChallengeConfig {
  questionCount: number;
  targetAccuracy: number;
  difficulty: Difficulty;
  timePerQuestion: number;
  games: number;
}

export const DAILY_CHALLENGE: Record<ExperienceMode, DailyChallengeConfig> = {
  kids: { questionCount: 8, targetAccuracy: 0.75, difficulty: 'easy', timePerQuestion: 20, games: 1 },
  plus: { questionCount: 10, targetAccuracy: 0.8, difficulty: 'medium', timePerQuestion: 20, games: 1 },
};

/** Default quiz timer per mode — kids get more time to read. */
export const DEFAULT_TIME_PER_QUESTION: Record<ExperienceMode, number> = { kids: 20, plus: 20 };

export interface Rank {
  minLevel: number;
  name: string;
  emoji: string;
  description: string;
}

/** Kids progression: Seedling → Sprout → Explorer → Guardian → Earth Hero. */
export const KIDS_RANKS: Rank[] = [
  { minLevel: 1, name: 'Seedling', emoji: '🌱', description: 'Just starting to grow!' },
  { minLevel: 3, name: 'Sprout', emoji: '🌿', description: 'Growing stronger every day.' },
  { minLevel: 5, name: 'Explorer', emoji: '🧭', description: 'Discovering the wonders of nature.' },
  { minLevel: 7, name: 'Guardian', emoji: '🛡️', description: 'Protecting the planet with pride.' },
  { minLevel: 10, name: 'Earth Hero', emoji: '🦸', description: 'A true champion of the Earth!' },
];

/** 15+ titles by level. */
export const PLUS_TITLES: Rank[] = [
  { minLevel: 1, name: 'Eco Novice', emoji: '🌱', description: 'Building the fundamentals.' },
  { minLevel: 3, name: 'Eco Analyst', emoji: '📊', description: 'Reading the data behind the issues.' },
  { minLevel: 5, name: 'Eco Strategist', emoji: '🧩', description: 'Connecting causes and solutions.' },
  { minLevel: 7, name: 'Eco Leader', emoji: '🏅', description: 'Leading by example.' },
  { minLevel: 10, name: 'Eco Visionary', emoji: '🌐', description: 'Shaping a sustainable future.' },
];
