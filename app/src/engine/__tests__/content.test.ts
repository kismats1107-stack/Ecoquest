import { describe, expect, it } from 'vitest';
import { QUESTION_COUNTS, DIFFICULTIES, hintRevealsAnswer, normalizeText, validateQuiz } from '@shared/quizContract';
import { getLesson, getQuestionBank, getTemplates, getTopics } from '@/data';
import { badgeDefinitions } from '@/data/badges';
import { memoryDecks } from '@/data/kids/games';
import { buildLocalQuiz } from '@/engine/quiz/buildQuiz';
import { createRng } from '@/engine/random';
import type { ExperienceMode } from '@/types';

const MODES: ExperienceMode[] = ['kids', 'plus'];

describe('content', () => {
  it('meets the minimum question volume', () => {
    expect(getQuestionBank('kids').length).toBeGreaterThanOrEqual(30);
    expect(getQuestionBank('plus').length).toBeGreaterThanOrEqual(40);
  });

  it.each(MODES)('%s: every topic has a lesson and 15 questions across all difficulties', (mode) => {
    for (const topic of getTopics(mode)) {
      expect(getLesson(topic.id), topic.id).toBeDefined();
      const qs = getQuestionBank(mode).filter((q) => q.topicId === topic.id);
      expect(qs.length, topic.id).toBeGreaterThanOrEqual(15);
      for (const d of DIFFICULTIES) expect(qs.some((q) => q.difficulty === d), `${topic.id} ${d}`).toBe(true);
    }
  });

  it.each(MODES)('%s: every bank question is well formed', (mode) => {
    const ids = new Set<string>();
    const texts = new Set<string>();
    for (const q of getQuestionBank(mode)) {
      expect(ids.has(q.id), `duplicate id ${q.id}`).toBe(false);
      ids.add(q.id);
      const key = normalizeText(q.question + (q.context ?? ''));
      expect(texts.has(key), `duplicate question ${q.id}`).toBe(false);
      texts.add(key);
      const options = [q.correct, ...q.wrong];
      expect(new Set(options.map(normalizeText)).size, `duplicate options ${q.id}`).toBe(options.length);
      if (q.wrong.length === 1) {
        expect(['True', 'False']).toContain(q.correct);
        expect(q.wrong).toHaveLength(1);
      } else {
        expect(q.wrong, q.id).toHaveLength(3);
      }
      expect(q.explanation.length, q.id).toBeGreaterThan(20);
      expect(q.hint.length, q.id).toBeGreaterThan(5);
      expect(hintRevealsAnswer(q.hint, q.correct), `hint reveals answer in ${q.id}`).toBe(false);
    }
  });

  it('has at least 10 badges with targets', () => {
    expect(badgeDefinitions.length).toBeGreaterThanOrEqual(10);
    for (const b of badgeDefinitions) expect(b.target).toBeGreaterThan(0);
  });

  it('has a memory deck with at least 4 cards for every kids topic', () => {
    for (const t of getTopics('kids')) expect(memoryDecks[t.id]?.length ?? 0, t.id).toBeGreaterThanOrEqual(4);
  });
});

describe('local quiz generation', () => {
  it.each(MODES)('%s: generates valid quizzes for every topic, difficulty and size', (mode) => {
    const bank = getQuestionBank(mode);
    for (const topic of getTopics(mode)) {
      for (const difficulty of DIFFICULTIES) {
        for (const count of QUESTION_COUNTS) {
          const rng = createRng(count * 7 + difficulty.length);
          const quiz = buildLocalQuiz(
            { topicId: topic.id, topicName: topic.name, topicSummary: topic.summary, difficulty, questionCount: count, timePerQuestion: 20, experienceMode: mode },
            bank,
            getTemplates(mode),
            rng,
            Date.now(),
          );
          expect(quiz.questions.length, `${topic.id} ${difficulty} ${count}`).toBe(count);
          const result = validateQuiz(quiz, { topicId: topic.id, questionCount: count });
          expect(result.ok ? [] : result.errors, `${topic.id} ${difficulty} ${count}`).toEqual([]);
        }
      }
    }
  });

  it('keeps the correct answer attached after shuffling options', () => {
    const bank = getQuestionBank('plus');
    for (let seed = 1; seed <= 25; seed++) {
      const quiz = buildLocalQuiz(
        { topicId: 'p-climate', topicName: 'Climate Change', topicSummary: '', difficulty: 'medium', questionCount: 10, timePerQuestion: 20, experienceMode: 'plus' },
        bank,
        [],
        createRng(seed),
        0,
      );
      for (const q of quiz.questions) {
        const source = bank.find((b) => b.id === q.id)!;
        expect(q.options[q.correctAnswer]).toBe(source.correct);
      }
    }
  });

  it('prefers the requested difficulty', () => {
    const quiz = buildLocalQuiz(
      { topicId: 'k-water', topicName: 'Water', topicSummary: '', difficulty: 'hard', questionCount: 5, timePerQuestion: 20, experienceMode: 'kids' },
      getQuestionBank('kids'),
      getTemplates('kids'),
      createRng(3),
      0,
    );
    expect(quiz.questions.filter((q) => q.difficulty === 'hard').length).toBeGreaterThanOrEqual(3);
  });

  it('varies questions between generations', () => {
    const make = (seed: number) =>
      buildLocalQuiz(
        { topicId: 'p-carbon', topicName: 'Carbon', topicSummary: '', difficulty: 'easy', questionCount: 5, timePerQuestion: 20, experienceMode: 'plus' },
        getQuestionBank('plus'),
        getTemplates('plus'),
        createRng(seed),
        0,
      )
        .questions.map((q) => q.id)
        .join();
    const variants = new Set(Array.from({ length: 10 }, (_, i) => make(i + 1)));
    expect(variants.size).toBeGreaterThan(1);
  });

  it('generated calculation questions have distinct options and a correct value', () => {
    for (const mode of MODES) {
      for (const t of getTemplates(mode)) {
        for (let seed = 1; seed < 30; seed++) {
          const q = t.generate(createRng(seed));
          expect(q.wrong, t.id).toHaveLength(3);
          expect(new Set([q.correct, ...q.wrong]).size, t.id).toBe(4);
        }
      }
    }
  });
});
