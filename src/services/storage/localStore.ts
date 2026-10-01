import { emptyProgress, emptyStats } from '@/engine/gamification/progress';
import type { ExperienceMode, ModeProgress, PersistedState } from '@/types';
import type { StateStore } from './types';

export const STATE_VERSION = 1;
const STATE_KEY = 'ecoquest:v1:state';

function safeStorage(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = '__ecoquest_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

/** Fills in any fields missing from older saves so the app never crashes on stale data. */
function normalizeProgress(raw: Partial<ModeProgress> | undefined): ModeProgress {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  return {
    ...base,
    ...raw,
    streak: { ...base.streak, ...(raw.streak ?? {}) },
    stats: { ...emptyStats(), ...(raw.stats ?? {}) },
    topicStats: raw.topicStats ?? {},
    badges: raw.badges ?? {},
    attempts: Array.isArray(raw.attempts) ? raw.attempts : [],
    games: Array.isArray(raw.games) ? raw.games : [],
    lessons: raw.lessons ?? {},
    dailyXp: raw.dailyXp ?? {},
    daily: raw.daily ?? null,
    bestGameScores: raw.bestGameScores ?? {},
  };
}

export function normalizeState(raw: unknown): PersistedState | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<PersistedState>;
  if (r.version !== STATE_VERSION) return null;
  const progress = (r.progress ?? {}) as Partial<Record<ExperienceMode, Partial<ModeProgress>>>;
  return {
    version: STATE_VERSION,
    profile: r.profile ?? null,
    progress: { kids: normalizeProgress(progress.kids), plus: normalizeProgress(progress.plus) },
    updatedAt: typeof r.updatedAt === 'number' ? r.updatedAt : 0,
  };
}

export function emptyState(): PersistedState {
  return { version: STATE_VERSION, profile: null, progress: { kids: emptyProgress(), plus: emptyProgress() }, updatedAt: 0 };
}

export const localStore: StateStore = {
  load() {
    const storage = safeStorage();
    if (!storage) return null;
    try {
      const raw = storage.getItem(STATE_KEY);
      return raw ? normalizeState(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },
  save(state) {
    const storage = safeStorage();
    if (!storage) return;
    try {
      storage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked — the app keeps working in memory.
    }
  },
  clear() {
    const storage = safeStorage();
    if (!storage) return;
    try {
      Object.keys(storage)
        .filter((k) => k.startsWith('ecoquest:'))
        .forEach((k) => storage.removeItem(k));
    } catch {
      // ignore
    }
  },
};

/** Small JSON helpers for secondary keys (active quiz sessions, UI preferences). */
export const kv = {
  get<T>(key: string): T | null {
    const storage = safeStorage();
    if (!storage) return null;
    try {
      const raw = storage.getItem(`ecoquest:${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown): void {
    const storage = safeStorage();
    if (!storage) return;
    try {
      storage.setItem(`ecoquest:${key}`, JSON.stringify(value));
    } catch {
      // ignore
    }
  },
  remove(key: string): void {
    const storage = safeStorage();
    if (!storage) return;
    try {
      storage.removeItem(`ecoquest:${key}`);
    } catch {
      // ignore
    }
  },
};
