import { getQuestionBank, getTemplates, getTopics } from '@/data';
import { getGame } from '@/data/games';
import { addDays, parseDateKey } from '@/engine/dates';
import { makeGameRecord } from '@/engine/games/rewards';
import { applyGameResult, applyLessonComplete, applyQuizAttempt, emptyProgress } from '@/engine/gamification/progress';
import { buildAttempt } from '@/engine/quiz/attempt';
import { buildLocalQuiz } from '@/engine/quiz/buildQuiz';
import { gameForBreak } from '@/engine/quiz/plan';
import { summarizeSession } from '@/engine/quiz/scoring';
import { createSession, currentQuestion, sessionReducer, type QuizSession } from '@/engine/quiz/session';
import { createRng, hashString, shuffle, type Rng } from '@/engine/random';
import type { Difficulty, ExperienceMode, ModeProgress } from '@/types';

interface PlannedQuiz {
  topic: number;
  difficulty: Difficulty;
  count: number;
  accuracy: number;
}

/** Five consecutive days of realistic history ending yesterday — so today extends the streak to 6. */
const PLAN: Record<ExperienceMode, { day: number; quizzes: PlannedQuiz[]; lessons?: number[]; games?: number }[]> = {
  kids: [
    { day: -5, lessons: [0, 2], quizzes: [{ topic: 2, difficulty: 'easy', count: 5, accuracy: 0.8 }] },
    { day: -4, quizzes: [{ topic: 0, difficulty: 'easy', count: 5, accuracy: 1 }], games: 1 },
    { day: -3, lessons: [1], quizzes: [{ topic: 1, difficulty: 'easy', count: 5, accuracy: 0.6 }] },
    { day: -2, quizzes: [{ topic: 2, difficulty: 'medium', count: 10, accuracy: 0.7 }] },
    { day: -1, quizzes: [{ topic: 4, difficulty: 'easy', count: 5, accuracy: 0.8 }], games: 1 },
  ],
  plus: [
    { day: -5, lessons: [0], quizzes: [{ topic: 0, difficulty: 'easy', count: 10, accuracy: 0.8 }] },
    { day: -4, quizzes: [{ topic: 1, difficulty: 'medium', count: 5, accuracy: 0.6 }, { topic: 0, difficulty: 'medium', count: 10, accuracy: 0.7 }] },
    { day: -3, lessons: [3], quizzes: [{ topic: 3, difficulty: 'easy', count: 5, accuracy: 1 }], games: 1 },
    { day: -2, quizzes: [{ topic: 5, difficulty: 'medium', count: 10, accuracy: 0.5 }] },
    { day: -1, lessons: [2], quizzes: [{ topic: 2, difficulty: 'medium', count: 10, accuracy: 0.9 }], games: 1 },
  ],
};

function simulateSession(session: QuizSession, accuracy: number, rng: Rng, start: number): QuizSession {
  let s = session;
  let t = start;
  const correctTarget = Math.round(accuracy * s.quiz.questions.length);
  const correctIdx = new Set(shuffle(s.quiz.questions.map((_, i) => i), rng).slice(0, correctTarget));
  while (s.phase !== 'complete') {
    if (s.phase === 'question') {
      const q = currentQuestion(s);
      const correct = correctIdx.has(s.index);
      const selected = correct ? q.correctAnswer : (q.correctAnswer + 1) % q.options.length;
      t += 2500 + Math.floor(rng() * 7000);
      s = sessionReducer(s, { type: 'answer', index: s.index, selected, now: t });
    } else if (s.phase === 'feedback') {
      t += 3000;
      s = sessionReducer(s, { type: 'next', now: t });
    } else if (s.phase === 'game') {
      const topic = getTopics(s.quiz.experienceMode).find((x) => x.id === s.quiz.topicId)!;
      const def = getGame(gameForBreak(topic, s.games.length));
      const score = Math.max(1, Math.round(def.target * (0.7 + rng() * 0.8)));
      t += 15000;
      s = sessionReducer(s, { type: 'gameDone', record: makeGameRecord(def, score, 'quiz', t, topic.id), now: t });
    }
  }
  return s;
}

export function seedDemoProgress(mode: ExperienceMode, userId: string, today: string): ModeProgress {
  const rng = createRng(hashString(`ecoquest-demo:${mode}`));
  const topics = getTopics(mode);
  let progress = emptyProgress();

  for (const day of PLAN[mode]) {
    const dayKey = addDays(today, day.day);
    let t = parseDateKey(dayKey).getTime() + 16 * 3600_000;

    for (const idx of day.lessons ?? []) {
      progress = applyLessonComplete(progress, topics[idx].id, dayKey, t)?.progress ?? progress;
      t += 120_000;
    }

    for (const plan of day.quizzes) {
      const topic = topics[plan.topic];
      const quiz = buildLocalQuiz(
        {
          topicId: topic.id,
          topicName: topic.name,
          topicSummary: topic.summary,
          difficulty: plan.difficulty,
          questionCount: plan.count,
          timePerQuestion: 20,
          experienceMode: mode,
        },
        getQuestionBank(mode),
        getTemplates(mode),
        rng,
        t,
      );
      const finished = simulateSession(createSession(quiz, { now: t }), plan.accuracy, rng, t);
      const summary = summarizeSession(finished, mode, { dailyAlreadyCompleted: true, now: finished.completedAt ?? t });
      progress = applyQuizAttempt(progress, buildAttempt(finished, summary, userId), dayKey, finished.completedAt ?? t).progress;
      t = (finished.completedAt ?? t) + 600_000;
    }

    for (let g = 0; g < (day.games ?? 0); g++) {
      const def = getGame(topics[(g + day.day + 10) % topics.length].games[0]);
      const score = Math.round(def.target * (0.8 + rng() * 0.7));
      progress = applyGameResult(progress, makeGameRecord(def, score, 'standalone', t), dayKey, t).progress;
      t += 60_000;
    }
  }
  return progress;
}
