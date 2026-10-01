import { describe, expect, it } from 'vitest';
import { validateQuiz, type QuizRequest } from '../shared/quizContract.ts';
import type { QuestionDraft } from './quizPrompt.ts';
import { HttpError, draftsToQuiz, parseRequest, readAIConfig } from './quizApi.ts';

const req: QuizRequest = {
  topicId: 'p-climate',
  topicName: 'Climate Change',
  topicSummary: 'Greenhouse effect and climate impacts.',
  difficulty: 'medium',
  questionCount: 3,
  timePerQuestion: 20,
  experienceMode: 'plus',
  avoidQuestions: ['Which gas is mostly responsible for warming?'],
};

const draft = (i: number, over: Partial<QuestionDraft> = {}): QuestionDraft => ({
  type: 'mcq',
  context: '',
  question: `Distinct climate question number ${i}?`,
  options: [`Right ${i}`, `Wrong A${i}`, `Wrong B${i}`, `Wrong C${i}`],
  correctIndex: 0,
  explanation: 'A short explanation of the right answer.',
  hint: 'Think about the energy balance.',
  difficulty: 'medium',
  ...over,
});

describe('AI output handling', () => {
  it('builds a valid quiz and keeps the right answer after shuffling', () => {
    for (let n = 0; n < 20; n++) {
      const quiz = draftsToQuiz([draft(1), draft(2), draft(3)], req);
      const result = validateQuiz(quiz, { topicId: req.topicId, questionCount: 3, requireFourOptions: true });
      expect(result.ok).toBe(true);
      for (const q of quiz.questions) expect(q.options[q.correctAnswer]).toMatch(/^Right /);
    }
  });

  it('drops duplicates and recently seen questions, so validation catches a short quiz', () => {
    const quiz = draftsToQuiz([draft(1), draft(1), draft(2, { question: 'Which gas is mostly responsible for warming?' })], req);
    expect(quiz.questions).toHaveLength(1);
    expect(validateQuiz(quiz, { topicId: req.topicId, questionCount: 3, requireFourOptions: true }).ok).toBe(false);
  });

  it('rejects malformed drafts and sanitises hints that give the answer away', () => {
    const quiz = draftsToQuiz([draft(1, { options: ['a', 'b', 'c'] }), draft(2, { correctIndex: 7 }), draft(3, { hint: 'The answer is Right 3, obviously.' })], req);
    expect(validateQuiz(quiz, { topicId: req.topicId, questionCount: 3, requireFourOptions: true }).ok).toBe(false);
    const hinted = quiz.questions.find((q) => q.question.includes('number 3'))!;
    expect(hinted.hint).not.toContain('Right 3');
  });

  it('validates incoming requests', () => {
    expect(parseRequest(req).questionCount).toBe(3);
    expect(() => parseRequest({ ...req, difficulty: 'impossible' })).toThrow(HttpError);
    expect(() => parseRequest({ ...req, questionCount: 99 })).toThrow(HttpError);
    expect(() => parseRequest({ ...req, topicId: '' })).toThrow(HttpError);
  });

  it('only enables AI with a key and a supported provider', () => {
    expect(readAIConfig({}).enabled).toBe(false);
    expect(readAIConfig({ AI_API_KEY: 'k' })).toMatchObject({ enabled: true, provider: 'anthropic', model: 'claude-opus-5-5', effort: 'low' });
    expect(readAIConfig({ AI_API_KEY: 'k', AI_PROVIDER: 'none' }).enabled).toBe(false);
    expect(readAIConfig({ ANTHROPIC_API_KEY: 'k', AI_EFFORT: 'bogus' }).effort).toBe('low');
  });
});
