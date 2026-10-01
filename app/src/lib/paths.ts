import type { ExperienceMode, GameId } from '@/types';

/** All in-app URLs in one place, so navigation never drifts out of sync with the router. */
export function paths(mode: ExperienceMode) {
  const base = mode === 'kids' ? '/kids' : '/plus';
  return {
    home: base,
    learn: `${base}/learn`,
    lesson: (topicId: string) => `${base}/learn/${topicId}`,
    /** Kids create quizzes from Play; 15+ from Quizzes. */
    generator: mode === 'kids' ? `${base}/play` : `${base}/quizzes`,
    generatorFor: (topicId: string, difficulty?: string) =>
      `${mode === 'kids' ? `${base}/play` : `${base}/quizzes`}?topic=${topicId}${difficulty ? `&difficulty=${difficulty}` : ''}#create`,
    quiz: `${base}/quiz`,
    results: (attemptId: string) => `${base}/results/${attemptId}`,
    game: (gameId: GameId) => `${base}/game/${gameId}`,
    games: mode === 'kids' ? `${base}/play#games` : `${base}/challenges`,
    rewards: mode === 'kids' ? `${base}/rewards` : `${base}/badges`,
    leaderboard: mode === 'kids' ? `${base}/rewards#heroes` : `${base}/leaderboard`,
    progress: mode === 'kids' ? `${base}/profile#progress` : `${base}/progress`,
    profile: `${base}/profile`,
  };
}

export const modeName = (mode: ExperienceMode) => (mode === 'kids' ? 'EcoQuest Kids' : 'EcoQuest 15+');
