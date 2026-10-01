import type { Quiz, QuizRequest } from '@/types';

/**
 * Anything that can produce a quiz. The QuizEngine never knows (or cares) whether a quiz came
 * from AI or from the offline bank — both return the same validated `Quiz` structure.
 */
export interface QuizGeneratorService {
  readonly name: 'ai' | 'local';
  generateQuiz(request: QuizRequest, signal?: AbortSignal): Promise<Quiz>;
}

export class QuizGenerationError extends Error {
  readonly reason: 'unavailable' | 'invalid' | 'network' | 'timeout' | 'server';

  constructor(reason: QuizGenerationError['reason'], message: string) {
    super(message);
    this.name = 'QuizGenerationError';
    this.reason = reason;
  }
}
