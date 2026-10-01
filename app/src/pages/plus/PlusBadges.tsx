import { useState } from 'react';
import { BadgeGrid } from '@/components/rewards/BadgeGrid';
import { SectionHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { badgeDefinitions } from '@/data/badges';
import { badgeProgress } from '@/engine/gamification/badges';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unlocked', label: 'Unlocked' },
  { id: 'locked', label: 'In progress' },
] as const;

export default function PlusBadges() {
  const { progress } = useMode();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  useDocumentTitle('Badges');
  const unlocked = badgeProgress(progress).filter((b) => b.unlocked).length;

  return (
    <div className="space-y-5">
      <SectionHeader
        as="h1"
        title="Badges"
        subtitle="Earn badges by learning consistently, answering accurately and mastering topics."
        action={
          <div className="w-48">
            <p className="mb-1 text-right text-sm font-bold text-ink tabular">
              {unlocked}/{badgeDefinitions.length} unlocked
            </p>
            <ProgressBar value={unlocked / badgeDefinitions.length} barClassName="bg-gold-500" trackClassName="bg-gold-100" label="Badges unlocked" />
          </div>
        }
      />
      <div role="group" aria-label="Filter badges" className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn('rounded-full px-4 py-1.5 text-sm font-bold transition', filter === f.id ? 'bg-teal-700 text-white' : 'bg-white text-slate-600 ring-1 ring-line hover:text-ink')}
          >
            {f.label}
          </button>
        ))}
      </div>
      <BadgeGrid mode="plus" progress={progress} filter={filter} />
    </div>
  );
}
