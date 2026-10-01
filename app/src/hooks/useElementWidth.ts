import { useEffect, useRef, useState } from 'react';

/**
 * Tracks an element's width so SVG charts can lay out in real pixels (keeps corners and strokes crisp).
 * Starts at 0 so nothing wider than the container is ever rendered before measuring.
 */
export function useElementWidth<T extends HTMLElement>(fallback = 0) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth || fallback);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fallback]);
  return [ref, width] as const;
}
