import type { BankQuestion, Difficulty, QuestionData, QuestionType } from '@/types';

/** Compact authoring format for question banks. `a` is the correct answer, `w` the distractors. */
export interface RawQuestion {
  d: 'e' | 'm' | 'h';
  t?: QuestionType;
  q: string;
  a: string;
  w: string[];
  x: string;
  h: string;
  c?: string;
  v?: string;
  data?: QuestionData;
}

const DIFF: Record<RawQuestion['d'], Difficulty> = { e: 'easy', m: 'medium', h: 'hard' };

function inferType(raw: RawQuestion): QuestionType {
  if (raw.t) return raw.t;
  if (raw.w.length === 1 && ['True', 'False'].includes(raw.a)) return 'truefalse';
  if (raw.data) return 'data';
  if (raw.c) return 'scenario';
  if (raw.v) return 'visual';
  return 'mcq';
}

/** Expands raw authoring entries into fully-typed bank questions with stable ids. */
export function bank(topicId: string, items: RawQuestion[]): BankQuestion[] {
  return items.map((raw, i) => ({
    id: `${topicId}-${String(i + 1).padStart(2, '0')}`,
    topicId,
    difficulty: DIFF[raw.d],
    type: inferType(raw),
    question: raw.q,
    correct: raw.a,
    wrong: raw.w,
    explanation: raw.x,
    hint: raw.h,
    context: raw.c,
    visual: raw.v,
    data: raw.data,
  }));
}
