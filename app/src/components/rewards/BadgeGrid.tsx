import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { badgeDefinitions } from '@/data/badges';
import { badgeProgress } from '@/engine/gamification/badges';
import { cn } from '@/lib/cn';
import type { ExperienceMode, ModeProgress } from '@/types';
import { iconFor } from '../ui/icons';
import { ProgressBar } from '../ui/Progress';

const TIER = {
  bronze: { ring: 'from-orange-300 to-amber-500', label: 'Bronze', chip: 'bg-orange-100 text-orange-800' },
  silver: { ring: 'from-slate-300 to-slate-500', label: 'Silver', chip: 'bg-slate-200 text-slate-700' },
  gold: { ring: 'from-gold-300 to-gold-600', label: 'Gold', chip: 'bg-gold-100 text-gold-700' },
} as const;

export function BadgeGrid({ mode, progress, filter = 'all', limit }: { mode: ExperienceMode; progress: ModeProgress; filter?: 'all' | 'unlocked' | 'locked'; limit?: number }) {
  const kids = mode === 'kids';
  const status = badgeProgress(progress);
  let list = badgeDefinitions.map((def) => ({ def, st: status.find((x) => x.id === def.id)! }));
  if (filter === 'unlocked') list = list.filter((x) => x.st.unlocked);
  if (filter === 'locked') list = list.filter((x) => !x.st.unlocked);
  if (limit) list = list.slice(0, limit);

  return (
    <ul className={cn('grid gap-3', kids ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2 xl:grid-cols-3')}>
      {list.map(({ def, st }, i) => {
        const Icon = iconFor(def.icon);
        const tier = TIER[def.tier];
        return (
          <motion.li
            key={def.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
            className={cn(
              'relative flex gap-3 rounded-card border bg-white p-4 shadow-card',
              kids ? 'flex-col items-center border-2 text-center' : 'items-start',
              st.unlocked ? (kids ? 'border-amber-200' : 'border-gold-100') : 'border-line',
            )}
            aria-label={`${def.name}: ${st.unlocked ? 'unlocked' : `locked, ${st.current} of ${st.target}`}`}
          >
            <span
              className={cn(
                'grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br',
                kids ? 'size-16 text-4xl' : 'size-12',
                st.unlocked ? tier.ring : 'from-slate-100 to-slate-200',
                !st.unlocked && 'grayscale',
              )}
            >
              {kids ? <span aria-hidden className={cn(!st.unlocked && 'opacity-40')}>{def.emoji}</span> : <Icon className={cn('size-6', st.unlocked ? 'text-white' : 'text-slate-400')} aria-hidden />}
            </span>
            <div className="min-w-0 flex-1">
              <div className={cn('flex items-center gap-2', kids && 'justify-center')}>
                <p className={cn('font-extrabold text-ink', kids && 'font-fun text-lg font-semibold')}>{def.name}</p>
                {!kids && <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase', tier.chip)}>{tier.label}</span>}
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{kids ? def.kidsDescription : def.description}</p>
              {!kids && <p className="mt-1 text-xs font-semibold text-slate-500">Requirement: {def.requirement}</p>}
              {st.unlocked ? (
                <p className="mt-2 text-xs font-bold text-emerald-700">✓ Unlocked{st.unlockedAt ? ` · ${new Date(st.unlockedAt).toLocaleDateString('en', { day: 'numeric', month: 'short' })}` : ''}</p>
              ) : (
                <div className="mt-2">
                  <ProgressBar value={st.current / st.target} height="h-2" barClassName={kids ? 'bg-amber-400' : 'bg-teal-600'} trackClassName="bg-slate-100" label={`${def.name} progress`} />
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 tabular">
                    <Lock className="size-3" aria-hidden /> {st.current} / {st.target}
                  </p>
                </div>
              )}
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
