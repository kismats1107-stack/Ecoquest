import { motion } from 'framer-motion';
import { Crown, Star, Trophy } from 'lucide-react';
import { KidsFoliageFooterArt } from '@/components/brand/KidsArt';
import { Avatar } from '@/components/ui/Avatar';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { useApp } from '@/store/context';

interface TopHero {
  rank: number;
  name: string;
  points: number;
  avatarId: string;
  color: string;
  podiumHeight: string;
  badgeEmojis: string[];
}

export default function KidsLeaderboard() {
  useDocumentTitle('Top Learners · EcoQuest Kids');
  const { profile } = useApp();
  const { progress } = useMode();

  const TOP_HEROES: TopHero[] = [
    {
      rank: 2,
      name: 'Diya',
      points: 920,
      avatarId: 'panda',
      color: 'bg-purple-100 border-purple-300 text-purple-700',
      podiumHeight: 'h-36 sm:h-44',
      badgeEmojis: ['💧', '🌳', '⭐'],
    },
    {
      rank: 1,
      name: 'Aarav',
      points: 980,
      avatarId: 'fox',
      color: 'bg-amber-100 border-amber-300 text-amber-800',
      podiumHeight: 'h-48 sm:h-56',
      badgeEmojis: ['👑', '🌍', '⚡', '🌳'],
    },
    {
      rank: 3,
      name: 'Rohan',
      points: 870,
      avatarId: 'owl',
      color: 'bg-orange-100 border-orange-300 text-orange-700',
      podiumHeight: 'h-28 sm:h-36',
      badgeEmojis: ['🌱', '💧'],
    },
  ];

  const RUNNERS_UP = [
    { rank: 4, name: 'Meera', points: 820, avatarId: 'dolphin', badges: ['💧', '🌍', '🌱'] },
    { rank: 5, name: 'Kabir', points: 760, avatarId: 'koala', badges: ['🌳', '⭐'] },
    { rank: 6, name: 'Siya', points: 720, avatarId: 'rabbit', badges: ['💧', '⚡'] },
    { rank: 7, name: 'Arjun', points: 690, avatarId: 'bear', badges: ['🌍', '🌱', '⭐'] },
    { rank: 8, name: 'Anaya', points: 650, avatarId: 'penguin', badges: ['💧', '🌳', '🌍', '⚡'] },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header - Exact Screen 5 Styling */}
      <header className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 mb-2">
          <Trophy className="size-3.5 text-amber-500" />
          <span>Eco Heroes Community</span>
        </div>
        <h1 className="font-fun text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Top Learners
        </h1>
        <p className="mt-1.5 font-fun text-sm sm:text-base font-semibold text-slate-600">
          See how you rank among other little planet heroes!
        </p>
      </header>

      {/* Podium of Top 3 (Diya #2, Aarav #1 Gold Crown, Rohan #3) */}
      <section aria-label="Top 3 podium" className="relative mx-auto max-w-lg px-4 pt-8">
        <div className="flex items-end justify-center gap-3 sm:gap-6">
          {/* Rank 2: Diya (Silver) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 flex flex-col items-center"
          >
            <div className="relative mb-2 flex flex-col items-center">
              <span className="grid size-7 place-items-center rounded-full bg-slate-200 text-xs font-black text-slate-700 shadow-sm border-2 border-white mb-1">
                2
              </span>
              <div className="size-16 sm:size-20 rounded-full ring-4 ring-purple-300 shadow-md bg-purple-50 flex items-center justify-center overflow-hidden">
                <Avatar avatarId={TOP_HEROES[0].avatarId} size="lg" />
              </div>
              <p className="mt-2 font-fun text-base font-black text-slate-900">
                {TOP_HEROES[0].name}
              </p>
              <span className="font-fun text-xs font-bold text-slate-500">
                {TOP_HEROES[0].points} pts
              </span>
            </div>

            <div
              className={`w-full ${TOP_HEROES[0].podiumHeight} rounded-t-3xl border-2 border-b-0 border-purple-200 bg-gradient-to-b from-purple-100 to-purple-50 flex items-center justify-center shadow-inner`}
            >
              <span className="font-fun text-3xl font-black text-purple-300">2</span>
            </div>
          </motion.div>

          {/* Rank 1: Aarav (Gold + Crown) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center z-10"
          >
            <div className="relative mb-2 flex flex-col items-center">
              {/* Golden Crown */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="mb-1 text-amber-500"
              >
                <Crown className="size-8 fill-amber-400 text-amber-500 drop-shadow" />
              </motion.div>
              <div className="size-20 sm:size-24 rounded-full ring-4 ring-amber-400 shadow-xl bg-amber-50 flex items-center justify-center overflow-hidden">
                <Avatar avatarId={TOP_HEROES[1].avatarId} size="lg" />
              </div>
              <p className="mt-2 font-fun text-lg font-black text-slate-900">
                {TOP_HEROES[1].name}
              </p>
              <span className="font-fun text-xs font-black text-amber-600">
                {TOP_HEROES[1].points} pts
              </span>
            </div>

            <div
              className={`w-full ${TOP_HEROES[1].podiumHeight} rounded-t-3xl border-2 border-b-0 border-amber-300 bg-gradient-to-b from-amber-200 to-amber-100 flex items-center justify-center shadow-md`}
            >
              <span className="font-fun text-4xl font-black text-amber-400">1</span>
            </div>
          </motion.div>

          {/* Rank 3: Rohan (Bronze) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col items-center"
          >
            <div className="relative mb-2 flex flex-col items-center">
              <span className="grid size-7 place-items-center rounded-full bg-amber-200 text-xs font-black text-amber-800 shadow-sm border-2 border-white mb-1">
                3
              </span>
              <div className="size-16 sm:size-20 rounded-full ring-4 ring-orange-300 shadow-md bg-orange-50 flex items-center justify-center overflow-hidden">
                <Avatar avatarId={TOP_HEROES[2].avatarId} size="lg" />
              </div>
              <p className="mt-2 font-fun text-base font-black text-slate-900">
                {TOP_HEROES[2].name}
              </p>
              <span className="font-fun text-xs font-bold text-slate-500">
                {TOP_HEROES[2].points} pts
              </span>
            </div>

            <div
              className={`w-full ${TOP_HEROES[2].podiumHeight} rounded-t-3xl border-2 border-b-0 border-orange-200 bg-gradient-to-b from-orange-100 to-orange-50 flex items-center justify-center shadow-inner`}
            >
              <span className="font-fun text-3xl font-black text-orange-300">3</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ranked Table (Matches Screen 5) */}
      <section className="mx-auto max-w-2xl px-2">
        <div className="overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[50px_1fr_100px_110px] items-center gap-2 border-b-2 border-emerald-100 bg-emerald-50/70 px-5 py-3 text-xs font-black text-emerald-900 uppercase">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">Points</span>
            <span className="text-center">Badges</span>
          </div>

          {/* Rows */}
          <ul className="divide-y divide-emerald-50">
            {RUNNERS_UP.map((u) => (
              <li
                key={u.rank}
                className="grid grid-cols-[50px_1fr_100px_110px] items-center gap-2 px-5 py-3.5 transition hover:bg-emerald-50/40"
              >
                <span className="font-fun text-sm font-black text-slate-400">
                  {u.rank}
                </span>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 shrink-0 rounded-full bg-slate-100 overflow-hidden ring-2 ring-emerald-200">
                    <Avatar avatarId={u.avatarId} size="sm" />
                  </div>
                  <span className="truncate font-fun text-sm font-black text-slate-800">
                    {u.name}
                  </span>
                </div>

                <span className="font-fun text-sm font-black text-slate-700 text-right tabular">
                  {u.points} pts
                </span>

                <div className="flex items-center justify-center gap-1">
                  {u.badges.map((b, i) => (
                    <span
                      key={i}
                      className="grid size-6 place-items-center rounded-full bg-emerald-100 text-xs"
                      title="Earned Badge"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </li>
            ))}

            {/* Current Player Rank Row */}
            {profile && (
              <li className="grid grid-cols-[50px_1fr_100px_110px] items-center gap-2 bg-emerald-100/60 px-5 py-3.5 border-t-2 border-emerald-200">
                <span className="font-fun text-sm font-black text-emerald-800">
                  You
                </span>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 shrink-0 rounded-full bg-white overflow-hidden ring-2 ring-emerald-500">
                    <Avatar avatarId={profile.avatarId} size="sm" />
                  </div>
                  <span className="truncate font-fun text-sm font-black text-emerald-950">
                    {profile.name} (You)
                  </span>
                </div>

                <span className="font-fun text-sm font-black text-emerald-900 text-right tabular">
                  {progress.xp} pts
                </span>

                <div className="flex items-center justify-center gap-1">
                  {Object.keys(progress.badges).slice(0, 3).map((badgeId) => (
                    <span
                      key={badgeId}
                      className="grid size-6 place-items-center rounded-full bg-emerald-200 text-xs"
                    >
                      🌱
                    </span>
                  ))}
                  {Object.keys(progress.badges).length === 0 && (
                    <span className="text-xs font-bold text-emerald-700">Level 1</span>
                  )}
                </div>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Cheerful Sticky Banner: ⭐ Keep going! You're doing great! */}
      <div className="mx-auto max-w-sm text-center px-4">
        <div className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-600/30">
          <Star className="size-4 fill-amber-300 text-amber-300" />
          <span>Keep going! You’re doing great!</span>
        </div>
      </div>

      {/* Grassy Foliage Art Border */}
      <div className="pt-4">
        <KidsFoliageFooterArt className="h-16" />
      </div>
    </div>
  );
}
