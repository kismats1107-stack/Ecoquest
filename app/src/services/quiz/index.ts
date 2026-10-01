import type { Quiz, QuizRequest } from '@/types';
import { aiQuizGenerator, getAIStatus } from './AIQuizGenerator';
import { localQuizGenerator } from './LocalQuizGenerator';
import { QuizGenerationError } from './QuizGeneratorService';

export { getAIStatus } from './AIQuizGenerator';
export type { AIStatus } from './AIQuizGenerator';
export type { QuizGeneratorService } from './QuizGeneratorService';

export interface GenerateOptions {
  /** Prefer AI when available (default true). */
  preferAI?: boolean;
  signal?: AbortSignal;
}

/**
 * The one entry point the UI uses. Tries AI when it's configured; on any failure — not configured,
 * network, timeout, or output that fails validation — falls back to the local generator.
 * The app therefore works fully offline, and AI only ever enhances it.
 */
export async function generateQuiz(request: QuizRequest, options: GenerateOptions = {}): Promise<Quiz> {
  const { preferAI = true, signal } = options;
  if (preferAI) {
    const status = await getAIStatus();
    if (status.enabled) {
      try {
        return await aiQuizGenerator.generateQuiz(request, signal);
      } catch (err) {
        const reason = err instanceof QuizGenerationError ? err.reason : 'server';
        console.info(`[EcoQuest] AI quiz generation unavailable (${reason}); using the offline question bank.`);
        const quiz = await localQuizGenerator.generateQuiz(request);
        return { ...quiz, notice: 'AI generation was unavailable, so this quiz came from the offline question bank.' };
      }
    }
  }
  return localQuizGenerator.generateQuiz(request);
}
