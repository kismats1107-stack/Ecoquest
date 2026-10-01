import { createContext, useContext } from 'react';
import { useApp } from '@/store/context';
import type { ExperienceMode, ModeProgress } from '@/types';

/** The experience defined by the current route (/kids or /plus). */
export const RouteModeContext = createContext<ExperienceMode | null>(null);

/** Mode + that mode's progress for the current route — avoids any flicker while the active mode syncs. */
export function useMode(): { mode: ExperienceMode; progress: ModeProgress } {
  const app = useApp();
  const routeMode = useContext(RouteModeContext);
  const mode = routeMode ?? app.mode;
  return { mode, progress: app.state.progress[mode] };
}
