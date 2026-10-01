import { getFirebase } from '@/services/firebase/client';
import { levelFromXp } from '@/engine/gamification/levels';
import { dateKey, lastNDays } from '@/engine/dates';
import type { ExperienceMode, PersistedState } from '@/types';
import { normalizeState } from './localStore';
import type { RemoteSync } from './types';

/** Public leaderboard row written for each learner when Firebase is configured. */
export interface RemoteLeaderboardRow {
  uid: string;
  name: string;
  avatarId: string;
  mode: ExperienceMode;
  xp: number;
  weeklyXp: number;
  level: number;
  streak: number;
  updatedAt: number;
}

function weeklyXp(dailyXp: Record<string, number>): number {
  return lastNDays(7, dateKey()).reduce((sum, k) => sum + (dailyXp[k] ?? 0), 0);
}

/**
 * Firestore layout:
 *   users/{uid}                 → { state: <PersistedState JSON>, updatedAt }
 *   leaderboard/{uid}_{mode}    → RemoteLeaderboardRow
 */
export const firebaseSync: RemoteSync & {
  fetchLeaderboard(mode: ExperienceMode): Promise<RemoteLeaderboardRow[]>;
  currentUid(): Promise<string | null>;
} = {
  name: 'firebase',

  async currentUid() {
    return (await getFirebase())?.uid ?? null;
  },

  async pull() {
    const fb = await getFirebase();
    if (!fb) return null;
    const snap = await fb.fs.getDoc(fb.fs.doc(fb.db, 'users', fb.uid));
    if (!snap.exists()) return null;
    const data = snap.data() as { state?: string };
    try {
      return data.state ? normalizeState(JSON.parse(data.state)) : null;
    } catch {
      return null;
    }
  },

  async push(_userId, state: PersistedState) {
    const fb = await getFirebase();
    if (!fb || !state.profile) return;
    const { doc, setDoc } = fb.fs;
    await setDoc(doc(fb.db, 'users', fb.uid), { state: JSON.stringify(state), updatedAt: state.updatedAt });
    for (const mode of ['kids', 'plus'] as ExperienceMode[]) {
      const p = state.progress[mode];
      if (p.xp === 0) continue;
      const row: RemoteLeaderboardRow = {
        uid: fb.uid,
        name: state.profile.name,
        avatarId: state.profile.avatarId,
        mode,
        xp: p.xp,
        weeklyXp: weeklyXp(p.dailyXp),
        level: levelFromXp(p.xp).level,
        streak: p.streak.current,
        updatedAt: state.updatedAt,
      };
      await setDoc(doc(fb.db, 'leaderboard', `${fb.uid}_${mode}`), row);
    }
  },

  async fetchLeaderboard(mode) {
    const fb = await getFirebase();
    if (!fb) return [];
    const { collection, query, where, orderBy, limit, getDocs } = fb.fs;
    const q = query(collection(fb.db, 'leaderboard'), where('mode', '==', mode), orderBy('xp', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as RemoteLeaderboardRow).filter((r) => r.uid !== fb.uid);
  },
};
