import { ArrowRight, Coins, Crosshair, Flame, Medal, Sparkles, Star, TrendingUp, Trophy, WandSparkles } from 'lucide-react';
import { Link } from 'react-router';
import { ColumnChart } from '@/components/charts/ColumnChart';
import { BarList } from '@/components/charts/BarList';
import { StatTile } from '@/components/plus/StatTile';
import { DailyChallengeCard } from '@/components/rewards/DailyChallengeCard';
import { Avatar } from '@/components/ui/Avatar';
import { buttonClasses } from '@/components/ui/Button';
import { Card, EmptyState, Pill, SectionHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { difficultyStyles } from '@/components/ui/tones';
import { getTopic, getTopics } from '@/data';
import { formatRelative, lastNDays, parseDateKey, weekdayShort } from '@/engine/dates';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { overallAccuracy, topicMastery } from '@/engine/gamification/progress';
import { currentStreak } from '@/engine/gamification/streak';
import { recommendNext } from '@/engine/quiz/recommendation';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { cn } from '@/lib/cn';
import { paths } from '@/lib/paths';
import { buildLeaderboard, weeklyXpOf } from '@/services/leaderboard';
import { useApp } from '@/store/context';

export default function PlusDashboard() {
  const { profile, today } = useApp();
  const { progress } = useMode();
  useDocumentTitle('Dashboard');
  const p = paths('plus');
  const topics = getTopics('plus');
  const level = levelFromXp(progress.xp);
  const rank = rankFor('plus', level.level);
  const streak = currentStreak(progress.streak, today);
  const accuracy = overallAccuracy(progress);
  const days = lastNDays(7, today);
  const weekly = weeklyXpOf(progress, today);
  const board = profile ? buildLeaderboard('plus', 'global', { profile, progress }, [], today) : [];
  const me = board.find((e) => e.isCurrentUser);
  const neighbours = me ? board.slice(Math.max(0, me.rank - 2), Math.min(board.length, me.rank + 1)) : [];
  const last = progress.attempts[0];
  const rec = last ? recommendNext(last, progress, topics) : null;
  const recTopic = rec ? getTopic(rec.topicId) : topics[0];
  const mastery = topics
    .map((t) => ({ t, m: topicMastery(progress, t.id), stat: progress.topicStats[t.id] }))
    .filter((x) => x.stat)
    .sort((a, b) => b.m - a.m);

  return (
    <div className="space-y-6">
      {/* Header inspired by Image 2 Screen 2 */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <p className="text-sm font-bold text-slate-500">Hi, {profile?.name?.split(' ')[0] ?? 'Explorer'}</p>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight text-ink sm:text-3xl">Ready for a quiz?</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {rank.emoji} {rank.name} · {weekly > 0 ? `${weekly.toLocaleString('en')} XP earned this week` : 'Start a quiz to earn XP today'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Diamond / Reward Pill Badge from Image 2 */}
          <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-[0_3px_0_#0f172a]">
            <span className="text-base" aria-hidden>💎</span>
            <span className="tabular">{progress.coins}</span>
          </div>
          <Link
            to={p.generator}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-[#22c55e] px-4 py-2 text-sm font-black text-slate-950 shadow-[0_3px_0_#0f172a] transition hover:bg-[#16a34a] active:translate-y-0.5 active:shadow-none"
          >
            <WandSparkles className="size-4" aria-hidden /> Create challenge
          </Link>
        </div>
      </header>

      {/* Categories from Image 2 Screen 2 */}
      <section aria-labelledby="categories-heading">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 id="categories-heading" className="text-lg font-black tracking-tight text-ink">
            Categories
          </h2>
          <Link to={p.learn} className="text-xs font-bold text-teal-700 hover:underline">
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            to={`${p.generator}?topic=biodiversity-ecosystems`}
            className="group flex flex-col justify-between rounded-3xl border-2 border-slate-900 bg-[#34785c] p-4 text-white shadow-[0_4px_0_#0f172a] transition hover:-translate-y-0.5"
          >
            <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-sm">
              🧪
            </div>
            <div className="mt-4">
              <p className="font-black text-base leading-tight">Science & Biosphere</p>
              <p className="mt-1 text-xs text-emerald-100 font-semibold">15 Quizzes</p>
            </div>
          </Link>

          <Link
            to={`${p.generator}?topic=climate-change`}
            className="group flex flex-col justify-between rounded-3xl border-2 border-slate-900 bg-[#EAB308] p-4 text-slate-950 shadow-[0_4px_0_#0f172a] transition hover:-translate-y-0.5"
          >
            <div className="size-10 rounded-2xl bg-white/40 flex items-center justify-center text-xl shadow-sm">
              🏛️
            </div>
            <div className="mt-4">
              <p className="font-black text-base leading-tight">Climate & Earth</p>
              <p className="mt-1 text-xs text-amber-950 font-semibold">15 Quizzes</p>
            </div>
          </Link>

          <Link
            to={`${p.generator}?topic=oceans-water`}
            className="group flex flex-col justify-between rounded-3xl border-2 border-slate-900 bg-[#F43F5E] p-4 text-white shadow-[0_4px_0_#0f172a] transition hover:-translate-y-0.5"
          >
            <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-sm">
              🌊
            </div>
            <div className="mt-4">
              <p className="font-black text-base leading-tight">Oceans & Water</p>
              <p className="mt-1 text-xs text-rose-100 font-semibold">15 Quizzes</p>
            </div>
          </Link>

          <Link
            to={`${p.generator}?topic=renewable-energy`}
            className="group flex flex-col justify-between rounded-3xl border-2 border-slate-900 bg-[#6366F1] p-4 text-white shadow-[0_4px_0_#0f172a] transition hover:-translate-y-0.5"
          >
            <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-sm">
              ⚡
            </div>
            <div className="mt-4">
              <p className="font-black text-base leading-tight">Clean Energy & Tech</p>
              <p className="mt-1 text-xs text-indigo-100 font-semibold">15 Quizzes</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Quizzers / Featured Challenges from Image 2 */}
      <section aria-labelledby="trending-heading">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 id="trending-heading" className="text-lg font-black tracking-tight text-ink">
            Trending Challenges
          </h2>
          <Link to={p.games} className="text-xs font-bold text-teal-700 hover:underline">
            See All
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Card 1: Space Explorer & Biosphere */}
          <div className="flex items-center justify-between rounded-3xl border-2 border-slate-900 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] p-4 text-white shadow-[0_4px_0_#0f172a]">
            <div>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                Featured
              </span>
              <h3 className="mt-2 text-lg font-black">Planetary Explorer</h3>
              <p className="text-xs text-indigo-100 font-medium">Explore biosphere thresholds & planetary health</p>
              <p className="mt-2 text-xs font-bold text-white/90">📋 10 Questions · +50 XP</p>
            </div>
            <Link
              to={`${p.generator}?topic=biodiversity-ecosystems&difficulty=medium`}
              className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-950 shadow-[0_3px_0_#0f172a] transition hover:scale-105 active:scale-95"
              aria-label="Play Planetary Explorer Quiz"
            >
              <span className="text-lg ml-0.5">▶</span>
            </Link>
          </div>

          {/* Card 2: World History & Climate */}
          <div className="flex items-center justify-between rounded-3xl border-2 border-slate-900 bg-gradient-to-r from-[#0D9488] to-[#10B981] p-4 text-white shadow-[0_4px_0_#0f172a]">
            <div>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                Trending
              </span>
              <h3 className="mt-2 text-lg font-black">World Climate Milestones</h3>
              <p className="text-xs text-teal-100 font-medium">Key IPCC insights, energy transitions & policies</p>
              <p className="mt-2 text-xs font-bold text-white/90">📋 10 Questions · +60 XP</p>
            </div>
            <Link
              to={`${p.generator}?topic=climate-change&difficulty=medium`}
              className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-950 shadow-[0_3px_0_#0f172a] transition hover:scale-105 active:scale-95"
              aria-label="Play World Climate Milestones Quiz"
            >
              <span className="text-lg ml-0.5">▶</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Challenge Card */}
      <DailyChallengeCard />

      {/* KPIs */}
      <section aria-label="Key stats" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Total XP" icon={<Star className="size-4" />} value={progress.xp.toLocaleString('en')} sub={`+${weekly.toLocaleString('en')} this week`} />
        <StatTile label="Level" icon={<TrendingUp className="size-4" />} value={level.level} sub={`${level.nextLevelXp - level.xp} XP to level ${level.level + 1}`}>
          <ProgressBar value={level.progress} className="mt-2" height="h-1.5" label="Level progress" />
        </StatTile>
        <StatTile label="Coins" icon={<Coins className="size-4" />} value={progress.coins.toLocaleString('en')} sub="25 coins per hint" />
        <StatTile label="Streak" icon={<Flame className="size-4" />} value={`${streak} day${streak === 1 ? '' : 's'}`} sub={`Best: ${progress.streak.best}`} />
        <StatTile label="Accuracy" icon={<Crosshair className="size-4" />} value={progress.stats.questionsAnswered ? `${Math.round(accuracy * 100)}%` : '—'} sub={`${progress.stats.correctAnswers}/${progress.stats.questionsAnswered} correct`} />
        <StatTile label="Global rank" icon={<Trophy className="size-4" />} value={me ? `#${me.rank}` : '—'} sub={`of ${board.length} learners`} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 sm:p-6 lg:col-span-2">
          <SectionHeader title="Weekly performance" subtitle="XP earned per day, last 7 days" action={<Pill className="bg-teal-50 text-teal-800">{weekly.toLocaleString('en')} XP</Pill>} />
          <ColumnChart
            data={days.map((d) => ({ label: weekdayShort(d), value: progress.dailyXp[d] ?? 0, title: parseDateKey(d).toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'short' }) }))}
            unit="XP"
            caption="XP earned per day over the last 7 days"
            highlightIndex={6}
          />
        </Card>

        <Card className="flex flex-col p-5 sm:p-6">
          <SectionHeader title="Current challenge" subtitle={rec ? 'Personalised from your last quiz' : 'A great place to start'} />
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-violet-50 to-sky-50 p-4">
            <p className="text-3xl" aria-hidden>
              {recTopic?.emoji}
            </p>
            <p className="mt-2 font-extrabold text-ink">{rec ? rec.title : `Try ${recTopic?.name} — Easy`}</p>
            <p className="mt-1 text-sm text-slate-600">{rec ? rec.message : 'Generate your first quiz and unlock the Eco Starter badge.'}</p>
            {rec && (
              <Pill className={cn('mt-3', difficultyStyles[rec.difficulty].chip)}>
                <Sparkles className="size-3" aria-hidden /> {difficultyStyles[rec.difficulty].label}
              </Pill>
            )}
          </div>
          <Link to={p.generatorFor(rec?.topicId ?? recTopic!.id, rec?.difficulty ?? 'easy')} className={buttonClasses({ full: true, className: 'mt-4' })}>
            Start <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 sm:p-6">
          <SectionHeader title="Leaderboard position" action={<Link to={p.leaderboard} className="text-sm font-semibold text-teal-700 hover:underline">View all</Link>} />
          {me ? (
            <>
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gold-50 p-3">
                <Medal className="size-8 text-gold-500" aria-hidden />
                <div>
                  <p className="text-2xl font-black text-ink">#{me.rank}</p>
                  <p className="text-xs text-slate-600">{me.rank > 1 ? `${(board[me.rank - 2].xp - me.xp + 1).toLocaleString('en')} XP to pass ${board[me.rank - 2].name}` : 'You’re leading the board!'}</p>
                </div>
              </div>
              <ol className="space-y-1.5">
                {neighbours.map((e) => (
                  <li key={e.id} className={cn('flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm', e.isCurrentUser ? 'bg-teal-50 font-bold' : '')}>
                    <span className="w-7 text-right font-bold text-slate-500 tabular">#{e.rank}</span>
                    <Avatar avatarId={e.avatarId} size="xs" />
                    <span className="min-w-0 flex-1 truncate text-ink">{e.isCurrentUser ? `${e.name} (you)` : e.name}</span>
                    <span className="font-semibold text-slate-600 tabular">{e.xp.toLocaleString('en')}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionHeader title="Topic mastery" action={<Link to={p.progress} className="text-sm font-semibold text-teal-700 hover:underline">Details</Link>} />
          {mastery.length ? (
            <BarList
              caption="Mastery by topic"
              items={mastery.slice(0, 5).map(({ t, m, stat }) => ({ id: t.id, label: t.name, icon: t.emoji, value: m, detail: `${stat!.correct}/${stat!.answered} correct` }))}
            />
          ) : (
            <EmptyState icon="📊" title="No data yet" body="Complete a quiz to see your strongest topics." />
          )}
        </Card>

        <Card className="p-5 sm:p-6">
          <SectionHeader title="Recent quizzes" action={<Link to={`${p.generator}#history`} className="text-sm font-semibold text-teal-700 hover:underline">History</Link>} />
          {progress.attempts.length ? (
            <ul className="space-y-2">
              {progress.attempts.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <Link to={p.results(a.id)} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition hover:border-teal-300">
                    <span className="text-xl" aria-hidden>
                      {getTopic(a.topicId)?.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink">{a.topicName}</span>
                      <span className="text-xs text-slate-500">
                        {difficultyStyles[a.difficulty].label} · {formatRelative(a.completedAt)}
                      </span>
                    </span>
                    <span className={cn('text-sm font-black tabular', a.accuracy >= 0.8 ? 'text-emerald-700' : a.accuracy >= 0.6 ? 'text-amber-700' : 'text-rose-600')}>{Math.round(a.accuracy * 100)}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="📝" title="No quizzes yet" body="Your attempts will appear here." />
          )}
        </Card>
      </div>
    </div>
  );
}
