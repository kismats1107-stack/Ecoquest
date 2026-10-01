import { Crown } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useMode } from '@/hooks/useMode';
import { useApp } from '@/store/context';

interface PodiumUser {
  rank: number;
  name: string;
  points: number;
  image: string;
  badgeColor: string;
  badgeBg: string;
  ringColor: string;
}

interface RankedUser {
  rank: number;
  name: string;
  points: number;
  badgeScore: number;
  image: string;
  badgeBg: string;
  badgeText: string;
}

export default function PlusLeaderboard() {
  const { profile } = useApp();
  const { progress } = useMode();
  useDocumentTitle('Leaderboard · EcoQuest 15+');

  // Top 3 Podium matching Image 2 Screen 3
  const top1: PodiumUser = {
    rank: 1,
    name: 'Emma',
    points: 1870,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    badgeColor: 'text-amber-900',
    badgeBg: 'bg-[#FBBF24]',
    ringColor: 'ring-amber-400',
  };

  const top3User: PodiumUser = {
    rank: 3,
    name: 'Liam',
    points: 1250,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    badgeColor: 'text-blue-900',
    badgeBg: 'bg-[#93C5FD]',
    ringColor: 'ring-blue-400',
  };

  const top2: PodiumUser = {
    rank: 2,
    name: 'Noah',
    points: 1100,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    badgeColor: 'text-orange-900',
    badgeBg: 'bg-[#FDBA74]',
    ringColor: 'ring-orange-400',
  };

  // Ranked List (4 to 10) matching Image 2 Screen 3 exactly
  const RANKED_LIST: RankedUser[] = [
    {
      rank: 4,
      name: 'Liam J.',
      points: 900,
      badgeScore: 82,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-[#52B788]',
      badgeText: 'text-white',
    },
    {
      rank: 5,
      name: 'olivia A.',
      points: 750,
      badgeScore: 74,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-[#F59E0B]',
      badgeText: 'text-white',
    },
    {
      rank: 6,
      name: 'Noah R.',
      points: 680,
      badgeScore: 68,
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-[#8B5CF6]',
      badgeText: 'text-white',
    },
    {
      rank: 7,
      name: 'Adlef G.',
      points: 560,
      badgeScore: 56,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-[#38BDF8]',
      badgeText: 'text-white',
    },
    {
      rank: 8,
      name: 'James T.',
      points: 480,
      badgeScore: 48,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-[#475569]',
      badgeText: 'text-white',
    },
    {
      rank: 9,
      name: 'Mila Lam',
      points: 420,
      badgeScore: 42,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-[#EAB308]',
      badgeText: 'text-white',
    },
    {
      rank: 10,
      name: profile?.name ? `${profile.name.split(' ')[0]} P` : 'Alex P',
      points: progress.xp > 0 ? progress.xp : 370,
      badgeScore: 36,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-[#F43F5E]',
      badgeText: 'text-white',
    },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-xl mx-auto font-sans">
      {/* 1. TOP HEADER MATCHING IMAGE 2 SCREEN 3 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Leaderboard
        </h1>

        {/* Top Right Diamonds Counter Pill */}
        <div className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-sm border border-slate-200/80 font-black text-sm text-slate-900">
          <span className="text-base">💎</span>
          <span className="tabular">{progress.coins > 0 ? progress.coins : 20}</span>
        </div>
      </div>

      {/* 2. TOP 3 PODIUM MATCHING IMAGE 2 SCREEN 3 */}
      <div className="relative pt-6 pb-4">
        <div className="grid grid-cols-3 items-end gap-3 sm:gap-4 text-center">
          {/* Left: 3rd Place (Liam) */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="size-20 sm:size-22 rounded-full overflow-hidden border-3 border-white ring-4 ring-purple-300 shadow-md">
                <img src={top3User.image} alt={top3User.name} className="size-full object-cover" />
              </div>
              {/* Badge "3" */}
              <div className="absolute -bottom-2.5 inset-x-0 flex justify-center">
                <span className="size-6 sm:size-7 rounded-full bg-[#93C5FD] text-blue-950 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-xs">
                  3
                </span>
              </div>
            </div>
            <h3 className="mt-4 text-sm sm:text-base font-bold text-slate-900">{top3User.name}</h3>
            <p className="text-xs font-semibold text-slate-400">{top3User.points} Point</p>
          </div>

          {/* Center: 1st Place (Emma) with Crown */}
          <div className="flex flex-col items-center -translate-y-2">
            {/* Gold Crown */}
            <div className="mb-1 flex justify-center">
              <Crown className="size-8 sm:size-9 text-amber-500 fill-amber-400 drop-shadow-sm" />
            </div>

            <div className="relative">
              <div className="size-24 sm:size-26 rounded-full overflow-hidden border-4 border-white ring-4 ring-amber-400 shadow-xl">
                <img src={top1.image} alt={top1.name} className="size-full object-cover" />
              </div>
              {/* Badge "1" */}
              <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                <span className="size-7 sm:size-8 rounded-full bg-[#FBBF24] text-amber-950 font-black text-sm sm:text-base flex items-center justify-center border-2 border-white shadow-xs">
                  1
                </span>
              </div>
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900">{top1.name}</h3>
            <p className="text-xs font-bold text-slate-400">{top1.points} Point</p>
          </div>

          {/* Right: 2nd Place (Noah) */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="size-20 sm:size-22 rounded-full overflow-hidden border-3 border-white ring-4 ring-orange-300 shadow-md">
                <img src={top2.image} alt={top2.name} className="size-full object-cover" />
              </div>
              {/* Badge "2" */}
              <div className="absolute -bottom-2.5 inset-x-0 flex justify-center">
                <span className="size-6 sm:size-7 rounded-full bg-[#FDBA74] text-orange-950 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-xs">
                  2
                </span>
              </div>
            </div>
            <h3 className="mt-4 text-sm sm:text-base font-bold text-slate-900">{top2.name}</h3>
            <p className="text-xs font-semibold text-slate-400">{top2.points} Point</p>
          </div>
        </div>
      </div>

      {/* 3. RANKED LIST (4 to 10) MATCHING IMAGE 2 SCREEN 3 */}
      <div className="space-y-2.5">
        {RANKED_LIST.map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-xs border border-slate-100 hover:border-slate-300 transition"
          >
            {/* Left: Rank & Avatar */}
            <div className="flex items-center gap-3.5">
              <span className="w-5 text-center text-sm font-black text-slate-600">
                {user.rank}
              </span>
              <div className="size-10 rounded-full overflow-hidden ring-1 ring-slate-200">
                <img src={user.image} alt={user.name} className="size-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                <p className="text-xs text-slate-400 font-medium">{user.points} Points</p>
              </div>
            </div>

            {/* Right: Colored Score Pill */}
            <div
              className={`size-9 rounded-full ${user.badgeBg} ${user.badgeText} flex items-center justify-center font-black text-xs shadow-xs`}
            >
              {user.badgeScore}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
