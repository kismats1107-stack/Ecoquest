import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router';
import { getTopics } from '@/data';
import { topicMastery } from '@/engine/gamification/progress';
import { useElementWidth } from '@/hooks/useElementWidth';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import type { ModeProgress } from '@/types';
import { Avatar } from '../ui/Avatar';

/** A winding adventure trail through the eight Kids topics. Stars show mastery; the avatar marks where to go next. */
export function EcoJourneyMap({ progress, avatarId }: { progress: ModeProgress; avatarId: string }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const topics = getTopics('kids');
  const narrow = width > 0 && width < 640;
  const height = narrow ? 620 : 290;
  const points = topics.map((_, i) => {
    if (narrow) {
      const row = Math.floor(i / 2);
      const leftToRight = row % 2 === 0;
      const col = leftToRight ? i % 2 : 1 - (i % 2);
      return { x: col === 0 ? 0.24 : 0.76, y: 0.14 + row * 0.235 };
    }
    return { x: 0.065 + i * 0.124, y: i % 2 === 0 ? 0.38 : 0.68 };
  });
  const toPx = (p: { x: number; y: number }) => ({ x: p.x * width, y: p.y * height });
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${toPx(p).x},${toPx(p).y}`).join(' ');
  const masteries = topics.map((t) => topicMastery(progress, t.id));
  const currentIdx = Math.max(0, masteries.findIndex((m) => m < 0.8));

  return (
    <div ref={ref} className="relative w-full min-w-0" style={{ height }}>
      {width > 0 && (
      <>
      <svg width={width} height={height} className="absolute inset-0" aria-hidden>
        <path d={path} fill="none" stroke="#fde68a" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        <path d={path} fill="none" stroke="#f59e0b" strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <ol className="absolute inset-0">
        {topics.map((t, i) => {
          const { x, y } = toPx(points[i]);
          const m = masteries[i];
          const stars = m >= 0.8 ? 3 : m >= 0.5 ? 2 : m > 0.05 ? 1 : 0;
          const isCurrent = i === currentIdx;
          return (
            <li key={t.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
              <Link
                to={paths('kids').lesson(t.id)}
                className="group flex w-24 flex-col items-center text-center"
                aria-label={`Stop ${i + 1}: ${t.name}. ${stars} of 3 stars.${isCurrent ? ' Your next stop.' : ''}`}
              >
                {isCurrent && (
                  <motion.span className="absolute -top-9" animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                    <Avatar avatarId={avatarId} size="xs" className="ring-4 ring-amber-300" />
                  </motion.span>
                )}
                <span
                  className={cn(
                    'grid size-16 place-items-center rounded-full border-4 bg-white text-3xl shadow-lg transition group-hover:scale-110 sm:size-[72px] sm:text-4xl',
                    m >= 0.8 ? 'border-amber-400' : m > 0.05 ? 'border-emerald-400' : 'border-white',
                    isCurrent && 'ring-4 ring-amber-200',
                  )}
                >
                  <span aria-hidden>{t.emoji}</span>
                </span>
                <span className="mt-1 flex gap-0.5" aria-hidden>
                  {[0, 1, 2].map((s) => (
                    <Star key={s} className={cn('size-3.5', s < stars ? 'fill-amber-400 text-amber-500' : 'fill-white text-amber-200')} />
                  ))}
                </span>
                <span className="font-fun text-[13px] leading-tight font-semibold text-slate-700">{t.name}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      </>
      )}
    </div>
  );
}
