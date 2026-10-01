import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { RouteModeContext } from '@/hooks/useMode';
import { useApp } from '@/store/context';
import type { ExperienceMode } from '@/types';

/** Requires a profile, and keeps the active experience in sync with the URL. */
export function ModeGuard({ mode, children }: { mode: ExperienceMode; children: ReactNode }) {
  const { profile, switchMode, loggedOutName } = useApp();
  const location = useLocation();

  useEffect(() => {
    if (profile && profile.activeMode !== mode) switchMode(mode);
  }, [profile, mode, switchMode]);

  if (!profile) {
    // After a logout, go straight to the sign-in screen (no deep-link back into the old session).
    if (loggedOutName) return <Navigate to="/start" replace />;
    return <Navigate to={`/start?mode=${mode}&next=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <RouteModeContext.Provider value={mode}>{children}</RouteModeContext.Provider>;
}
