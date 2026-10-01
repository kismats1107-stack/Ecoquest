import { motion } from 'framer-motion';
import { ArrowRight, Coins, Flame, Star } from 'lucide-react';
import { Link } from 'react-router';
import { Mascot } from '@/components/brand/Mascot';
import { EcoJourneyMap } from '@/components/kids/EcoJourneyMap';
import { BadgeGrid } from '@/components/rewards/BadgeGrid';
import { DailyChallengeCard } from '@/components/rewards/DailyChallengeCard';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { getGamesForMode } from '@/data/games';
import { levelFromXp, nextRank, rankFor } from '@/engine/gamification/levels';
import { currentStreak } from '@/engine/gamification/streak';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import { useApp } from '@/store/context';

const GAME_BG: Record<string, string> = {
  'recycle-sort': 'from-emerald-300 to-lime-200',
  'memory-match': 'from-violet-300 to-fuchsia-200',
  'clean-ocean': 'from-sky-300 to-cyan-200',
};

export default function KidsHome() {
  const { profile, today } = useApp();
  const { progress } = useMode();
  useDocumentTitle('Home');
  const level = levelFromXp(progress.xp);
  const rank = rankFor('kids', level.level);
  const upcoming = nextRank('kids', level.level);
  const streak = currentStreak(progress.streak, today);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const tiles = [
    { label: 'Eco Stars', value: progress.xp.toLocaleString('en'), icon: <Star className="size-7 fill-amber-400 text-amber-500" aria-hidden />, cls: 'bg-amber-50 border-amber-200' },
    { label: 'Coins', value: progress.coins.toLocaleString('en'), icon: <Coins className="size-7 text-gold-600" aria-hidden />, cls: 'bg-yellow-50 border-yellow-200' },
    { label: 'Day streak', value: String(streak), icon: <Flame className="size-7 fill-orange-400 text-orange-500" aria-hidden />, cls: 'bg-orange-50 border-orange-200' },
    { label: `Level ${level.level}`, value: rank.name, icon: <span className="text-3xl" aria-hidden>{rank.emoji}</span>, cls: 'bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
        <Mascot mood="happy" className="size-24 shrink-0 sm:size-28" />
        <div className="relative w-full rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-card">
          <span className="absolute -left-2 bottom-8 hidden size-4 rotate-45 border-b-2 border-l-2 border-emerald-100 bg-white sm:block" aria-hidden />
          <h1 className="font-fun text-2xl font-semibold text-ink sm:text-3xl">
            {greeting}, {profile?.name}! 👋
          </h1>
          <p className="mt-1 text-slate-600">{streak > 0 ? `You’re on a ${streak}-day streak — keep it growing!` : 'Ready for today’s mission? Let’s learn and play!'}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-fun text-sm font-semibold text-emerald-800">
              {rank.emoji} {rank.name} · Level {level.level}
            </span>
            <div className="min-w-40 flex-1">
              <ProgressBar value={level.progress} barClassName="bg-gradient-to-r from-emerald-400 to-lime-400" label="Progress to next level" />
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {level.nextLevelXp - level.xp} more Eco Stars to Level {level.level + 1}
                {upcoming && ` · ${upcoming.emoji} ${upcoming.name} at Level ${upcoming.minLevel}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stat tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t, i) => (
          <motion.li key={t.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn('flex items-center gap-3 rounded-3xl border-2 p-4', t.cls)}>
            {t.icon}
            <div className="min-w-0">
              <p className="truncate font-fun text-2xl font-semibold text-ink">{t.value}</p>
              <p className="text-sm font-semibold text-slate-600">{t.label}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      <DailyChallengeCard />

      {/* Eco Journey */}
      <Card className="border-2 border-emerald-100 p-5 sm:p-6">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-fun text-2xl font-semibold text-ink">🗺️ My Eco Journey</h2>
            <p className="text-slate-600">Visit every stop and collect 3 stars at each one!</p>
          </div>
          <Link to={paths('kids').learn} className="inline-flex items-center gap-1 font-fun font-semibold text-emerald-700 hover:underline">
            All topics <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        {profile && <EcoJourneyMap progress={progress} avatarId={profile.avatarId} />}
      </Card>

      {/* Quick games */}
      <section aria-labelledby="quick-games">
        <h2 id="quick-games" className="mb-3 font-fun text-2xl font-semibold text-ink">
          🎮 10-Second Games
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {getGamesForMode('kids').map((g) => (
            <li key={g.id}>
              <Link to={paths('kids').game(g.id)} className={cn('group flex items-center gap-4 rounded-3xl bg-gradient-to-br p-4 shadow-[0_5px_0_rgb(0_0_0/0.08)] transition hover:-translate-y-1', GAME_BG[g.id])}>
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/80 text-4xl transition group-hover:rotate-6" aria-hidden>
                  {g.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block font-fun text-xl font-semibold text-ink">{g.name}</span>
                  <span className="block text-sm font-semibold text-slate-700">{g.tagline}</span>
                  {progress.bestGameScores[g.id] !== undefined && <span className="mt-1 block text-xs font-bold text-slate-600">🏆 Best: {progress.bestGameScores[g.id]}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Badges */}
      <section aria-labelledby="my-badges">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="my-badges" className="font-fun text-2xl font-semibold text-ink">
            🏅 My Badges
          </h2>
          <Link to={paths('kids').rewards} className="inline-flex items-center gap-1 font-fun font-semibold text-emerald-700 hover:underline">
            See all <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <BadgeGrid mode="kids" progress={progress} limit={4} />
      </section>
    </div>
  );
}
