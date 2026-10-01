import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router';
import { BadgeGrid } from '@/components/rewards/BadgeGrid';
import { Avatar } from '@/components/ui/Avatar';
import { Card, EmptyState } from '@/components/ui/Card';
import { KIDS_RANKS } from '@/config/gamification';
import { getTopic } from '@/data';
import { formatRelative } from '@/engine/dates';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import { buildLeaderboard } from '@/services/leaderboard';
import { useApp } from '@/store/context';

export default function KidsRewards() {
  const { profile, today } = useApp();
  const { progress } = useMode();
  useDocumentTitle('Rewards');
  const level = levelFromXp(progress.xp);
  const rank = rankFor('kids', level.level);
  const heroes = profile ? buildLeaderboard('kids', 'weekly', { profile, progress }, [], today) : [];
  const me = heroes.find((h) => h.isCurrentUser);
  const ahead = me && me.rank > 1 ? heroes[me.rank - 2] : null;
  const unlockedCount = Object.keys(progress.badges).length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-fun text-3xl font-semibold text-ink sm:text-4xl">🏆 My Rewards</h1>
        <p className="mt-1 text-lg text-slate-600">
          You have <strong className="text-amber-600">{progress.xp.toLocaleString('en')} Eco Stars</strong> and {unlockedCount} badge{unlockedCount === 1 ? '' : 's'}!
        </p>
      </header>

      {/* Rank journey */}
      <Card className="border-2 border-emerald-100 p-5 sm:p-6">
        <h2 className="mb-4 font-fun text-2xl font-semibold text-ink">🌱 My Growth Path</h2>
        <ol className="grid grid-cols-5 gap-1 sm:gap-3">
          {KIDS_RANKS.map((r, i) => {
            const reached = level.level >= r.minLevel;
            const current = r.name === rank.name;
            return (
              <li key={r.name} className="relative flex flex-col items-center text-center">
                {i > 0 && <span className={cn('absolute top-7 right-1/2 -z-0 h-1.5 w-full', reached ? 'bg-emerald-400' : 'bg-slate-200')} aria-hidden />}
                <motion.span
                  animate={current ? { scale: [1, 1.08, 1] } : undefined}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className={cn(
                    'relative z-10 grid size-14 place-items-center rounded-full border-4 text-3xl sm:size-16',
                    reached ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white grayscale',
                    current && 'ring-4 ring-amber-300',
                  )}
                >
                  <span aria-hidden>{r.emoji}</span>
                </motion.span>
                <span className={cn('mt-2 font-fun text-sm leading-tight font-semibold sm:text-base', reached ? 'text-ink' : 'text-slate-400')}>{r.name}</span>
                <span className="text-[11px] font-semibold text-slate-500">Lv {r.minLevel}+</span>
                {current && <span className="sr-only">(you are here)</span>}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center font-fun font-semibold text-emerald-800">
          {rank.emoji} You’re a {rank.name}! {rank.description}
        </p>
      </Card>

      {/* Badges */}
      <section aria-labelledby="badges-title">
        <h2 id="badges-title" className="mb-3 font-fun text-2xl font-semibold text-ink">
          🏅 Badge Collection
        </h2>
        <BadgeGrid mode="kids" progress={progress} />
      </section>

      {/* Eco Heroes */}
      <section id="heroes" aria-labelledby="heroes-title" className="scroll-mt-24">
        <Card className="border-2 border-sky-100 p-5 sm:p-6">
          <h2 id="heroes-title" className="font-fun text-2xl font-semibold text-ink">
            🦸 Eco Heroes This Week
          </h2>
          <p className="mb-4 text-slate-600">Every Eco Hero is helping the planet. Look how many stars everyone earned!</p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {heroes.slice(0, 8).map((h) => (
              <li key={h.id} className={cn('flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5', h.isCurrentUser ? 'border-amber-300 bg-amber-50' : 'border-slate-100 bg-white')}>
                <Avatar avatarId={h.avatarId} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-fun text-lg font-semibold text-ink">
                    {h.isCurrentUser ? `${h.name} (you!)` : h.name}
                  </span>
                  {h.isDemo && <span className="text-[11px] font-bold text-slate-400 uppercase">Demo friend</span>}
                </span>
                <span className="inline-flex items-center gap-1 font-fun font-semibold text-amber-700 tabular">
                  <Star className="size-4 fill-amber-400 text-amber-500" aria-hidden /> {h.weeklyXp}
                </span>
              </li>
            ))}
          </ul>
          {me && me.rank > 8 && (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 font-fun font-semibold text-amber-800">
              ⭐ You: {me.weeklyXp} Eco Stars this week — keep going!
            </p>
          )}
          <p className="mt-4 flex items-center gap-2 font-fun font-semibold text-sky-800">
            <Heart className="size-5 fill-rose-400 text-rose-500" aria-hidden />
            {ahead ? `Just ${ahead.weeklyXp - (me?.weeklyXp ?? 0) + 1} more stars to cheer alongside ${ahead.name}!` : 'Amazing — you’re shining brightest this week!'}
          </p>
        </Card>
      </section>

      {/* History */}
      <section aria-labelledby="history-title">
        <h2 id="history-title" className="mb-3 font-fun text-2xl font-semibold text-ink">
          📜 My Quizzes
        </h2>
        {progress.attempts.length === 0 ? (
          <EmptyState icon="🎲" title="No quizzes yet" body="Make your own quiz in Play — it only takes a minute!" />
        ) : (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {progress.attempts.slice(0, 10).map((a) => {
              const stars = Math.max(1, a.accuracy >= 0.9 ? 3 : a.accuracy >= 0.7 ? 2 : 1);
              return (
                <li key={a.id}>
                  <Link to={paths('kids').results(a.id)} className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3 transition hover:border-emerald-200">
                    <span className="text-3xl" aria-hidden>
                      {getTopic(a.topicId)?.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-fun text-lg font-semibold text-ink">{a.topicName}</span>
                      <span className="text-sm text-slate-500">
                        {a.score}/{a.total} right · {formatRelative(a.completedAt)}
                      </span>
                    </span>
                    <span className="flex" aria-label={`${stars} stars`}>
                      {[0, 1, 2].map((i) => (
                        <Star key={i} className={cn('size-5', i < stars ? 'fill-amber-400 text-amber-500' : 'fill-slate-100 text-slate-200')} aria-hidden />
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
