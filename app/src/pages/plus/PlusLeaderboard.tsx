import { motion } from 'framer-motion';
import { Crown, Flame, Info } from 'lucide-react';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { isFirebaseConfigured } from '@/config/env';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { buildLeaderboard } from '@/services/leaderboard';
import { firebaseSync, type RemoteLeaderboardRow } from '@/services/storage/firebaseSync';
import { useApp } from '@/store/context';
import type { LeaderboardScope } from '@/types';

const SCOPES: LeaderboardScope[] = ['global', 'weekly', 'friends'];

export default function PlusLeaderboard() {
  const s = useStrings();
  const { profile, today } = useApp();
  const { progress } = useMode();
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [remote, setRemote] = useState<RemoteLeaderboardRow[]>([]);
  useDocumentTitle('Leaderboard');

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    firebaseSync
      .fetchLeaderboard('plus')
      .then(setRemote)
      .catch(() => setRemote([]));
  }, []);

  if (!profile) return null;
  const entries = buildLeaderboard('plus', scope, { profile, progress }, remote, today);
  const metric = scope === 'weekly' ? 'weeklyXp' : 'xp';
  const me = entries.find((e) => e.isCurrentUser)!;
  const top3 = entries.slice(0, 3);
  const others = entries.slice(3);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const next = SCOPES[(i + d + SCOPES.length) % SCOPES.length];
    setScope(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  // Badges colors for score circles from Image 2 Screen 3
  const SCORE_BADGES = [
    'bg-[#22c55e] text-white',
    'bg-[#f97316] text-white',
    'bg-[#a855f7] text-white',
    'bg-[#06b6d4] text-white',
    'bg-[#eab308] text-slate-950',
    'bg-[#f43f5e] text-white',
    'bg-[#3b82f6] text-white',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">{s.nav.leaderboard}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {scope === 'weekly' ? 'XP earned in the last 7 days' : scope === 'friends' ? 'You and your study friends' : 'All-time XP rankings'}
          </p>
        </div>

        {/* Diamond / Reward Pill Badge from Image 2 Screen 3 */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-900 bg-white px-3.5 py-1.5 text-sm font-black text-slate-900 shadow-[0_2px_0_#0f172a]">
            <span aria-hidden>💎</span>
            <span className="tabular">{progress.coins}</span>
          </div>
          <div role="tablist" aria-label="Leaderboard scope" className="flex gap-1 rounded-2xl bg-slate-100 p-1">
            {SCOPES.map((sc, i) => (
              <button
                key={sc}
                id={`tab-${sc}`}
                role="tab"
                type="button"
                aria-selected={scope === sc}
                aria-controls="board-panel"
                tabIndex={scope === sc ? 0 : -1}
                onClick={() => setScope(sc)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn('rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold transition', scope === sc ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-ink')}
              >
                {s.leaderboard[sc]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="board-panel" role="tabpanel" aria-labelledby={`tab-${scope}`} className="space-y-6">
        {/* Podium inspired by Image 2 Screen 3 */}
        <Card className="overflow-hidden p-6 sm:p-8 bg-[#FAF7F0] border-2 border-slate-200">
          <div className="mx-auto grid max-w-md grid-cols-3 items-end gap-3 sm:gap-6">
            {/* 2nd Place: Left (Liam) */}
            {top3[1] && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar avatarId={top3[1].avatarId} size="md" className="ring-4 ring-slate-300 shadow-sm" />
                  <span className="absolute -bottom-2 -right-1 flex size-6 items-center justify-center rounded-full bg-slate-400 text-xs font-black text-white shadow">
                    2
                  </span>
                </div>
                <p className="mt-3 w-full truncate text-sm font-black text-ink">{top3[1].name}</p>
                <p className="text-xs font-bold text-slate-500 tabular">{top3[1][metric].toLocaleString('en')} Point</p>
                <div className="mt-3 flex h-16 w-full items-center justify-center rounded-t-2xl bg-gradient-to-b from-slate-200 to-slate-300 text-xl font-black text-slate-700 shadow-inner">
                  2
                </div>
              </motion.div>
            )}

            {/* 1st Place: Center (Emma with Crown) */}
            {top3[0] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-col items-center text-center -mt-4">
                <Crown className="mb-1 size-7 text-amber-500 animate-bounce" aria-hidden />
                <div className="relative">
                  <Avatar avatarId={top3[0].avatarId} size="lg" className="ring-4 ring-amber-400 shadow-md" />
                  <span className="absolute -bottom-2 -right-1 flex size-7 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-amber-950 shadow">
                    1
                  </span>
                </div>
                <p className="mt-3 w-full truncate text-base font-black text-ink">{top3[0].name}</p>
                <p className="text-xs font-black text-amber-700 tabular">{top3[0][metric].toLocaleString('en')} Point</p>
                <div className="mt-3 flex h-24 w-full items-center justify-center rounded-t-2xl bg-gradient-to-b from-amber-300 to-amber-500 text-2xl font-black text-amber-950 shadow-inner">
                  1
                </div>
              </motion.div>
            )}

            {/* 3rd Place: Right (Noah) */}
            {top3[2] && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar avatarId={top3[2].avatarId} size="md" className="ring-4 ring-orange-300 shadow-sm" />
                  <span className="absolute -bottom-2 -right-1 flex size-6 items-center justify-center rounded-full bg-orange-400 text-xs font-black text-white shadow">
                    3
                  </span>
                </div>
                <p className="mt-3 w-full truncate text-sm font-black text-ink">{top3[2].name}</p>
                <p className="text-xs font-bold text-slate-500 tabular">{top3[2][metric].toLocaleString('en')} Point</p>
                <div className="mt-3 flex h-12 w-full items-center justify-center rounded-t-2xl bg-gradient-to-b from-orange-200 to-orange-300 text-xl font-black text-orange-800 shadow-inner">
                  3
                </div>
              </motion.div>
            )}
          </div>
        </Card>

        {/* Your position */}
        <Card className="flex flex-wrap items-center gap-4 border-2 border-slate-900 bg-teal-50/80 p-4 shadow-[0_3px_0_#0f172a]">
          <span className="text-2xl font-black text-teal-800 tabular">#{me.rank}</span>
          <Avatar avatarId={me.avatarId} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-ink">Your Rank: #{me.rank}</p>
            <p className="text-xs text-slate-600">
              {me.rank === 1 ? 'You’re leading the board — defend your title!' : `${(entries[me.rank - 2][metric] - me[metric] + 1).toLocaleString('en')} XP to overtake ${entries[me.rank - 2].name}`}
            </p>
          </div>
          <span className="font-black text-ink tabular">{me[metric].toLocaleString('en')} XP</span>
        </Card>

        {/* View Switcher: Card List (Image 2 style) vs Table */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-600">Rankings</p>
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={cn('rounded-lg px-3 py-1 transition', viewMode === 'cards' ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink')}
            >
              Card View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn('rounded-lg px-3 py-1 transition', viewMode === 'table' ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink')}
            >
              Table View
            </button>
          </div>
        </div>

        {/* Card View from Image 2 Screen 3 */}
        {viewMode === 'cards' ? (
          <div className="space-y-2.5">
            {others.map((e, idx) => {
              const badgeClass = SCORE_BADGES[idx % SCORE_BADGES.length];
              const scoreNum = Math.max(30, Math.min(95, Math.round(92 - idx * 7)));
              return (
                <div
                  key={e.id}
                  className={cn(
                    'flex items-center justify-between rounded-2xl border-2 p-3 transition hover:shadow-sm sm:p-4',
                    e.isCurrentUser ? 'border-teal-600 bg-teal-50/60 shadow-sm' : 'border-slate-200/90 bg-white',
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-5 text-center font-black text-slate-500 text-sm tabular">{e.rank}</span>
                    <Avatar avatarId={e.avatarId} size="sm" className="ring-2 ring-slate-100" />
                    <div className="min-w-0">
                      <p className="truncate font-black text-sm text-ink flex items-center gap-1.5">
                        {e.name}
                        {e.isCurrentUser && <span className="rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-bold text-white uppercase">{s.leaderboard.you}</span>}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold">{e[metric].toLocaleString('en')} Points</p>
                    </div>
                  </div>

                  {/* Circular Score Badge from Image 2 Screen 3 */}
                  <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-sm', badgeClass)}>
                    {scoreNum}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <caption className="sr-only">{`${s.leaderboard[scope]} leaderboard`}</caption>
                <thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase">
                  <tr>
                    <th scope="col" className="w-16 px-4 py-3">Rank</th>
                    <th scope="col" className="px-4 py-3">Learner</th>
                    <th scope="col" className="px-4 py-3 text-right">Level</th>
                    <th scope="col" className="px-4 py-3 text-right">Streak</th>
                    <th scope="col" className="px-4 py-3 text-right">{scope === 'weekly' ? 'Weekly XP' : 'XP'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {entries.map((e) => (
                    <tr key={e.id} className={cn(e.isCurrentUser ? 'bg-teal-50 font-bold' : 'bg-white')} aria-current={e.isCurrentUser ? 'true' : undefined}>
                      <td className="px-4 py-2.5 font-black text-slate-500 tabular">{e.rank}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar avatarId={e.avatarId} size="xs" />
                          <div className="min-w-0">
                            <p className="truncate text-ink">
                              {e.name}
                              {e.isCurrentUser && <span className="ml-2 rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-bold text-white uppercase">{s.leaderboard.you}</span>}
                              {e.isDemo && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase">{s.common.demo}</span>}
                            </p>
                            {e.city && <p className="text-xs font-normal text-slate-500">{e.city}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right tabular">{e.level}</td>
                      <td className="px-4 py-2.5 text-right tabular">
                        <span className="inline-flex items-center gap-1 text-orange-600">
                          <Flame className="size-3.5" aria-hidden />
                          {e.streak}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-ink tabular">{e[metric].toLocaleString('en')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <p className="flex items-start gap-2 text-xs text-slate-500">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden /> {s.leaderboard.demoNote}
        </p>
      </div>
    </div>
  );
}
