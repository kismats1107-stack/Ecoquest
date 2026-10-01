import { motion } from 'framer-motion';
import { CalendarCheck, CircleCheck, Coins, Gamepad2, ListChecks, Play, Star, Target } from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useMode } from '@/hooks/useMode';
import { useStrings } from '@/i18n';
import { cn } from '@/lib/cn';
import { Mascot } from '../brand/Mascot';
import { Button } from '../ui/Button';

/** TODAY'S ECO CHALLENGE — the most prominent card on both dashboards. */
export function DailyChallengeCard({ className }: { className?: string }) {
  const s = useStrings();
  const { mode } = useMode();
  const kids = mode === 'kids';
  const { challenge, start, starting } = useDailyChallenge();
  const { config, topic, completed, attempts, bestAccuracy } = challenge;
  const target = Math.round(config.targetAccuracy * 100);

  if (kids) {
    return (
      <section aria-labelledby="daily-title" className={cn('relative overflow-hidden rounded-[2rem] border-2 border-amber-200 bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300 p-5 text-amber-950 shadow-[0_6px_0_#f59e0b] sm:p-7', className)}>
        <div className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full bg-white/25" aria-hidden />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 size-40 rounded-full bg-white/15" aria-hidden />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 font-fun text-sm font-semibold">
              <CalendarCheck className="size-4" aria-hidden /> {s.daily.kidsTitle}
            </p>
            <h2 id="daily-title" className="mt-2 font-fun text-3xl font-semibold">
              {topic.emoji} {topic.name}
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2 font-fun text-[15px] font-semibold">
              <li className="rounded-full bg-white/60 px-3 py-1">❓ {config.questionCount} questions</li>
              <li className="rounded-full bg-white/60 px-3 py-1">🎮 1 quick game</li>
              <li className="rounded-full bg-white/60 px-3 py-1">🎯 Get {target}% right</li>
            </ul>
            <p className="mt-3 font-fun text-lg font-semibold">
              Win: <Star className="inline size-5 fill-white text-amber-700" aria-hidden /> +{challenge.rewardXp} Eco Stars · <Coins className="inline size-5" aria-hidden /> +{challenge.rewardCoins}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Mascot mood={completed ? 'cheer' : 'happy'} className="size-24" />
            {completed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-fun font-semibold text-emerald-700">
                <CircleCheck className="size-5" aria-hidden /> Mission done!
              </span>
            ) : (
              <Button size="xl" chunky variant="white" onClick={start} disabled={starting} icon={<Play className="size-5 fill-current" aria-hidden />}>
                {attempts > 0 ? s.daily.retry : s.daily.kidsStart}
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="daily-title" className={cn('relative overflow-hidden rounded-card bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-600 p-5 text-white shadow-card sm:p-6', className)}>
      <div className="bg-plus-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <motion.div className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-gold-400/20 blur-2xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} aria-hidden />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide uppercase">
            <CalendarCheck className="size-3.5" aria-hidden /> {s.daily.title}
          </p>
          <h2 id="daily-title" className="mt-2 text-2xl font-extrabold">
            {topic.emoji} {topic.name}
          </h2>
          <p className="mt-1 text-sm text-teal-50/90">{topic.tagline}</p>
          <ul className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <li className="rounded-xl bg-white/10 px-3 py-2">
              <ListChecks className="mb-1 size-4 text-teal-200" aria-hidden />
              <span className="block font-bold">{config.questionCount} questions</span>
            </li>
            <li className="rounded-xl bg-white/10 px-3 py-2">
              <Target className="mb-1 size-4 text-teal-200" aria-hidden />
              <span className="block font-bold">{s.daily.target(target)}</span>
            </li>
            <li className="rounded-xl bg-white/10 px-3 py-2">
              <Gamepad2 className="mb-1 size-4 text-teal-200" aria-hidden />
              <span className="block font-bold">1 mini-game</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-3 md:w-56">
          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs font-bold tracking-wide text-teal-100 uppercase">{s.daily.reward}</p>
            <p className="mt-0.5 text-lg font-black">
              +{challenge.rewardXp} XP <span className="text-gold-300">· +{challenge.rewardCoins} coins</span>
            </p>
            {attempts > 0 && !completed && <p className="mt-1 text-xs text-teal-100">Best today: {Math.round(bestAccuracy * 100)}%</p>}
          </div>
          {completed ? (
            <p className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-teal-800">
              <CircleCheck className="size-5" aria-hidden /> {s.daily.completed}
            </p>
          ) : (
            <Button variant="gold" size="lg" full onClick={start} disabled={starting} icon={<Play className="size-4 fill-current" aria-hidden />}>
              {attempts > 0 ? s.daily.retry : s.daily.start}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
