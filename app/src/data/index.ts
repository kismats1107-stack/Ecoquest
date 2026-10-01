import type { BankQuestion, ExperienceMode, Lesson, QuestionTemplate, Topic } from '@/types';
import { kidsLessons } from './kids/lessons';
import { kidsQuestions } from './kids/questions';
import { kidsTemplates } from './kids/templates';
import { kidsTopics } from './kids/topics';
import { plusLessons } from './15plus/lessons';
import { plusQuestions } from './15plus/questions';
import { plusTemplates } from './15plus/templates';
import { plusTopics } from './15plus/topics';

/**
 * Content registry. Kids and 15+ content live in separate folders; the shared engines only
 * ever access content through these functions. To add a language later, add a parallel
 * content set per locale and select it here.
 */

const topicsByMode: Record<ExperienceMode, Topic[]> = { kids: kidsTopics, plus: plusTopics };
const questionsByMode: Record<ExperienceMode, BankQuestion[]> = { kids: kidsQuestions, plus: plusQuestions };
const templatesByMode: Record<ExperienceMode, QuestionTemplate[]> = { kids: kidsTemplates, plus: plusTemplates };

const allTopics = [...kidsTopics, ...plusTopics];
const allLessons = [...kidsLessons, ...plusLessons];

export function getTopics(mode: ExperienceMode): Topic[] {
  return topicsByMode[mode];
}

export function getTopic(topicId: string): Topic | undefined {
  return allTopics.find((t) => t.id === topicId);
}

export function getLesson(topicId: string): Lesson | undefined {
  return allLessons.find((l) => l.topicId === topicId);
}

export function getQuestionBank(mode: ExperienceMode): BankQuestion[] {
  return questionsByMode[mode];
}

export function getTemplates(mode: ExperienceMode): QuestionTemplate[] {
  return templatesByMode[mode];
}

export function getTopicQuestions(topicId: string): BankQuestion[] {
  const topic = getTopic(topicId);
  if (!topic) return [];
  return questionsByMode[topic.mode].filter((q) => q.topicId === topicId);
}
