import { firebaseConfig, isFirebaseConfigured } from '@/config/env';

/**
 * Lazily initialises Firebase only when it is configured, so the Firebase SDK is never
 * downloaded in local demo mode. Uses anonymous auth to obtain a stable user id.
 */

type FirebaseHandles = {
  uid: string;
  db: import('firebase/firestore').Firestore;
  fs: typeof import('firebase/firestore');
};

let handles: Promise<FirebaseHandles | null> | null = null;

export function getFirebase(): Promise<FirebaseHandles | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null);
  if (!handles) {
    handles = (async () => {
      try {
        const [{ initializeApp, getApps, getApp }, authMod, fs] = await Promise.all([
          import('firebase/app'),
          import('firebase/auth'),
          import('firebase/firestore'),
        ]);
        const app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
        const auth = authMod.getAuth(app);
        const credential = auth.currentUser ? { user: auth.currentUser } : await authMod.signInAnonymously(auth);
        return { uid: credential.user.uid, db: fs.getFirestore(app), fs };
      } catch (err) {
        console.warn('[EcoQuest] Firebase unavailable — continuing in local mode.', err);
        return null;
      }
    })();
  }
  return handles;
}

/** Ends the Firebase session on logout, so the next learner gets their own anonymous identity. */
export async function signOutFirebase(): Promise<void> {
  if (!isFirebaseConfigured || !handles) return;
  const current = handles;
  handles = null;
  try {
    if (!(await current)) return;
    const [{ getApp }, { getAuth, signOut }] = await Promise.all([import('firebase/app'), import('firebase/auth')]);
    await signOut(getAuth(getApp()));
  } catch (err) {
    console.warn('[EcoQuest] Firebase sign-out failed.', err);
  }
}
