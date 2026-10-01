import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/store/context';

/** Logs the current learner out and opens the sign-in screen with a confirmation message. */
export function useLogout() {
  const { logout } = useApp();
  const navigate = useNavigate();
  return useCallback(() => {
    logout();
    navigate('/start', { replace: true });
  }, [logout, navigate]);
}
