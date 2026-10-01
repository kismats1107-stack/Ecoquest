import type { QuizSession } from '@/engine/quiz/session';
import type { ExperienceMode } from '@/types';
import { kv } from './localStore';

/** Persists the in-progress quiz so a refresh resumes at the current question. */
const key = (mode: ExperienceMode) => `v1:activeQuiz:${mode}`;

export const sessionStore = {
  load(mode: ExperienceMode): QuizSession | null {
    const s = kv.get<QuizSession>(key(mode));
    if (!s || !s.quiz || !Array.isArray(s.quiz.questions) || !s.quiz.questions.length) return null;
    if (s.quiz.experienceMode !== mode || s.phase === 'complete') return null;
    return s;
  },
  save(mode: ExperienceMode, session: QuizSession): void {
    kv.set(key(mode), session);
  },
  clear(mode: ExperienceMode): void {
    kv.remove(key(mode));
  },
};
