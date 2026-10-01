import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { getBadge } from '@/data/badges';
import { rankFor } from '@/engine/gamification/levels';
import { cn } from '@/lib/cn';
import { useMode } from '@/hooks/useMode';
import { useApp } from '@/store/context';
import { Confetti } from '../ui/Confetti';
import { iconFor } from '../ui/icons';

/** Toasts for level-ups and newly unlocked badges, shown one at a time. */
export function CelebrationLayer() {
  const { celebrations, dismissCelebration } = useApp();
  const { mode } = useMode();
  const current = celebrations[0];

  useEffect(() => {
    if (!current) return;
    const t = window.setTimeout(() => dismissCelebration(current.id), 4500);
    return () => window.clearTimeout(t);
  }, [current, dismissCelebration]);

  let content = null;
  if (current?.kind === 'badge') {
    const badge = getBadge(current.badgeId);
    if (badge) {
      const Icon = iconFor(badge.icon);
      content = (
        <>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-2xl shadow-inner">
            {mode === 'kids' ? badge.emoji : <Icon className="size-6 text-white" aria-hidden />}
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-bold tracking-wide text-gold-700 uppercase">Badge unlocked</span>
            <span className="block truncate font-extrabold text-ink">{badge.name}</span>
            <span className="block truncate text-sm text-slate-600">{mode === 'kids' ? badge.kidsDescription : badge.description}</span>
          </span>
        </>
      );
    }
  } else if (current?.kind === 'level') {
    const rank = rankFor(mode, current.level);
    content = (
      <>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-2xl font-black text-white">{mode === 'kids' ? rank.emoji : current.level}</span>
        <span className="min-w-0">
          <span className="block text-xs font-bold tracking-wide text-emerald-700 uppercase">Level up!</span>
          <span className="block truncate font-extrabold text-ink">
            Level {current.level} · {rank.name}
          </span>
          <span className="block truncate text-sm text-slate-600">{rank.description}</span>
        </span>
      </>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4" aria-live="polite">
      <AnimatePresence mode="wait">
        {current && content && (
          <motion.div
            key={current.id}
            initial={{ y: -40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={cn('pointer-events-auto relative flex w-full max-w-sm items-center gap-3 rounded-2xl border border-gold-100 bg-white p-3 pr-10 shadow-xl', mode === 'kids' && 'border-2')}
            role="status"
          >
            {mode === 'kids' && <Confetti count={18} spread={140} />}
            {content}
            <button
              type="button"
              onClick={() => dismissCelebration(current.id)}
              className="absolute top-2 right-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-ink"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
