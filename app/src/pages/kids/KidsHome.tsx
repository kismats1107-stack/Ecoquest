import { ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { HeroFeatureCards } from '@/components/brand/HeroFeatureCards';
import { Mascot } from '@/components/brand/Mascot';
import { EcoJourneyMap } from '@/components/kids/EcoJourneyMap';
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

// Category-based curated quizzes
const CATEGORY_QUIZZES: Record<string, { title: string; desc: string; count: number; badge: string; color: string }[]> = {
  'science-nature': [
    { title: 'Forests & Rainforests', desc: 'Discover wildlife, trees, and canopy layers', count: 10, badge: '🌲 Nature', color: 'bg-emerald-500' },
    { title: 'Ocean & Coral Wonders', desc: 'Dive into deep seas, coral reefs and marine life', count: 12, badge: '🐠 Ocean', color: 'bg-cyan-500' },
    { title: 'Climate & Seasons', desc: 'Learn how weather, clouds and sun power Earth', count: 8, badge: '☀️ Climate', color: 'bg-amber-500' },
  ],
  geography: [
    { title: 'World Habitats', desc: 'From the Sahara Desert to Antarctica glaciers', count: 10, badge: '🗺️ Habitats', color: 'bg-teal-500' },
    { title: 'Rivers, Lakes & Mountains', desc: 'How freshwater journeys shape our continents', count: 8, badge: '⛰️ Landforms', color: 'bg-blue-500' },
  ],
  history: [
    { title: 'Ancient Eco-Builders', desc: 'How ancient civilizations respected their land', count: 10, badge: '🏛️ Heritage', color: 'bg-amber-600' },
    { title: 'The Story of Earth Day', desc: 'How millions of people united for nature', count: 6, badge: '🌱 History', color: 'bg-emerald-600' },
  ],
  trivia: [
    { title: 'Animal Superpowers', desc: 'Which animal sleeps standing up? Test your wits!', count: 12, badge: '🦊 Animals', color: 'bg-purple-500' },
    { title: 'Eco-Trivia Showdown', desc: 'Speed through fun environmental facts and win stars', count: 15, badge: '⚡ Speed', color: 'bg-pink-500' },
  ],
};

export default function KidsHome() {
  const { profile, today } = useApp();
  const { progress } = useMode();
  useDocumentTitle('EcoQuest Kids · Play, Learn & Create Quizzes');
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'start';

  const level = levelFromXp(progress.xp);
  const rank = rankFor('kids', level.level);
  const upcoming = nextRank('kids', level.level);
  const streak = currentStreak(progress.streak, today);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const categoryQuizzes = CATEGORY_QUIZZES[activeCategory] || CATEGORY_QUIZZES['science-nature'];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO FEATURE CARDS MATCHING EXACT DESIGN OF IMAGE 1 */}
      <section aria-label="Create quiz & AI quiz generation">
        <HeroFeatureCards />
      </section>

      {/* 2. CATEGORY-SPECIFIC QUIZZES (When a category tab is clicked in Image 1 header) */}
      {activeCategory !== 'start' && (
        <section aria-label="Category quizzes" className="rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-[0_4px_0_#0f172a]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Category Feed</span>
              <h2 className="font-fun text-2xl font-black text-slate-900 capitalize">
                {activeCategory.replace('-', ' ')} Quizzes
              </h2>
            </div>
            <Link
              to="/kids/play"
              className="inline-flex items-center gap-1 text-sm font-black text-slate-900 hover:text-emerald-700"
            >
              See all <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryQuizzes.map((quiz, i) => (
              <Link
                key={i}
                to={`/kids/play`}
                className="group relative flex flex-col justify-between rounded-2xl border-2 border-slate-900 bg-[#FAF7F2] p-5 shadow-[0_3px_0_#0f172a] hover:-translate-y-1 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white border border-slate-900 text-slate-800">
                      {quiz.badge}
                    </span>
                    <span className="text-xs font-black text-slate-600 font-mono">
                      {quiz.count} Qs
                    </span>
                  </div>
                  <h3 className="font-fun text-lg font-black text-slate-900 group-hover:text-emerald-700 transition">
                    {quiz.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {quiz.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className="text-xs font-black text-emerald-600">Play Solo or with Friends</span>
                  <span className="size-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black group-hover:bg-[#22c55e] group-hover:text-slate-900 transition">
                    ▶
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. GREETING & LEVEL PROGRESS */}
      <section className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
        <Mascot mood="happy" className="size-24 shrink-0 sm:size-28" />
        <div className="relative w-full rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[0_4px_0_#0f172a]">
          <span className="absolute -left-2 bottom-8 hidden size-4 rotate-45 border-b-2 border-l-2 border-slate-900 bg-white sm:block" aria-hidden />
          <h2 className="font-fun text-2xl font-black text-slate-900 sm:text-3xl">
            {greeting}, {profile?.name ?? 'Explorer'}! 👋
          </h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {streak > 0 ? `You’re on a ${streak}-day streak — keep it growing!` : 'Ready for today’s mission? Let’s learn and play!'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-[#FFE66D] px-3 py-1 font-fun text-sm font-black text-slate-900 shadow-xs">
              {rank.emoji} {rank.name} · Level {level.level}
            </span>
            <div className="min-w-40 flex-1">
              <ProgressBar value={level.progress} barClassName="bg-gradient-to-r from-emerald-400 to-[#22c55e]" label="Progress to next level" />
              <p className="mt-1 text-xs font-bold text-slate-500">
                {level.nextLevelXp - level.xp} more Eco Stars to Level {level.level + 1}
                {upcoming && ` · ${upcoming.emoji} ${upcoming.name} at Level ${upcoming.minLevel}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DAILY CHALLENGE */}
      <DailyChallengeCard />

      {/* 5. 10-SECOND ECO GAMES */}
      <section aria-labelledby="quick-games">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h2 id="quick-games" className="font-fun text-2xl font-black text-slate-900">
              Interactive Eco Games
            </h2>
          </div>
          <Link to="/kids/play" className="text-xs font-black text-slate-900 hover:text-emerald-700 underline">
            Play All Games →
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {getGamesForMode('kids').map((g) => (
            <li key={g.id}>
              <Link
                to={paths('kids').game(g.id)}
                className={cn(
                  'group flex items-center gap-4 rounded-3xl p-4 shadow-[0_4px_0_#0f172a] border-2 border-slate-900 transition hover:-translate-y-1 bg-gradient-to-br',
                  GAME_BG[g.id],
                )}
              >
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 bg-white text-4xl shadow-xs transition group-hover:rotate-6" aria-hidden>
                  {g.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block font-fun text-xl font-black text-slate-900">{g.name}</span>
                  <span className="block text-xs font-bold text-slate-800">{g.tagline}</span>
                  {progress.bestGameScores[g.id] !== undefined && (
                    <span className="mt-1 inline-block text-[11px] font-black text-slate-900 bg-white/70 px-2 py-0.5 rounded-full border border-slate-900">
                      🏆 Best: {progress.bestGameScores[g.id]}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. ECO JOURNEY ADVENTURE MAP */}
      <Card className="border-2 border-slate-900 p-5 sm:p-6 rounded-[2.5rem] bg-white shadow-[0_4px_0_#0f172a]">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-fun text-2xl font-black text-slate-900">🗺️ My Eco Journey</h2>
            <p className="text-sm font-semibold text-slate-600">Visit every stop and collect 3 stars at each one!</p>
          </div>
          <Link to="/kids/learn" className="inline-flex items-center gap-1 font-fun font-bold text-slate-900 hover:text-emerald-700">
            All topics <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        {profile && <EcoJourneyMap progress={progress} avatarId={profile.avatarId} />}
      </Card>
    </div>
  );
}
