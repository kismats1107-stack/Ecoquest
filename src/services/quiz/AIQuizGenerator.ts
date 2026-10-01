import { validateQuiz } from '@shared/quizContract';
import { aiDisabled, apiBase } from '@/config/env';
import type { Quiz, QuizRequest } from '@/types';
import { QuizGenerationError, type QuizGeneratorService } from './QuizGeneratorService';

export interface AIStatus {
  enabled: boolean;
  provider: string | null;
  model: string | null;
}

const OFF: AIStatus = { enabled: false, provider: null, model: null };
let statusPromise: Promise<AIStatus> | null = null;

/** Asks the EcoQuest server whether AI generation is configured. Cached for the session. */
export function getAIStatus(): Promise<AIStatus> {
  if (aiDisabled) return Promise.resolve(OFF);
  if (!statusPromise) {
    statusPromise = (async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${apiBase}/api/health`, { signal: controller.signal, headers: { Accept: 'application/json' } });
        clearTimeout(timer);
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return OFF;
        const body = (await res.json()) as { ai?: Partial<AIStatus> };
        return { enabled: body.ai?.enabled === true, provider: body.ai?.provider ?? null, model: body.ai?.model ?? null };
      } catch {
        return OFF;
      }
    })();
  }
  return statusPromise;
}

const TIMEOUT_MS = 45_000;

/**
 * Calls the server-side AI endpoint. API keys live only on the server; the browser just sends
 * the quiz request. The response is validated again here — generated data is never trusted.
 */
export class AIQuizGenerator implements QuizGeneratorService {
  readonly name = 'ai' as const;

  async generateQuiz(request: QuizRequest, signal?: AbortSignal): Promise<Quiz> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    signal?.addEventListener('abort', () => controller.abort(), { once: true });

    let res: Response;
    try {
      res = await fetch(`${apiBase}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
    } catch (err) {
      throw new QuizGenerationError(controller.signal.aborted ? 'timeout' : 'network', String(err));
    } finally {
      clearTimeout(timer);
    }

    if (res.status === 503) throw new QuizGenerationError('unavailable', 'AI generation is not configured');
    if (!res.ok) throw new QuizGenerationError('server', `Quiz API responded ${res.status}`);

    const body = (await res.json().catch(() => null)) as { quiz?: unknown } | null;
    const result = validateQuiz(body?.quiz, {
      topicId: request.topicId,
      questionCount: request.questionCount,
      requireFourOptions: true,
    });
    if (!result.ok) throw new QuizGenerationError('invalid', result.errors.slice(0, 3).join('; '));
    return { ...result.quiz, source: 'ai', timePerQuestion: request.timePerQuestion, experienceMode: request.experienceMode };
  }
}

export const aiQuizGenerator = new AIQuizGenerator();
