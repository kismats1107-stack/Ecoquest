import { createContext, useContext } from 'react';
import type { QuizSummary } from '@/engine/quiz/scoring';
import type { QuizSession } from '@/engine/quiz/session';
import type { SavedAccount } from '@/services/storage/accountStore';
import type { ExperienceMode, GameRecord, ModeProgress, PersistedState, QuizAttempt, RewardOutcome, UserProfile } from '@/types';

export type Celebration = { id: string; kind: 'level'; level: number } | { id: string; kind: 'badge'; badgeId: string };

export type SyncStatus = 'off' | 'idle' | 'syncing' | 'error';

export interface AppContextValue {
  state: PersistedState;
  profile: UserProfile | null;
  mode: ExperienceMode;
  /** Progress for the active experience. */
  progress: ModeProgress;
  today: string;
  celebrations: Celebration[];
  syncStatus: SyncStatus;
  /** Learners who have logged out on this device and can sign back in. */
  savedAccounts: SavedAccount[];
  /** Set right after a logout so the sign-in screen can confirm it. */
  loggedOutName: string | null;
  createProfile(input: { name: string; avatarId: string; mode: ExperienceMode }): void;
  startDemo(mode: ExperienceMode): void;
  logout(): void;
  signIn(accountId: string): ExperienceMode | null;
  forgetAccount(accountId: string): void;
  updateProfile(patch: Partial<Pick<UserProfile, 'name' | 'avatarId'>>): void;
  switchMode(mode: ExperienceMode): void;
  completeQuiz(session: QuizSession, summary: QuizSummary): { attempt: QuizAttempt; outcome: RewardOutcome | null };
  completeGame(mode: ExperienceMode, record: GameRecord): RewardOutcome;
  completeLesson(mode: ExperienceMode, topicId: string): RewardOutcome | null;
  buyHint(mode: ExperienceMode): boolean;
  resetAll(): void;
  dismissCelebration(id: string): void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
