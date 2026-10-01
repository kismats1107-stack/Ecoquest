import { DIFFICULTIES, TRUE_FALSE_OPTIONS, XP_BY_DIFFICULTY, hintRevealsAnswer, normalizeText } from '@shared/quizContract';
import type { BankQuestion, Difficulty, Quiz, QuizQuestion, QuizRequest, QuestionTemplate } from '@/types';
import { shuffle, type Rng } from '@/engine/random';

const difficultyDistance = (a: Difficulty, b: Difficulty) => Math.abs(DIFFICULTIES.indexOf(a) - DIFFICULTIES.indexOf(b));

/**
 * Turns a bank question into a playable question: options are shuffled and the correct
 * answer index is re-located by value, so shuffling can never "move" the right answer.
 */
export function toQuizQuestion(bq: BankQuestion, rng: Rng, topicName: string): QuizQuestion {
  const isTrueFalse = bq.wrong.length === 1 && (bq.correct === 'True' || bq.correct === 'False');
  const options = isTrueFalse ? [...TRUE_FALSE_OPTIONS] : shuffle([bq.correct, ...bq.wrong], rng);
  const correctAnswer = options.indexOf(bq.correct);
  const hint = hintRevealsAnswer(bq.hint, bq.correct) ? `Think back to the ${topicName} lesson — which option fits best?` : bq.hint;
  return {
    id: bq.id,
    topicId: bq.topicId,
    type: bq.type,
    difficulty: bq.difficulty,
    question: bq.question,
    context: bq.context,
    visual: bq.visual,
    data: bq.data,
    options,
    correctAnswer,
    explanation: bq.explanation,
    hint,
    xp: XP_BY_DIFFICULTY[bq.difficulty],
  };
}

/**
 * Offline quiz generation: filter by topic, prefer the requested difficulty, prefer questions the
 * learner hasn't seen recently, add freshly generated calculation questions, then randomise.
 */
export function buildLocalQuiz(
  req: QuizRequest,
  bank: BankQuestion[],
  templates: QuestionTemplate[],
  rng: Rng,
  now: number,
): Quiz {
  const generated: BankQuestion[] = [];
  for (const t of templates.filter((t) => t.topicId === req.topicId)) {
    for (let i = 0; i < 3; i++) generated.push(t.generate(rng));
  }

  const seenText = new Set<string>();
  const seenId = new Set<string>();
  const candidates: BankQuestion[] = [];
  for (const q of [...bank.filter((q) => q.topicId === req.topicId), ...generated]) {
    // One variant per question wording: two versions of the same calculation never share a quiz.
    const key = normalizeText(q.question);
    if (seenText.has(key) || seenId.has(q.id)) continue;
    seenText.add(key);
    seenId.add(q.id);
    candidates.push(q);
  }

  const avoid = new Set((req.avoidQuestions ?? []).map(normalizeText));
  const scored = candidates.map((q) => ({
    q,
    score: difficultyDistance(q.difficulty, req.difficulty) + (avoid.has(normalizeText(q.question)) ? 0.75 : 0) + rng() * 0.5,
  }));
  scored.sort((a, b) => a.score - b.score);

  const chosen = shuffle(
    scored.slice(0, req.questionCount).map((s) => s.q),
    rng,
  );
  const questions = chosen.map((q) => toQuizQuestion(q, rng, req.topicName));

  return {
    id: `local_${now.toString(36)}_${Math.floor(rng() * 1e8).toString(36)}`,
    topicId: req.topicId,
    topicName: req.topicName,
    difficulty: req.difficulty,
    experienceMode: req.experienceMode,
    questionCount: questions.length,
    timePerQuestion: req.timePerQuestion,
    source: 'local',
    createdAt: now,
    questions,
  };
}

/** Counts of each difficulty in a quiz — shown on the "challenge ready" card. */
export function difficultyMix(quiz: Quiz): Record<Difficulty, number> {
  const mix: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  for (const q of quiz.questions) mix[q.difficulty]++;
  return mix;
}
