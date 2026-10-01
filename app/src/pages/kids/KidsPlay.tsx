import { Play } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { QuizGenerator } from '@/components/quiz/QuizGenerator';
import { buttonClasses } from '@/components/ui/Button';
import { getGamesForMode } from '@/data/games';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';

const CARD: Record<string, string> = {
  'recycle-sort': 'from-emerald-200 via-lime-100 to-white border-emerald-200',
  'memory-match': 'from-violet-200 via-fuchsia-100 to-white border-violet-200',
  'clean-ocean': 'from-sky-200 via-cyan-100 to-white border-sky-200',
};

export default function KidsPlay() {
  const [params] = useSearchParams();
  const { progress } = useMode();
  useDocumentTitle('Play');

  return (
    <div className="space-y-8">
      <QuizGenerator key={`${params.get('topic')}-${params.get('difficulty')}`} initialTopicId={params.get('topic')} initialDifficulty={params.get('difficulty')} />

      <section id="games" aria-labelledby="games-title" className="scroll-mt-24">
        <h2 id="games-title" className="font-fun text-3xl font-semibold text-ink">
          🎮 10-Second Games
        </h2>
        <p className="mb-4 text-slate-600">Super-quick games that help you remember what you learned. Ready, set, go!</p>
        <ul className="grid gap-4 md:grid-cols-3">
          {getGamesForMode('kids').map((g) => (
            <li key={g.id} className={cn('flex flex-col rounded-[1.75rem] border-2 bg-gradient-to-b p-5 shadow-card', CARD[g.id])}>
              <span className="text-6xl" aria-hidden>
                {g.emoji}
              </span>
              <h3 className="mt-2 font-fun text-2xl font-semibold text-ink">{g.name}</h3>
              <p className="text-slate-700">{g.tagline}</p>
              <ul className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <li className="rounded-full bg-white px-2.5 py-1 text-slate-700">⏱️ 10 seconds</li>
                <li className="rounded-full bg-white px-2.5 py-1 text-slate-700">🎯 Goal: {g.target}</li>
                {progress.bestGameScores[g.id] !== undefined && <li className="rounded-full bg-white px-2.5 py-1 text-amber-700">🏆 Best: {progress.bestGameScores[g.id]}</li>}
              </ul>
              <Link to={paths('kids').game(g.id)} className={buttonClasses({ size: 'lg', chunky: true, className: 'mt-5' })}>
                <Play className="size-5 fill-current" aria-hidden /> Play
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
