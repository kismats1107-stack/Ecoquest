/**
 * Quiz contract shared by the browser app and the AI quiz server.
 *
 * Every quiz — whether it came from the AI generator or the offline question
 * bank — must pass `validateQuiz` before the QuizEngine ever sees it.
 * This file must stay dependency-free so Node can run it directly.
 */

export type ExperienceMode = 'kids' | 'plus';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'truefalse' | 'scenario' | 'rapid' | 'data' | 'visual';
export type QuizSource = 'ai' | 'local';

export const EXPERIENCE_MODES: readonly ExperienceMode[] = ['kids', 'plus'];
export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];
export const QUESTION_TYPES: readonly QuestionType[] = ['mcq', 'truefalse', 'scenario', 'rapid', 'data', 'visual'];
export const QUESTION_COUNTS: readonly number[] = [5, 10, 15];
export const TIME_OPTIONS: readonly number[] = [10, 20, 30];

/** Base XP for answering a question of each difficulty correctly. */
export const XP_BY_DIFFICULTY: Record<Difficulty, number> = { easy: 10, medium: 15, hard: 20 };

export interface DataPoint {
  label: string;
  value: number;
}

/** Small dataset shown with data-interpretation questions. */
export interface QuestionData {
  title: string;
  unit: string;
  points: DataPoint[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  /** Optional scenario / setup text shown above the question. */
  context?: string;
  /** Optional emoji illustration (Kids picture questions). */
  visual?: string;
  data?: QuestionData;
  options: string[];
  /** Index into `options` of the single correct answer. */
  correctAnswer: number;
  explanation: string;
  /** A nudge that helps without giving the answer away. */
  hint: string;
  xp: number;
}

export interface Quiz {
  id: string;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  experienceMode: ExperienceMode;
  questionCount: number;
  timePerQuestion: number;
  source: QuizSource;
  createdAt: number;
  questions: QuizQuestion[];
  /** Set when the app had to fall back from AI to the offline bank. */
  notice?: string;
}

export interface QuizRequest {
  topicId: string;
  topicName: string;
  /** One or two sentences describing the topic's scope, used to keep AI on-topic. */
  topicSummary: string;
  difficulty: Difficulty;
  questionCount: number;
  timePerQuestion: number;
  experienceMode: ExperienceMode;
  /** Recently seen question texts the generator should avoid repeating. */
  avoidQuestions?: string[];
}

export interface ValidationOptions {
  topicId: string;
  questionCount: number;
  /** AI quizzes must always have exactly four options per question. */
  requireFourOptions?: boolean;
}

export type ValidationResult = { ok: true; quiz: Quiz } | { ok: false; errors: string[] };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNonEmptyString = (v: unknown, min = 1): v is string => typeof v === 'string' && v.trim().length >= min;

/** Lower-cases and strips punctuation/extra spaces so near-identical texts compare equal. */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True/false questions always use exactly these two options, in this order. */
export const TRUE_FALSE_OPTIONS = ['True', 'False'] as const;

/** True when a hint would hand the learner the answer (contains the answer text verbatim). */
export function hintRevealsAnswer(hint: string, answer: string): boolean {
  const a = normalizeText(answer);
  if (a.length < 4) return false;
  return normalizeText(hint).includes(a);
}

/**
 * Structural + content validation for a quiz. Never trust generated data:
 * a quiz that fails here must not be shown to a learner.
 */
export function validateQuiz(input: unknown, opts: ValidationOptions): ValidationResult {
  const errors: string[] = [];
  if (!isObject(input)) return { ok: false, errors: ['Quiz is not an object'] };

  const q = input;
  if (q.topicId !== opts.topicId) errors.push(`Topic mismatch: expected ${opts.topicId}`);
  if (!DIFFICULTIES.includes(q.difficulty as Difficulty)) errors.push('Missing or invalid quiz difficulty');
  if (!EXPERIENCE_MODES.includes(q.experienceMode as ExperienceMode)) errors.push('Invalid experience mode');
  if (!Array.isArray(q.questions)) return { ok: false, errors: [...errors, 'Questions are missing'] };

  const questions = q.questions as unknown[];
  if (questions.length !== opts.questionCount) {
    errors.push(`Expected ${opts.questionCount} questions, received ${questions.length}`);
  }

  const seenQuestions = new Set<string>();
  const seenIds = new Set<string>();

  questions.forEach((raw, i) => {
    const label = `Question ${i + 1}`;
    if (!isObject(raw)) {
      errors.push(`${label}: not an object`);
      return;
    }
    if (!isNonEmptyString(raw.id)) errors.push(`${label}: missing id`);
    else if (seenIds.has(raw.id)) errors.push(`${label}: duplicate id`);
    else seenIds.add(raw.id);

    if (!isNonEmptyString(raw.question, 8)) errors.push(`${label}: question text missing`);
    else {
      const key = normalizeText(raw.question + (typeof raw.context === 'string' ? raw.context : ''));
      if (seenQuestions.has(key)) errors.push(`${label}: duplicate question`);
      seenQuestions.add(key);
    }

    if (raw.topicId !== opts.topicId) errors.push(`${label}: off-topic`);
    if (!DIFFICULTIES.includes(raw.difficulty as Difficulty)) errors.push(`${label}: invalid difficulty`);
    if (!QUESTION_TYPES.includes(raw.type as QuestionType)) errors.push(`${label}: invalid type`);
    if (!isNonEmptyString(raw.explanation, 10)) errors.push(`${label}: explanation missing`);
    if (!isNonEmptyString(raw.hint, 5)) errors.push(`${label}: hint missing`);
    if (typeof raw.xp !== 'number' || raw.xp <= 0) errors.push(`${label}: invalid xp`);

    const options = raw.options;
    if (!Array.isArray(options) || !options.every((o) => isNonEmptyString(o))) {
      errors.push(`${label}: options must be non-empty strings`);
      return;
    }
    const isTrueFalse = raw.type === 'truefalse' || (options.length === 2 && options.every((o) => o === 'True' || o === 'False'));
    const expected = opts.requireFourOptions ? [4] : isTrueFalse ? [2] : [4];
    if (!expected.includes(options.length)) errors.push(`${label}: expected ${expected[0]} options, got ${options.length}`);
    const distinct = new Set(options.map((o) => normalizeText(o as string)));
    if (distinct.size !== options.length) errors.push(`${label}: duplicate options`);

    const correct = raw.correctAnswer;
    if (typeof correct !== 'number' || !Number.isInteger(correct) || correct < 0 || correct >= options.length) {
      errors.push(`${label}: correct answer index out of range`);
    }
  });

  if (errors.length) return { ok: false, errors };
  return { ok: true, quiz: input as unknown as Quiz };
}
