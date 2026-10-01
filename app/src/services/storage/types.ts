import type { PersistedState } from '@/types';

/** Synchronous local persistence — the source of truth for the running app. */
export interface StateStore {
  load(): PersistedState | null;
  save(state: PersistedState): void;
  clear(): void;
}

/** Optional cloud sync layered on top of local persistence (Firebase when configured). */
export interface RemoteSync {
  readonly name: string;
  pull(userId: string): Promise<PersistedState | null>;
  push(userId: string, state: PersistedState): Promise<void>;
}
