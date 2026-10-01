import { DAILY_CHALLENGE, GAMIFICATION } from '@/config/gamification';
import type { AnswerRecord, ExperienceMode, QuizQuestion } from '@/types';
import type { QuizSession } from './session';

/** Rapid questions get half the normal time (minimum 5 seconds). */
export function questionTimeLimitSec(question: QuizQuestion, timePerQuestion: number): number {
  return question.type === 'rapid' ? Math.max(5, Math.round(timePerQuestion / 2)) : timePerQuestion;
}

export interface AnswerInput {
  question: QuizQuestion;
  selected: number | null;
  timeMs: number;
  timeLimitMs: number;
  usedHint: boolean;
  /** Consecutive correct answers immediately before this one. */
  comboBefore: number;
}

export function scoreAnswer(input: AnswerInput): AnswerRecord {
  const { question, selected, usedHint } = input;
  const timeMs = Math.max(0, Math.min(input.timeMs, input.timeLimitMs));
  const correct = selected !== null && selected === question.correctAnswer;
  const fast = correct && !usedHint && timeMs <= input.timeLimitMs * GAMIFICATION.fastAnswerShare;
  let xp = 0;
  if (correct) {
    xp = question.xp;
    if (question.type === 'rapid') xp += GAMIFICATION.rapidBonusXp;
    if (fast) xp += GAMIFICATION.fastBonusXp;
    if (input.comboBefore + 1 >= GAMIFICATION.comboThreshold) xp += GAMIFICATION.comboBonusXp;
  }
  return {
    questionId: question.id,
    selected,
    correct,
    timedOut: selected === null,
    timeMs,
    usedHint,
    fast,
    xp,
    coins: correct ? GAMIFICATION.coinsByDifficulty[question.difficulty] : 0,
  };
}

export interface RewardLine {
  label: string;
  xp: number;
  coins: number;
}

export interface QuizSummary {
  correct: number;
  total: number;
  accuracy: number;
  timeTakenMs: number;
  stars: number;
  perfect: boolean;
  fastAnswers: number;
  gamesWon: number;
  gamesPlayed: number;
  isDaily: boolean;
  dailySuccess: boolean;
  dailyRewarded: boolean;
  lines: RewardLine[];
  totalXp: number;
  totalCoins: number;
}

/** Computes every reward for a finished session. The daily bonus is only paid once per day. */
export function summarizeSession(
  session: QuizSession,
  mode: ExperienceMode,
  opts: { dailyAlreadyCompleted: boolean; now: number },
): QuizSummary {
  const total = session.quiz.questions.length;
  const correct = session.answers.filter((a) => a.correct).length;
  const accuracy = total ? correct / total : 0;
  const perfect = total >= GAMIFICATION.perfectMinQuestions && correct === total;
  const played = session.games.filter((g) => !g.skipped);
  const lines: RewardLine[] = [];

  const answerXp = session.answers.reduce((s, a) => s + a.xp, 0);
  const answerCoins = session.answers.reduce((s, a) => s + a.coins, 0);
  lines.push({ label: `${correct} correct answer${correct === 1 ? '' : 's'}`, xp: answerXp, coins: answerCoins });

  if (played.length) {
    lines.push({
      label: `${played.length} ten-second challenge${played.length === 1 ? '' : 's'}`,
      xp: played.reduce((s, g) => s + g.xp, 0),
      coins: played.reduce((s, g) => s + g.coins, 0),
    });
  }

  if (perfect) lines.push({ label: 'Perfect run bonus', xp: GAMIFICATION.perfectBonusXp, coins: GAMIFICATION.perfectBonusCoins });
  else if (accuracy >= GAMIFICATION.accuracyBonusThreshold) lines.push({ label: 'High accuracy bonus', xp: GAMIFICATION.accuracyBonusXp, coins: 0 });

  const isDaily = session.dailyKey !== null;
  const dailySuccess = isDaily && accuracy >= DAILY_CHALLENGE[mode].targetAccuracy && played.length > 0;
  const dailyRewarded = dailySuccess && !opts.dailyAlreadyCompleted;
  if (dailyRewarded) {
    lines.push({ label: mode === 'kids' ? 'Today’s Mission complete!' : 'Today’s Eco Challenge complete', xp: GAMIFICATION.daily.rewardXp, coins: GAMIFICATION.daily.rewardCoins });
  }

  const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : accuracy >= 0.4 ? 1 : 0;

  return {
    correct,
    total,
    accuracy,
    timeTakenMs: (session.completedAt ?? opts.now) - session.startedAt,
    stars,
    perfect,
    fastAnswers: session.answers.filter((a) => a.fast).length,
    gamesWon: played.filter((g) => g.success).length,
    gamesPlayed: played.length,
    isDaily,
    dailySuccess,
    dailyRewarded,
    lines: lines.filter((l) => l.xp > 0 || l.coins > 0 || l === lines[0]),
    totalXp: lines.reduce((s, l) => s + l.xp, 0),
    totalCoins: lines.reduce((s, l) => s + l.coins, 0),
  };
}
