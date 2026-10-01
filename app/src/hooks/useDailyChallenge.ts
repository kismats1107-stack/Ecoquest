import { useState } from 'react';
import { dailyChallengeFor } from '@/engine/daily';
import { generateQuiz } from '@/services/quiz';
import { useApp } from '@/store/context';
import { useMode } from './useMode';
import { useStartQuiz } from './useStartQuiz';

/** Today's Eco Challenge for the current experience, plus a launcher. */
export function useDailyChallenge() {
  const { today } = useApp();
  const { mode, progress } = useMode();
  const startQuiz = useStartQuiz(mode);
  const [starting, setStarting] = useState(false);
  const challenge = dailyChallengeFor(mode, today, progress);

  const start = async () => {
    if (starting) return;
    setStarting(true);
    try {
      const quiz = await generateQuiz(
        {
          topicId: challenge.topic.id,
          topicName: challenge.topic.name,
          topicSummary: challenge.topic.summary,
          difficulty: challenge.config.difficulty,
          questionCount: challenge.config.questionCount,
          timePerQuestion: challenge.config.timePerQuestion,
          experienceMode: mode,
        },
        // The daily challenge uses the offline bank so it starts instantly and works anywhere.
        { preferAI: false },
      );
      startQuiz(quiz, { dailyKey: today, games: challenge.config.games });
    } finally {
      setStarting(false);
    }
  };

  return { challenge, start, starting };
}
