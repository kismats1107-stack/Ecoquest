import { validateQuiz } from '@shared/quizContract';
import { getQuestionBank, getTemplates, getTopic } from '@/data';
import { buildLocalQuiz } from '@/engine/quiz/buildQuiz';
import { createRng, randomSeed } from '@/engine/random';
import type { Quiz, QuizRequest } from '@/types';
import { QuizGenerationError, type QuizGeneratorService } from './QuizGeneratorService';

/** Offline generator: EcoQuest's curated question bank plus freshly generated calculation questions. */
export class LocalQuizGenerator implements QuizGeneratorService {
  readonly name = 'local' as const;
  private readonly seed: () => number;

  constructor(seed: () => number = randomSeed) {
    this.seed = seed;
  }

  async generateQuiz(request: QuizRequest): Promise<Quiz> {
    const topic = getTopic(request.topicId);
    if (!topic || topic.mode !== request.experienceMode) {
      throw new QuizGenerationError('invalid', `Unknown topic ${request.topicId} for ${request.experienceMode}`);
    }
    const quiz = buildLocalQuiz(
      request,
      getQuestionBank(request.experienceMode),
      getTemplates(request.experienceMode),
      createRng(this.seed()),
      Date.now(),
    );
    const result = validateQuiz(quiz, { topicId: request.topicId, questionCount: quiz.questions.length });
    if (!result.ok) throw new QuizGenerationError('invalid', result.errors.join('; '));
    return result.quiz;
  }
}

export const localQuizGenerator = new LocalQuizGenerator();
