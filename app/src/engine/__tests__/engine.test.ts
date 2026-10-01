import { describe, expect, it } from 'vitest';
import { validateQuiz } from '@shared/quizContract';
import { GAMIFICATION } from '@/config/gamification';
import { getTopics } from '@/data';
import { addDays } from '@/engine/dates';
import { computeGameReward, makeGameRecord } from '@/engine/games/rewards';
import { levelFromXp, rankFor, xpForLevel } from '@/engine/gamification/levels';
import { applyLessonComplete, applyQuizAttempt, emptyProgress, spendHint } from '@/engine/gamification/progress';
import { currentStreak, emptyStreak, registerActivity } from '@/engine/gamification/streak';
import { buildAttempt } from '@/engine/quiz/attempt';
import { planGameBreaks } from '@/engine/quiz/plan';
import { recommendNext, suggestDifficulty } from '@/engine/quiz/recommendation';
import { scoreAnswer, summarizeSession } from '@/engine/quiz/scoring';
import { createSession, sessionReducer, type QuizSession } from '@/engine/quiz/session';
import { seedDemoProgress } from '@/services/demo/seedDemo';
import type { Quiz, QuizQuestion } from '@/types';

function question(i: number, over: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    id: `q${i}`,
    topicId: 'p-climate',
    type: 'mcq',
    difficulty: 'easy',
    question: `Question number ${i}?`,
    options: ['A1', 'B1', 'C1', 'D1'],
    correctAnswer: 0,
    explanation: 'Because it is the right answer here.',
    hint: 'Think about it.',
    xp: 10,
    ...over,
  };
}

function quiz(n: number): Quiz {
  return {
    id: 'quiz1',
    topicId: 'p-climate',
    topicName: 'Climate Change',
    difficulty: 'easy',
    experienceMode: 'plus',
    questionCount: n,
    timePerQuestion: 20,
    source: 'local',
    createdAt: 0,
    questions: Array.from({ length: n }, (_, i) => question(i)),
  };
}

const game = { id: 'carbon-footprint' as const, target: 4, perfectScore: 7 };

function play(s: QuizSession, correctPattern: boolean[], t0 = 1000): QuizSession {
  let st = s;
  let t = t0;
  for (const correct of correctPattern) {
    t += 3000;
    st = sessionReducer(st, { type: 'answer', index: st.index, selected: correct ? 0 : 1, now: t });
    st = sessionReducer(st, { type: 'next', now: t });
    if (st.phase === 'game') st = sessionReducer(st, { type: 'gameDone', record: makeGameRecord(game, 5, 'quiz', t), now: t });
  }
  return st;
}

describe('quiz engine (session)', () => {
  it('places game breaks after Q3 and Q6 for a 10-question quiz', () => {
    expect(planGameBreaks(10)).toEqual([3, 6]);
    expect(planGameBreaks(5)).toEqual([3]);
    expect(planGameBreaks(15)).toEqual([4, 8, 12]);
    expect(planGameBreaks(8, 1)).toEqual([4]);
  });

  it('runs question → feedback → game → question … → complete', () => {
    let s = createSession(quiz(10), { now: 0 });
    for (let i = 0; i < 3; i++) {
      s = sessionReducer(s, { type: 'answer', index: s.index, selected: 0, now: 1000 });
      expect(s.phase).toBe('feedback');
      s = sessionReducer(s, { type: 'next', now: 2000 });
    }
    expect(s.phase).toBe('game');
    expect(s.index).toBe(2);
    s = sessionReducer(s, { type: 'gameDone', record: makeGameRecord(game, 5, 'quiz', 3000), now: 3000 });
    expect(s.phase).toBe('question');
    expect(s.index).toBe(3);
    s = play(s, Array(7).fill(true));
    expect(s.phase).toBe('complete');
    expect(s.answers).toHaveLength(10);
    expect(s.games).toHaveLength(2);
  });

  it('ignores stale timer events and double answers', () => {
    let s = createSession(quiz(5), { now: 0 });
    s = sessionReducer(s, { type: 'answer', index: 0, selected: 0, now: 500 });
    const after = sessionReducer(s, { type: 'timeout', index: 0, now: 20000 });
    expect(after).toBe(s);
    const again = sessionReducer(s, { type: 'answer', index: 0, selected: 2, now: 600 });
    expect(again).toBe(s);
    s = sessionReducer(s, { type: 'next', now: 1000 });
    const stale = sessionReducer(s, { type: 'timeout', index: 0, now: 1100 });
    expect(stale).toBe(s);
  });

  it('marks timeouts as unanswered and incorrect', () => {
    let s = createSession(quiz(5), { now: 0 });
    s = sessionReducer(s, { type: 'timeout', index: 0, now: 20000 });
    expect(s.answers[0]).toMatchObject({ selected: null, correct: false, timedOut: true, xp: 0 });
  });
});

describe('scoring', () => {
  it('awards base, fast, rapid and combo XP', () => {
    const base = scoreAnswer({ question: question(1), selected: 0, timeMs: 15000, timeLimitMs: 20000, usedHint: false, comboBefore: 0 });
    expect(base.xp).toBe(10);
    const fast = scoreAnswer({ question: question(1), selected: 0, timeMs: 2000, timeLimitMs: 20000, usedHint: false, comboBefore: 0 });
    expect(fast.xp).toBe(10 + GAMIFICATION.fastBonusXp);
    expect(fast.fast).toBe(true);
    const hinted = scoreAnswer({ question: question(1), selected: 0, timeMs: 2000, timeLimitMs: 20000, usedHint: true, comboBefore: 0 });
    expect(hinted.fast).toBe(false);
    const rapidCombo = scoreAnswer({ question: question(1, { type: 'rapid', difficulty: 'hard', xp: 20 }), selected: 0, timeMs: 9000, timeLimitMs: 10000, usedHint: false, comboBefore: 2 });
    expect(rapidCombo.xp).toBe(20 + GAMIFICATION.rapidBonusXp + GAMIFICATION.comboBonusXp);
    expect(rapidCombo.coins).toBe(GAMIFICATION.coinsByDifficulty.hard);
    const wrong = scoreAnswer({ question: question(1), selected: 2, timeMs: 1000, timeLimitMs: 20000, usedHint: false, comboBefore: 5 });
    expect(wrong).toMatchObject({ xp: 0, coins: 0, correct: false });
  });

  it('adds a perfect-run bonus and pays the daily reward only once', () => {
    let s = createSession(quiz(5), { now: 0, dailyKey: '2026-10-01', games: 1 });
    s = play(s, [true, true, true, true, true]);
    const first = summarizeSession(s, 'plus', { dailyAlreadyCompleted: false, now: 99999 });
    expect(first.perfect).toBe(true);
    expect(first.dailySuccess).toBe(true);
    expect(first.dailyRewarded).toBe(true);
    expect(first.lines.some((l) => l.xp === GAMIFICATION.perfectBonusXp)).toBe(true);
    const second = summarizeSession(s, 'plus', { dailyAlreadyCompleted: true, now: 99999 });
    expect(second.dailyRewarded).toBe(false);
    expect(first.totalXp - second.totalXp).toBe(GAMIFICATION.daily.rewardXp);
  });

  it('requires a played game for the daily challenge', () => {
    let s = createSession(quiz(5), { now: 0, dailyKey: '2026-10-01', games: 1 });
    for (let i = 0; i < 5; i++) {
      s = sessionReducer(s, { type: 'answer', index: s.index, selected: 0, now: 1 });
      s = sessionReducer(s, { type: 'next', now: 2 });
      if (s.phase === 'game') s = sessionReducer(s, { type: 'gameDone', record: { ...makeGameRecord(game, 0, 'quiz', 2), skipped: true, xp: 0, coins: 0 }, now: 3 });
    }
    expect(summarizeSession(s, 'plus', { dailyAlreadyCompleted: false, now: 9 }).dailySuccess).toBe(false);
  });

  it('scales mini-game rewards between 10 and 50 XP', () => {
    expect(computeGameReward({ target: 4, perfectScore: 8 }, 0).xp).toBe(10);
    expect(computeGameReward({ target: 4, perfectScore: 8 }, 8).xp).toBe(50);
    expect(computeGameReward({ target: 4, perfectScore: 8 }, 3).success).toBe(false);
    expect(computeGameReward({ target: 4, perfectScore: 8 }, 4).success).toBe(true);
  });
});

describe('gamification', () => {
  it('computes levels from XP', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
    expect(levelFromXp(0).level).toBe(1);
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(100).level).toBe(2);
    expect(levelFromXp(4500).level).toBe(10);
    expect(rankFor('kids', 1).name).toBe('Seedling');
    expect(rankFor('kids', 10).name).toBe('Earth Hero');
  });

  it('tracks daily streaks', () => {
    const d = '2026-10-01';
    let s = registerActivity(emptyStreak(), d);
    expect(s.current).toBe(1);
    expect(registerActivity(s, d)).toBe(s);
    s = registerActivity(s, addDays(d, 1));
    expect(s.current).toBe(2);
    expect(currentStreak(s, addDays(d, 2))).toBe(2);
    expect(currentStreak(s, addDays(d, 3))).toBe(0);
    s = registerActivity(s, addDays(d, 5));
    expect(s).toMatchObject({ current: 1, best: 2 });
  });

  it('commits a quiz attempt: XP, coins, stats, badges and streak', () => {
    let s = createSession(quiz(5), { now: 0 });
    s = play(s, [true, true, true, true, false]);
    const summary = summarizeSession(s, 'plus', { dailyAlreadyCompleted: false, now: 50000 });
    const attempt = buildAttempt(s, summary, 'u1');
    const before = emptyProgress();
    const { progress, outcome } = applyQuizAttempt(before, attempt, '2026-10-01', 50000);
    expect(progress.xp).toBe(summary.totalXp);
    expect(progress.coins).toBe(GAMIFICATION.startingCoins + summary.totalCoins);
    expect(progress.stats.quizzesCompleted).toBe(1);
    expect(progress.stats.correctAnswers).toBe(4);
    expect(progress.topicStats['p-climate'].lastAccuracy).toBeCloseTo(0.8);
    expect(progress.streak.current).toBe(1);
    expect(progress.dailyXp['2026-10-01']).toBe(summary.totalXp);
    expect(outcome.newBadges).toContain('eco-starter');
    expect(progress.attempts[0].id).toBe(attempt.id);
  });

  it('spends coins on hints and refuses when broke', () => {
    const p = emptyProgress();
    const after = spendHint(p)!;
    expect(after.coins).toBe(p.coins - GAMIFICATION.hintCost);
    expect(spendHint({ ...p, coins: 10 })).toBeNull();
  });

  it('rewards a lesson only once', () => {
    const first = applyLessonComplete(emptyProgress(), 'k-water', '2026-10-01', 1)!;
    expect(first.progress.xp).toBe(GAMIFICATION.lessonXp);
    expect(applyLessonComplete(first.progress, 'k-water', '2026-10-01', 2)).toBeNull();
  });

  it('seeds a believable demo history', () => {
    const today = '2026-10-01';
    const p = seedDemoProgress('plus', 'demo', today);
    expect(p.attempts.length).toBeGreaterThan(3);
    expect(p.streak).toMatchObject({ current: 5, lastActiveDate: addDays(today, -1) });
    expect(p.xp).toBeGreaterThan(0);
    expect(p.badges['eco-starter']).toBeDefined();
  });
});

describe('recommendations', () => {
  const topics = getTopics('plus');
  it('suggests a related topic at Medium after 90% on Medium', () => {
    const r = recommendNext({ topicId: 'p-climate', difficulty: 'medium', accuracy: 0.9 }, emptyProgress(), topics);
    expect(r.kind).toBe('next-topic');
    expect(r.difficulty).toBe('medium');
    expect(['p-carbon', 'p-renewables']).toContain(r.topicId);
    expect(r.alternative?.difficulty).toBe('hard');
  });

  it('suggests revision before Hard after 45% on Medium', () => {
    const r = recommendNext({ topicId: 'p-climate', difficulty: 'medium', accuracy: 0.45 }, emptyProgress(), topics);
    expect(r.kind).toBe('review');
    expect(r.reviewLesson).toBe(true);
    expect(r.title).toBe('Review Climate Change basics');
    expect(r.message).toContain('before trying Hard');
  });

  it('applies the smart difficulty thresholds', () => {
    const stat = (acc: number, d: 'easy' | 'medium' | 'hard') => ({ answered: 10, correct: 0, quizzes: 1, bestAccuracy: acc, lastAccuracy: acc, lastDifficulty: d });
    expect(suggestDifficulty(stat(0.9, 'easy'))?.difficulty).toBe('medium');
    expect(suggestDifficulty(stat(0.7, 'medium'))?.difficulty).toBe('medium');
    expect(suggestDifficulty(stat(0.5, 'hard'))?.difficulty).toBe('medium');
    expect(suggestDifficulty(undefined)).toBeNull();
  });
});

describe('quiz validation', () => {
  it('rejects malformed quizzes', () => {
    const good = quiz(5);
    expect(validateQuiz(good, { topicId: 'p-climate', questionCount: 5 }).ok).toBe(true);
    const bad = (mutate: (q: Quiz) => void) => {
      const q = structuredClone(good);
      mutate(q);
      return validateQuiz(q, { topicId: 'p-climate', questionCount: 5, requireFourOptions: true }).ok;
    };
    expect(bad((q) => (q.questions[0].options = ['a', 'b', 'c']))).toBe(false);
    expect(bad((q) => (q.questions[1].question = q.questions[0].question))).toBe(false);
    expect(bad((q) => (q.questions[0].correctAnswer = 4))).toBe(false);
    expect(bad((q) => (q.questions[0].explanation = ''))).toBe(false);
    expect(bad((q) => (q.questions[0].topicId = 'p-water'))).toBe(false);
    expect(bad((q) => (q.questions[0].options = ['a', 'a', 'b', 'c']))).toBe(false);
    expect(bad((q) => q.questions.pop())).toBe(false);
  });
});
