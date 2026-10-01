import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#22c55e', '#facc15', '#38bdf8', '#fb923c', '#a78bfa', '#f472b6', '#14b8a6'];

/** A short celebratory burst. Re-key it to replay. Hidden from assistive tech and skipped for reduced motion. */
export function Confetti({ count = 28, spread = 220 }: { count?: number; spread?: number }) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = spread * (0.5 + Math.random() * 0.5);
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 60,
          rotate: Math.random() * 540 - 270,
          color: COLORS[i % COLORS.length],
          size: 6 + Math.random() * 6,
          round: Math.random() > 0.5,
        };
      }),
    [count, spread],
  );
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ width: p.size, height: p.size * (p.round ? 1 : 0.5), background: p.color, borderRadius: p.round ? 999 : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 140], opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
