import { useState } from 'react';
import { Award, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { BadgeGrid } from '@/components/rewards/BadgeGrid';
import { badgeDefinitions } from '@/data/badges';
import { badgeProgress } from '@/engine/gamification/badges';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';

const FILTERS = [
  { id: 'all', label: 'All Badges' },
  { id: 'unlocked', label: 'Earned' },
  { id: 'locked', label: 'In Progress' },
] as const;

export default function PlusBadges() {
  const { progress } = useMode();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  useDocumentTitle('Badge Collection · EcoQuest 15+');
  const unlocked = badgeProgress(progress).filter((b) => b.unlocked).length;
  const p = paths('plus');

  return (
    <div className="space-y-7 pb-12">
      {/* Header with Ribbon Award Icon & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-sm">
            <Award className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Badge Collection
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              Collect sustainability badges, level up your environmental mastery
            </p>
          </div>
        </div>

        {/* Unlocked Progress Counter */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
            <span>Progress:</span>
            <span className="font-mono font-black text-[#2D6A4F]">{unlocked} / {badgeDefinitions.length} Earned</span>
          </div>
          <div className="mt-1.5 h-2 w-36 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#2D6A4F] transition-all"
              style={{ width: `${(unlocked / badgeDefinitions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs: All Badges | Earned | In Progress */}
      <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white p-1.5 w-fit shadow-sm">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all',
              filter === f.id
                ? 'bg-[#13382B] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid of Badges */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <BadgeGrid mode="plus" progress={progress} filter={filter} />
      </div>

      {/* Footer Banner: Collect All Badges and become Ultimate Eco Champion */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#B7E4C7] bg-gradient-to-r from-[#EAF6F0] via-[#F4FAF6] to-[#EAF6F0] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1B4332] shadow-sm">
              <Sparkles className="size-3.5 text-amber-500" /> Milestone Achievement
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-black text-[#13382B]">
              Collect all badges and become the Ultimate Eco Champion!
            </h3>
            <p className="mt-1 text-xs sm:text-sm font-medium text-[#2D6A4F]">
              Unlock badges across waste, climate, water, and renewable energy to climb the global ranks.
            </p>
          </div>

          <Link
            to={p.generator}
            className="inline-flex items-center gap-2 rounded-full bg-[#13382B] px-6 py-3 text-xs sm:text-sm font-black text-white shadow-md transition hover:bg-[#1B4332] active:scale-95"
          >
            <span>Start Next Quiz</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
