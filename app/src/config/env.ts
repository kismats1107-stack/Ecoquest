/**
 * Browser-side configuration. Only VITE_-prefixed variables reach the browser —
 * the AI key (AI_API_KEY) is read by the server and never exposed here.
 */
const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** Firebase is used only when the essential keys are present; otherwise EcoQuest runs fully in local demo mode. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

/** Base URL of the quiz API. Empty means same origin (the Vite dev server or `npm start`). */
export const apiBase = ((env.VITE_API_BASE as string | undefined) ?? '').replace(/\/$/, '');

/** Set VITE_DISABLE_AI=true to force the offline question bank (useful for demos without internet). */
export const aiDisabled = env.VITE_DISABLE_AI === 'true';
