import { useEffect, useRef, useState } from 'react';

/**
 * Wall-clock based countdown (no drift, survives slow renders). Calls `onExpire` exactly once per
 * `resetKey`. While `running` is false the remaining time is frozen; changing `resetKey` restarts it.
 */
export function useCountdown(durationMs: number, running: boolean, onExpire: () => void, resetKey: unknown, tickMs = 100): number {
  const [remaining, setRemaining] = useState(durationMs);
  const remainingRef = useRef(durationMs);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  // Reset when the key or duration changes. Declared before the ticking effect so it runs first.
  useEffect(() => {
    remainingRef.current = durationMs;
    expiredRef.current = false;
    setRemaining(durationMs);
  }, [resetKey, durationMs]);

  useEffect(() => {
    if (!running || expiredRef.current) return;
    const endAt = Date.now() + remainingRef.current;
    const tick = () => {
      const left = Math.max(0, endAt - Date.now());
      remainingRef.current = left;
      setRemaining(left);
      if (left <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        window.clearInterval(id);
        onExpireRef.current();
      }
    };
    const id = window.setInterval(tick, tickMs);
    return () => window.clearInterval(id);
  }, [running, resetKey, durationMs, tickMs]);

  return remaining;
}
