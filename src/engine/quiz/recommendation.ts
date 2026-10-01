import type { Difficulty, ModeProgress, Recommendation, Topic, TopicStat } from '@/types';
import { topicMastery } from '@/engine/gamification/progress';

const ORDER: Difficulty[] = ['easy', 'medium', 'hard'];
const label = (d: Difficulty) => d.charAt(0).toUpperCase() + d.slice(1);
const up = (d: Difficulty): Difficulty => ORDER[Math.min(2, ORDER.indexOf(d) + 1)];
const down = (d: Difficulty): Difficulty => ORDER[Math.max(0, ORDER.indexOf(d) - 1)];
const pct = (a: number) => `${Math.round(a * 100)}%`;

export interface DifficultySuggestion {
  difficulty: Difficulty;
  reason: string;
}

/**
 * Smart difficulty: ≥85% → step up, 60–84% → stay, <60% → step down.
 * Only a suggestion — the learner can always choose manually.
 */
export function suggestDifficulty(stat: TopicStat | undefined): DifficultySuggestion | null {
  if (!stat || !stat.lastDifficulty) return null;
  const last = stat.lastDifficulty;
  const acc = stat.lastAccuracy;
  if (acc >= 0.85) {
    return last === 'hard'
      ? { difficulty: 'hard', reason: `You scored ${pct(acc)} on Hard — keep the streak going.` }
      : { difficulty: up(last), reason: `You scored ${pct(acc)} on ${label(last)} — ready for ${label(up(last))}.` };
  }
  if (acc >= 0.6) return { difficulty: last, reason: `You scored ${pct(acc)} on ${label(last)} — one more round to master it.` };
  return last === 'easy'
    ? { difficulty: 'easy', reason: `You scored ${pct(acc)} on Easy — review the lesson and try again.` }
    : { difficulty: down(last), reason: `You scored ${pct(acc)} on ${label(last)} — build confidence on ${label(down(last))} first.` };
}

/** Picks the related topic the learner has practised least (falls back to any other topic in the mode). */
function pickNextTopic(topic: Topic, topics: Topic[], progress: ModeProgress): Topic {
  const related = topic.related.map((id) => topics.find((t) => t.id === id)).filter((t): t is Topic => !!t);
  const pool = related.length ? related : topics.filter((t) => t.id !== topic.id);
  return [...pool].sort((a, b) => topicMastery(progress, a.id) - topicMastery(progress, b.id))[0] ?? topic;
}

/** Personalised next step, based on this attempt's actual accuracy. */
export function recommendNext(
  attempt: { topicId: string; difficulty: Difficulty; accuracy: number },
  progress: ModeProgress,
  topics: Topic[],
): Recommendation {
  const topic = topics.find((t) => t.id === attempt.topicId) ?? topics[0];
  const { accuracy: acc, difficulty } = attempt;

  if (acc >= 0.85) {
    if (difficulty === 'easy') {
      return {
        kind: 'level-up',
        topicId: topic.id,
        difficulty: 'medium',
        title: `Try ${topic.name} — Medium`,
        message: `${pct(acc)} on Easy! You’re ready for a tougher challenge.`,
        reviewLesson: false,
      };
    }
    const next = pickNextTopic(topic, topics, progress);
    const nextDifficulty: Difficulty = difficulty === 'hard' ? 'hard' : 'medium';
    return {
      kind: 'next-topic',
      topicId: next.id,
      difficulty: nextDifficulty,
      title: `Try ${next.name} — ${label(nextDifficulty)}`,
      message: `${pct(acc)} on ${topic.name}. Broaden your knowledge with a related topic.`,
      reviewLesson: false,
      alternative:
        difficulty === 'medium'
          ? { topicId: topic.id, difficulty: 'hard', title: `Or take ${topic.name} to Hard` }
          : undefined,
    };
  }

  if (acc >= 0.6) {
    return {
      kind: 'practice',
      topicId: topic.id,
      difficulty,
      title: `Practise ${topic.name} — ${label(difficulty)}`,
      message: `${pct(acc)} — solid work! One more round at this level will lock it in.`,
      reviewLesson: false,
    };
  }

  const target = down(difficulty);
  const message =
    difficulty === 'easy'
      ? `${pct(acc)} — revisit the lesson, then try Easy again. You’ve got this!`
      : difficulty === 'medium'
        ? `${pct(acc)} — review the ${topic.name} basics before trying Hard. Try Easy to build confidence.`
        : `${pct(acc)} on Hard — review the lesson, then build up from Medium.`;
  return {
    kind: 'review',
    topicId: topic.id,
    difficulty: target,
    title: `Review ${topic.name} basics`,
    message,
    reviewLesson: true,
  };
}
