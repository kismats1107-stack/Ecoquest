import type { Difficulty, ExperienceMode, QuestionData, QuestionType, Quiz, QuizSource } from '@shared/quizContract';

export type {
  DataPoint,
  Difficulty,
  ExperienceMode,
  QuestionData,
  QuestionType,
  Quiz,
  QuizQuestion,
  QuizRequest,
  QuizSource,
} from '@shared/quizContract';

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

export type TopicGroup =
  | 'planet'
  | 'water'
  | 'waste'
  | 'energy'
  | 'forests'
  | 'biodiversity'
  | 'air'
  | 'living'
  | 'climate'
  | 'development';

/** Tailwind-safe colour family used to tint a topic's cards. */
export type TopicTone = 'emerald' | 'sky' | 'amber' | 'orange' | 'lime' | 'teal' | 'violet' | 'rose' | 'cyan' | 'slate';

export type GameId = 'recycle-sort' | 'memory-match' | 'clean-ocean' | 'carbon-footprint' | 'food-web' | 'eco-decisions';

export interface Topic {
  id: string;
  mode: ExperienceMode;
  name: string;
  emoji: string;
  tone: TopicTone;
  tagline: string;
  /** Scope description — shown on cards and sent to the AI generator to keep it on-topic. */
  summary: string;
  group: TopicGroup;
  /** Mini-games that reinforce this topic, in preferred order. */
  games: GameId[];
  /** Topics to recommend after mastering this one. */
  related: string[];
}

export interface LessonSection {
  heading: string;
  body: string;
  emoji?: string;
  bullets?: string[];
  fact?: string;
}

export interface Lesson {
  topicId: string;
  title: string;
  intro: string;
  sections: LessonSection[];
  keyStats?: { value: string; label: string }[];
  keyTerms?: { term: string; definition: string }[];
  mythFact?: { myth: string; fact: string };
  takeaway: string;
}

/** A question as authored in the offline bank (correct answer kept separate from distractors). */
export interface BankQuestion {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  correct: string;
  wrong: string[];
  explanation: string;
  hint: string;
  context?: string;
  visual?: string;
  data?: QuestionData;
}

/** Generates fresh, parameterised questions (e.g. calculations) for the offline bank. */
export interface QuestionTemplate {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  generate: (rng: () => number) => BankQuestion;
}

/* ------------------------------------------------------------------ */
/* Player                                                              */
/* ------------------------------------------------------------------ */

export interface UserProfile {
  id: string;
  name: string;
  avatarId: string;
  activeMode: ExperienceMode;
  createdAt: number;
  isDemo: boolean;
}

export interface StreakState {
  current: number;
  best: number;
  /** Local date key (YYYY-MM-DD) of the last day with learning activity. */
  lastActiveDate: string | null;
}

export interface AnswerRecord {
  questionId: string;
  selected: number | null;
  correct: boolean;
  timedOut: boolean;
  timeMs: number;
  usedHint: boolean;
  fast: boolean;
  xp: number;
  coins: number;
}

export interface GameRecord {
  gameId: GameId;
  score: number;
  target: number;
  success: boolean;
  skipped: boolean;
  xp: number;
  coins: number;
  playedAt: number;
  topicId?: string;
  /** Context the game was played in. */
  context: 'quiz' | 'standalone';
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  experienceMode: ExperienceMode;
  source: QuizSource;
  questions: Quiz['questions'];
  answers: AnswerRecord[];
  games: GameRecord[];
  score: number;
  total: number;
  accuracy: number;
  timeTakenMs: number;
  xpEarned: number;
  coinsEarned: number;
  completedAt: number;
  isDaily: boolean;
  dailySuccess: boolean;
}

export interface TopicStat {
  answered: number;
  correct: number;
  quizzes: number;
  bestAccuracy: number;
  lastAccuracy: number;
  lastDifficulty: Difficulty | null;
}

export interface ModeStats {
  questionsAnswered: number;
  correctAnswers: number;
  quizzesCompleted: number;
  perfectQuizzes: number;
  hardQuizzesAced: number;
  gamesPlayed: number;
  gamesWon: number;
  dailyCompleted: number;
  hintsUsed: number;
  fastAnswers: number;
  lessonsCompleted: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface DailyState {
  dateKey: string;
  completed: boolean;
  attempts: number;
  bestAccuracy: number;
}

export interface ModeProgress {
  xp: number;
  coins: number;
  streak: StreakState;
  stats: ModeStats;
  topicStats: Record<string, TopicStat>;
  badges: Record<string, number>;
  attempts: QuizAttempt[];
  games: GameRecord[];
  lessons: Record<string, number>;
  /** XP earned per local day — powers the weekly chart and weekly leaderboard. */
  dailyXp: Record<string, number>;
  daily: DailyState | null;
  bestGameScores: Partial<Record<GameId, number>>;
}

export interface PersistedState {
  version: number;
  profile: UserProfile | null;
  progress: Record<ExperienceMode, ModeProgress>;
  updatedAt: number;
}

/* ------------------------------------------------------------------ */
/* Gamification                                                        */
/* ------------------------------------------------------------------ */

export interface LevelInfo {
  level: number;
  xp: number;
  levelStartXp: number;
  nextLevelXp: number;
  xpIntoLevel: number;
  xpForLevel: number;
  progress: number;
}

export interface BadgeProgress {
  id: string;
  current: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: number;
}

/** Everything that changed when a quiz, game or lesson is committed — drives the reward screens. */
export interface RewardOutcome {
  xpGained: number;
  coinsGained: number;
  levelBefore: number;
  levelAfter: number;
  newBadges: string[];
  streakBefore: number;
  streakAfter: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarId: string;
  xp: number;
  weeklyXp: number;
  level: number;
  streak: number;
  isFriend: boolean;
  isDemo: boolean;
  isCurrentUser: boolean;
  rank: number;
  city?: string;
}

export type LeaderboardScope = 'global' | 'weekly' | 'friends';

export interface Recommendation {
  kind: 'level-up' | 'next-topic' | 'practice' | 'review';
  topicId: string;
  difficulty: Difficulty;
  title: string;
  message: string;
  /** Points learners at the lesson when they need revision. */
  reviewLesson: boolean;
  /** Optional second suggestion, e.g. "Or take Climate Change to Hard". */
  alternative?: { topicId: string; difficulty: Difficulty; title: string };
}
