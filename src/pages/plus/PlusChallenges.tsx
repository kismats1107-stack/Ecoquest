import { Play, Timer, Trophy } from 'lucide-react';
import { Link } from 'react-router';
import { DailyChallengeCard } from '@/components/rewards/DailyChallengeCard';
import { buttonClasses } from '@/components/ui/Button';
import { Card, EmptyState, SectionHeader } from '@/components/ui/Card';
import { getGame, getGamesForMode } from '@/data/games';
import { formatRelative } from '@/engine/dates';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';

const ACCENT: Record<string, string> = {
  'carbon-footprint': 'from-teal-600 to-emerald-500',
  'food-web': 'from-lime-600 to-emerald-500',
  'eco-decisions': 'from-violet-600 to-indigo-500',
};

export default function PlusChallenges() {
  const { progress } = useMode();
  useDocumentTitle('Challenges');
  const games = getGamesForMode('plus');
  const history = progress.games.filter((g) => games.some((d) => d.id === g.gameId)).slice(0, 12);

  return (
    <div className="space-y-6">
      <SectionHeader as="h1" title="Challenges" subtitle="Ten seconds. One decision at a time. Rapid games that reinforce what you learn." />
      <DailyChallengeCard />

      <section aria-labelledby="games-title">
        <h2 id="games-title" className="mb-3 text-lg font-extrabold text-ink">
          10-second challenges
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {games.map((g) => {
            const played = progress.games.filter((r) => r.gameId === g.id);
            const wins = played.filter((r) => r.success).length;
            return (
              <li key={g.id}>
                <Card className="flex h-full flex-col overflow-hidden">
                  <div className={cn('bg-gradient-to-br p-5 text-white', ACCENT[g.id])}>
                    <span className="text-4xl" aria-hidden>
                      {g.emoji}
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold">{g.name}</h3>
                    <p className="text-sm text-white/90">{g.tagline}</p>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <dl className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-slate-50 px-2 py-2">
                        <dt className="text-[11px] font-semibold text-slate-500">Best</dt>
                        <dd className="font-black text-ink tabular">{progress.bestGameScores[g.id] ?? '—'}</dd>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-2 py-2">
                        <dt className="text-[11px] font-semibold text-slate-500">Played</dt>
                        <dd className="font-black text-ink tabular">{played.length}</dd>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-2 py-2">
                        <dt className="text-[11px] font-semibold text-slate-500">Wins</dt>
                        <dd className="font-black text-ink tabular">{wins}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Timer className="size-3.5" aria-hidden /> 10 s · goal {g.target} {g.scoreLabel}
                    </p>
                    <Link to={paths('plus').game(g.id)} className={buttonClasses({ full: true, className: 'mt-auto' })} style={{ marginTop: 16 }}>
                      <Play className="size-4 fill-current" aria-hidden /> Play challenge
                    </Link>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <Card className="p-5 sm:p-6">
        <SectionHeader title="Challenge history" subtitle="Standalone rounds and challenges played inside quizzes" />
        {history.length ? (
          <ul className="divide-y divide-line">
            {history.map((r, i) => (
              <li key={`${r.playedAt}-${i}`} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="text-xl" aria-hidden>
                  {getGame(r.gameId).emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-ink">{getGame(r.gameId).name}</span>
                  <span className="text-xs text-slate-500">
                    {r.context === 'quiz' ? 'In a quiz' : 'Standalone'} · {formatRelative(r.playedAt)}
                  </span>
                </span>
                <span className="text-slate-600 tabular">score {r.score}</span>
                <span className={cn('inline-flex w-20 items-center justify-end gap-1 font-bold', r.success ? 'text-emerald-700' : 'text-slate-400')}>
                  {r.success && <Trophy className="size-3.5" aria-hidden />}
                  {r.success ? 'Won' : 'Missed'}
                </span>
                <span className="w-16 text-right font-bold text-teal-700 tabular">+{r.xp} XP</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon="⏱️" title="No challenges yet" body="Play a 10-second challenge to see your history." />
        )}
      </Card>
    </div>
  );
}
