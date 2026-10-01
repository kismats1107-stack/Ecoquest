import type { AnswerRecord, GameRecord, Quiz, QuizQuestion } from '@/types';
import { planGameBreaks } from './plan';
import { questionTimeLimitSec, scoreAnswer } from './scoring';

/**
 * The QuizEngine: a pure state machine for one quiz session.
 *
 *   question ──answer/timeout──▶ feedback ──next──▶ question …
 *                                     │
 *                                     ├─(at a game break)─▶ game ──gameDone──▶ question …
 *                                     └─(last question)──▶ complete
 *
 * Actions carry the question index they belong to, so a late timer tick can never
 * score the wrong question or double-score the same one.
 */

export type SessionPhase = 'question' | 'feedback' | 'game' | 'complete';

export interface QuizSession {
  quiz: Quiz;
  /** Date key when this session is Today's Eco Challenge. */
  dailyKey: string | null;
  gameBreaks: number[];
  index: number;
  phase: SessionPhase;
  answers: AnswerRecord[];
  games: GameRecord[];
  hintsUsed: string[];
  combo: number;
  bestCombo: number;
  startedAt: number;
  questionStartedAt: number;
  completedAt: number | null;
}

export type SessionAction =
  | { type: 'answer'; index: number; selected: number; now: number }
  | { type: 'timeout'; index: number; now: number }
  | { type: 'hint'; index: number }
  | { type: 'next'; now: number }
  | { type: 'gameDone'; record: GameRecord; now: number };

export function createSession(quiz: Quiz, opts: { now: number; dailyKey?: string | null; games?: number }): QuizSession {
  return {
    quiz,
    dailyKey: opts.dailyKey ?? null,
    gameBreaks: planGameBreaks(quiz.questions.length, opts.games),
    index: 0,
    phase: 'question',
    answers: [],
    games: [],
    hintsUsed: [],
    combo: 0,
    bestCombo: 0,
    startedAt: opts.now,
    questionStartedAt: opts.now,
    completedAt: null,
  };
}

export function currentQuestion(s: QuizSession): QuizQuestion {
  return s.quiz.questions[Math.min(s.index, s.quiz.questions.length - 1)];
}

export function timeLimitMs(s: QuizSession): number {
  return questionTimeLimitSec(currentQuestion(s), s.quiz.timePerQuestion) * 1000;
}

/** True when the learner has answered every question before this break and hasn't played it yet. */
function gameDueAfter(s: QuizSession, answeredCount: number): boolean {
  const breakIndex = s.gameBreaks.indexOf(answeredCount);
  return breakIndex !== -1 && s.games.length <= breakIndex;
}

function advance(s: QuizSession, now: number): QuizSession {
  const nextIndex = s.index + 1;
  if (nextIndex >= s.quiz.questions.length) return { ...s, phase: 'complete', completedAt: now };
  return { ...s, index: nextIndex, phase: 'question', questionStartedAt: now };
}

function record(s: QuizSession, selected: number | null, now: number): QuizSession {
  const question = currentQuestion(s);
  const answer = scoreAnswer({
    question,
    selected,
    timeMs: now - s.questionStartedAt,
    timeLimitMs: timeLimitMs(s),
    usedHint: s.hintsUsed.includes(question.id),
    comboBefore: s.combo,
  });
  const combo = answer.correct ? s.combo + 1 : 0;
  return { ...s, answers: [...s.answers, answer], phase: 'feedback', combo, bestCombo: Math.max(s.bestCombo, combo) };
}

export function sessionReducer(s: QuizSession, action: SessionAction): QuizSession {
  switch (action.type) {
    case 'answer':
    case 'timeout': {
      if (s.phase !== 'question' || action.index !== s.index || s.answers.length > s.index) return s;
      const question = currentQuestion(s);
      if (action.type === 'answer' && (action.selected < 0 || action.selected >= question.options.length)) return s;
      return record(s, action.type === 'answer' ? action.selected : null, action.now);
    }
    case 'hint': {
      if (s.phase !== 'question' || action.index !== s.index) return s;
      const id = currentQuestion(s).id;
      if (s.hintsUsed.includes(id)) return s;
      return { ...s, hintsUsed: [...s.hintsUsed, id] };
    }
    case 'next': {
      if (s.phase !== 'feedback') return s;
      if (gameDueAfter(s, s.index + 1) && s.index + 1 < s.quiz.questions.length) return { ...s, phase: 'game' };
      return advance(s, action.now);
    }
    case 'gameDone': {
      if (s.phase !== 'game') return s;
      return advance({ ...s, games: [...s.games, action.record] }, action.now);
    }
  }
}

/** Index of the break currently being played (0-based). */
export function activeBreakIndex(s: QuizSession): number {
  return s.games.length;
}
