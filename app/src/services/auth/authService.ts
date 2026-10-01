import { isFirebaseConfigured } from '@/config/env';
import { firebaseSync } from '@/services/storage/firebaseSync';

/**
 * Auth abstraction. V1 uses a local demo identity (the profile id stored on this device).
 * When Firebase is configured, learners are signed in anonymously and their progress syncs
 * to Firestore — upgrading to email/Google sign-in only requires changing this service.
 */
export interface AuthService {
  readonly provider: 'local' | 'firebase';
  /** Resolves the id used to key cloud data. Falls back to the local profile id. */
  resolveUserId(localId: string): Promise<string>;
}

const localAuth: AuthService = {
  provider: 'local',
  resolveUserId: async (localId) => localId,
};

const firebaseAuth: AuthService = {
  provider: 'firebase',
  resolveUserId: async (localId) => (await firebaseSync.currentUid()) ?? localId,
};

export const authService: AuthService = isFirebaseConfigured ? firebaseAuth : localAuth;
