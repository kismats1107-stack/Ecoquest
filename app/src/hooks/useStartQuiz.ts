import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { createSession } from '@/engine/quiz/session';
import { paths } from '@/lib/paths';
import { sessionStore } from '@/services/storage/sessionStore';
import type { ExperienceMode, Quiz } from '@/types';

/** Creates a fresh QuizEngine session for a generated quiz and opens the player. */
export function useStartQuiz(mode: ExperienceMode) {
  const navigate = useNavigate();
  return useCallback(
    (quiz: Quiz, opts: { dailyKey?: string; games?: number } = {}) => {
      const session = createSession(quiz, { now: Date.now(), dailyKey: opts.dailyKey ?? null, games: opts.games });
      sessionStore.save(mode, session);
      navigate(paths(mode).quiz);
    },
    [mode, navigate],
  );
}
