import { levelFromXp } from '@/engine/gamification/levels';
import type { ExperienceMode, PersistedState } from '@/types';
import { kv, normalizeState } from './localStore';

/**
 * Learners who have logged out on this device. Logging out never deletes progress:
 * the learner's full state is parked here and restored when they sign back in.
 */
export interface SavedAccount {
  id: string;
  name: string;
  avatarId: string;
  activeMode: ExperienceMode;
  isDemo: boolean;
  level: Record<ExperienceMode, number>;
  xp: Record<ExperienceMode, number>;
  savedAt: number;
}

const INDEX_KEY = 'v1:accounts';
const accountKey = (id: string) => `v1:account:${id}`;

function readIndex(): SavedAccount[] {
  const list = kv.get<SavedAccount[]>(INDEX_KEY);
  return Array.isArray(list) ? list : [];
}

export const accountStore = {
  /** Saved learners, most recently active first. */
  list(): SavedAccount[] {
    return readIndex().sort((a, b) => b.savedAt - a.savedAt);
  },

  /** Parks a signed-in learner's state so they can sign back in later. */
  save(state: PersistedState): void {
    const p = state.profile;
    if (!p) return;
    kv.set(accountKey(p.id), state);
    const summary: SavedAccount = {
      id: p.id,
      name: p.name,
      avatarId: p.avatarId,
      activeMode: p.activeMode,
      isDemo: p.isDemo,
      level: { kids: levelFromXp(state.progress.kids.xp).level, plus: levelFromXp(state.progress.plus.xp).level },
      xp: { kids: state.progress.kids.xp, plus: state.progress.plus.xp },
      savedAt: Date.now(),
    };
    kv.set(INDEX_KEY, [summary, ...readIndex().filter((a) => a.id !== p.id)]);
  },

  load(id: string): PersistedState | null {
    const state = normalizeState(kv.get(accountKey(id)));
    return state?.profile ? state : null;
  },

  remove(id: string): void {
    kv.remove(accountKey(id));
    kv.set(
      INDEX_KEY,
      readIndex().filter((a) => a.id !== id),
    );
  },
};
