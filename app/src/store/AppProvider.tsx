import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { isFirebaseConfigured } from '@/config/env';
import { dateKey } from '@/engine/dates';
import { applyGameResult, applyLessonComplete, applyQuizAttempt, emptyProgress, spendHint } from '@/engine/gamification/progress';
import { buildAttempt } from '@/engine/quiz/attempt';
import type { QuizSummary } from '@/engine/quiz/scoring';
import type { QuizSession } from '@/engine/quiz/session';
import { uid } from '@/engine/random';
import { authService } from '@/services/auth/authService';
import { seedDemoProgress } from '@/services/demo/seedDemo';
import { signOutFirebase } from '@/services/firebase/client';
import { accountStore, type SavedAccount } from '@/services/storage/accountStore';
import { firebaseSync } from '@/services/storage/firebaseSync';
import { emptyState, localStore, normalizeState } from '@/services/storage/localStore';
import { sessionStore } from '@/services/storage/sessionStore';
import type { ExperienceMode, GameRecord, PersistedState, QuizAttempt, RewardOutcome, UserProfile } from '@/types';
import { AppContext, type AppContextValue, type Celebration, type SyncStatus } from './context';

const STORAGE_KEY = 'ecoquest:v1:state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => localStore.load() ?? emptyState());
  const stateRef = useRef(state);
  const [today, setToday] = useState(dateKey);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isFirebaseConfigured ? 'idle' : 'off');
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => accountStore.list());
  /** Name of the learner who just logged out — shown on the sign-in screen. */
  const [loggedOutName, setLoggedOutName] = useState<string | null>(null);
  const pushTimer = useRef<number | undefined>(undefined);

  /** Firebase write-through: debounced so a burst of updates becomes one write. */
  const schedulePush = useCallback((next: PersistedState) => {
    if (!isFirebaseConfigured || !next.profile) return;
    window.clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        await firebaseSync.push(await authService.resolveUserId(next.profile!.id), next);
        setSyncStatus('idle');
      } catch (err) {
        console.warn('[EcoQuest] Cloud sync failed; progress is still saved locally.', err);
        setSyncStatus('error');
      }
    }, 1500);
  }, []);

  const commit = useCallback(
    (updater: (prev: PersistedState) => PersistedState) => {
      const next = { ...updater(stateRef.current), updatedAt: Date.now() };
      stateRef.current = next;
      setState(next);
      localStore.save(next);
      schedulePush(next);
      return next;
    },
    [schedulePush],
  );

  /**
   * Parks the signed-in learner (if any) in the saved-accounts list and clears anything tied to
   * their session, so the next learner on this device starts clean.
   */
  const parkCurrentLearner = useCallback(() => {
    window.clearTimeout(pushTimer.current);
    if (stateRef.current.profile) accountStore.save(stateRef.current);
    sessionStore.clear('kids');
    sessionStore.clear('plus');
    setCelebrations([]);
  }, []);

  const refreshAccounts = useCallback(() => {
    setSavedAccounts(accountStore.list());
  }, []);

  const celebrate = useCallback((outcome: RewardOutcome) => {
    const items: Celebration[] = [];
    if (outcome.levelAfter > outcome.levelBefore) items.push({ id: uid('c'), kind: 'level', level: outcome.levelAfter });
    for (const badgeId of outcome.newBadges) items.push({ id: uid('c'), kind: 'badge', badgeId });
    if (items.length) setCelebrations((c) => [...c, ...items]);
  }, []);

  // Keep "today" fresh across midnight so streaks and the daily challenge roll over.
  useEffect(() => {
    const t = window.setInterval(() => setToday((d) => (d === dateKey() ? d : dateKey())), 60_000);
    return () => window.clearInterval(t);
  }, []);

  // Other tabs: pick up their saves.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('ecoquest:v1:account')) setSavedAccounts(accountStore.list());
      if (e.key !== STORAGE_KEY) return;
      const loaded = e.newValue ? normalizeState(JSON.parse(e.newValue)) : emptyState();
      if (loaded) {
        stateRef.current = loaded;
        setState(loaded);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Firebase: pull newer cloud progress once on start.
  useEffect(() => {
    if (!isFirebaseConfigured || !stateRef.current.profile) return;
    let cancelled = false;
    (async () => {
      try {
        setSyncStatus('syncing');
        const remote = await firebaseSync.pull(await authService.resolveUserId(stateRef.current.profile!.id));
        if (!cancelled && remote && remote.updatedAt > stateRef.current.updatedAt) {
          stateRef.current = remote;
          setState(remote);
          localStore.save(remote);
        }
        setSyncStatus('idle');
      } catch {
        setSyncStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const createProfile = useCallback(
    (input: { name: string; avatarId: string; mode: ExperienceMode }) => {
      const profile: UserProfile = {
        id: uid('learner'),
        name: input.name.trim(),
        avatarId: input.avatarId,
        activeMode: input.mode,
        createdAt: Date.now(),
        isDemo: false,
      };
      parkCurrentLearner();
      setLoggedOutName(null);
      commit(() => ({ ...emptyState(), profile, progress: { kids: emptyProgress(), plus: emptyProgress() } }));
      refreshAccounts();
    },
    [commit, parkCurrentLearner, refreshAccounts],
  );

  const startDemo = useCallback(
    (mode: ExperienceMode) => {
      const id = uid('demo');
      const day = dateKey();
      const profile: UserProfile = { id, name: 'Demo Student', avatarId: 'fox', activeMode: mode, createdAt: Date.now(), isDemo: true };
      // A fresh demo replaces any earlier demo student rather than piling up copies.
      if (stateRef.current.profile?.isDemo) stateRef.current = emptyState();
      parkCurrentLearner();
      accountStore.list().filter((a) => a.isDemo).forEach((a) => accountStore.remove(a.id));
      setLoggedOutName(null);
      commit(() => ({ ...emptyState(), profile, progress: { kids: seedDemoProgress('kids', id, day), plus: seedDemoProgress('plus', id, day) } }));
      refreshAccounts();
    },
    [commit, parkCurrentLearner, refreshAccounts],
  );

  /** Logs out: progress stays saved on this device and the learner can sign back in anytime. */
  const logout = useCallback(() => {
    if (!stateRef.current.profile) return;
    setLoggedOutName(stateRef.current.profile.name);
    parkCurrentLearner();
    void signOutFirebase();
    const fresh = emptyState();
    stateRef.current = fresh;
    setState(fresh);
    localStore.save(fresh);
    refreshAccounts();
  }, [parkCurrentLearner, refreshAccounts]);

  /** Signs a saved learner back in. Returns the experience to open, or null if they're no longer saved. */
  const signIn = useCallback(
    (accountId: string): ExperienceMode | null => {
      const saved = accountStore.load(accountId);
      if (!saved?.profile) {
        accountStore.remove(accountId);
        refreshAccounts();
        return null;
      }
      if (stateRef.current.profile?.id !== accountId) parkCurrentLearner();
      accountStore.remove(accountId);
      setLoggedOutName(null);
      commit(() => saved);
      refreshAccounts();
      return saved.profile.activeMode;
    },
    [commit, parkCurrentLearner, refreshAccounts],
  );

  /** Permanently removes a saved (signed-out) learner from this device. */
  const forgetAccount = useCallback(
    (accountId: string) => {
      accountStore.remove(accountId);
      refreshAccounts();
    },
    [refreshAccounts],
  );

  const updateProfile = useCallback(
    (patch: Partial<Pick<UserProfile, 'name' | 'avatarId'>>) => {
      commit((s) => (s.profile ? { ...s, profile: { ...s.profile, ...patch, name: (patch.name ?? s.profile.name).trim() } } : s));
    },
    [commit],
  );

  const switchMode = useCallback(
    (mode: ExperienceMode) => {
      if (stateRef.current.profile?.activeMode === mode) return;
      commit((s) => (s.profile ? { ...s, profile: { ...s.profile, activeMode: mode } } : s));
    },
    [commit],
  );

  const completeQuiz = useCallback(
    (session: QuizSession, summary: QuizSummary): { attempt: QuizAttempt; outcome: RewardOutcome | null } => {
      const s = stateRef.current;
      const mode = session.quiz.experienceMode;
      const attempt = buildAttempt(session, summary, s.profile?.id ?? 'guest');
      const existing = s.progress[mode].attempts.find((a) => a.id === attempt.id);
      if (existing) return { attempt: existing, outcome: null }; // already committed (e.g. double effect)
      const result = applyQuizAttempt(s.progress[mode], attempt, dateKey(), Date.now());
      commit((prev) => ({ ...prev, progress: { ...prev.progress, [mode]: result.progress } }));
      sessionStore.clear(mode);
      celebrate(result.outcome);
      return { attempt, outcome: result.outcome };
    },
    [commit, celebrate],
  );

  const completeGame = useCallback(
    (mode: ExperienceMode, record: GameRecord): RewardOutcome => {
      const result = applyGameResult(stateRef.current.progress[mode], record, dateKey(), Date.now());
      commit((prev) => ({ ...prev, progress: { ...prev.progress, [mode]: result.progress } }));
      celebrate(result.outcome);
      return result.outcome;
    },
    [commit, celebrate],
  );

  const completeLesson = useCallback(
    (mode: ExperienceMode, topicId: string): RewardOutcome | null => {
      const result = applyLessonComplete(stateRef.current.progress[mode], topicId, dateKey(), Date.now());
      if (!result) return null;
      commit((prev) => ({ ...prev, progress: { ...prev.progress, [mode]: result.progress } }));
      celebrate(result.outcome);
      return result.outcome;
    },
    [commit, celebrate],
  );

  const buyHint = useCallback(
    (mode: ExperienceMode): boolean => {
      const next = spendHint(stateRef.current.progress[mode]);
      if (!next) return false;
      commit((prev) => ({ ...prev, progress: { ...prev.progress, [mode]: next } }));
      return true;
    },
    [commit],
  );

  const resetAll = useCallback(() => {
    localStore.clear();
    const fresh = emptyState();
    stateRef.current = fresh;
    setState(fresh);
    setCelebrations([]);
    setSavedAccounts([]);
  }, []);

  const dismissCelebration = useCallback((id: string) => setCelebrations((c) => c.filter((x) => x.id !== id)), []);

  const value = useMemo<AppContextValue>(() => {
    const mode: ExperienceMode = state.profile?.activeMode ?? 'kids';
    return {
      state,
      profile: state.profile,
      mode,
      progress: state.progress[mode],
      today,
      celebrations,
      syncStatus,
      savedAccounts,
      loggedOutName,
      createProfile,
      startDemo,
      logout,
      signIn,
      forgetAccount,
      updateProfile,
      switchMode,
      completeQuiz,
      completeGame,
      completeLesson,
      buyHint,
      resetAll,
      dismissCelebration,
    };
  }, [state, today, celebrations, syncStatus, savedAccounts, loggedOutName, createProfile, startDemo, logout, signIn, forgetAccount, updateProfile, switchMode, completeQuiz, completeGame, completeLesson, buyHint, resetAll, dismissCelebration]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
