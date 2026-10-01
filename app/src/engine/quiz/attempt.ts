import type { QuizAttempt } from '@/types';
import type { QuizSummary } from './scoring';
import type { QuizSession } from './session';

/** Turns a finished session + its reward summary into the stored QuizAttempt record. */
export function buildAttempt(session: QuizSession, summary: QuizSummary, userId: string): QuizAttempt {
  const quiz = session.quiz;
  return {
    id: `attempt_${quiz.id}`,
    quizId: quiz.id,
    userId,
    topicId: quiz.topicId,
    topicName: quiz.topicName,
    difficulty: quiz.difficulty,
    experienceMode: quiz.experienceMode,
    source: quiz.source,
    questions: quiz.questions,
    answers: session.answers,
    games: session.games,
    score: summary.correct,
    total: summary.total,
    accuracy: summary.accuracy,
    timeTakenMs: summary.timeTakenMs,
    xpEarned: summary.totalXp,
    coinsEarned: summary.totalCoins,
    completedAt: session.completedAt ?? Date.now(),
    isDaily: summary.isDaily,
    dailySuccess: summary.dailySuccess,
  };
}
