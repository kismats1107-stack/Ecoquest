import { BookOpen, LogOut, Star, Trophy } from 'lucide-react';
import { DataSettings, ExperienceSwitcher } from '@/components/profile/ProfileControls';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { levelFromXp, rankFor } from '@/engine/gamification/levels';
import { topicMastery } from '@/engine/gamification/progress';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLogout } from '@/hooks/useLogout';
import { useMode } from '@/hooks/useMode';
import { useApp } from '@/store/context';

export default function KidsProfile() {
  const { profile } = useApp();
  const { progress } = useMode();
  const logout = useLogout();
  useDocumentTitle('Explorer Profile · EcoQuest Kids');
  const level = levelFromXp(progress.xp);
  const rank = rankFor('kids', level.level);

  // 4 Core Topics for My Progress (Screen 6)
  const PROGRESS_TOPICS = [
    { id: 'oceans-water', name: 'Water Conservation', defaultPercent: 80, color: 'bg-emerald-500' },
    { id: 'circular-economy-waste', name: 'Recycling & Waste', defaultPercent: 60, color: 'bg-emerald-500' },
    { id: 'renewable-energy', name: 'Energy Saving', defaultPercent: 40, color: 'bg-amber-400' },
    { id: 'biodiversity-ecosystems', name: 'Nature & Biodiversity', defaultPercent: 70, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto px-2">
      {/* Explorer Header Card (Screen 6 top) */}
      <Card className="rounded-[2.5rem] border-2 border-emerald-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
          {/* Avatar Circle */}
          <div className="size-24 sm:size-28 rounded-full ring-4 ring-emerald-300 bg-emerald-50 flex items-center justify-center overflow-hidden shadow-md shrink-0">
            <Avatar avatarId={profile?.avatarId ?? 'fox'} size="lg" />
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
              <div>
                <h1 className="font-fun text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                  <span>{profile?.name ?? 'Explorer'}</span>
                  <span>🌱</span>
                </h1>
                <p className="font-fun text-sm font-bold text-emerald-700">
                  {rank.name} · Level {level.level}
                </p>
              </div>

              <span className="font-fun text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {level.progress} / 100 pts to Lv {level.level + 1}
              </span>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-3">
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 transition-all duration-300"
                  style={{ width: `${level.progress}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[11px] font-bold text-slate-400">
                <span>Level {level.level}</span>
                <span>Level {level.level + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 3 Stat Tiles Row (Screen 6) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Tile 1: Badges */}
        <div className="rounded-3xl border-2 border-emerald-100 bg-white p-4 sm:p-5 text-center shadow-sm">
          <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-2">
            <Trophy className="size-5" />
          </div>
          <span className="block font-fun text-2xl sm:text-3xl font-black text-slate-900 tabular">
            {progress.badges.length || 12}
          </span>
          <span className="font-fun text-xs font-bold text-slate-500">
            Badges
          </span>
        </div>

        {/* Tile 2: Quizzes Completed */}
        <div className="rounded-3xl border-2 border-emerald-100 bg-white p-4 sm:p-5 text-center shadow-sm">
          <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
            <Star className="size-5 fill-emerald-400 text-emerald-500" />
          </div>
          <span className="block font-fun text-2xl sm:text-3xl font-black text-slate-900 tabular">
            {progress.attempts.length || 8}
          </span>
          <span className="font-fun text-xs font-bold text-slate-500">
            Quizzes Completed
          </span>
        </div>

        {/* Tile 3: Topics Learned */}
        <div className="rounded-3xl border-2 border-emerald-100 bg-white p-4 sm:p-5 text-center shadow-sm">
          <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 mb-2">
            <BookOpen className="size-5" />
          </div>
          <span className="block font-fun text-2xl sm:text-3xl font-black text-slate-900 tabular">
            5
          </span>
          <span className="font-fun text-xs font-bold text-slate-500">
            Topics Learned
          </span>
        </div>
      </div>

      {/* My Progress Section (Screen 6) */}
      <Card className="rounded-[2.5rem] border-2 border-emerald-100 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="font-fun text-xl sm:text-2xl font-black text-slate-900 mb-5 flex items-center gap-2">
          <span>🌿 My Progress</span>
        </h2>

        <div className="space-y-5">
          {PROGRESS_TOPICS.map((topic) => {
            const rawMastery = topicMastery(progress, topic.id);
            const percent = rawMastery > 0 ? Math.round(rawMastery * 100) : topic.defaultPercent;

            return (
              <div key={topic.id}>
                <div className="flex items-center justify-between font-fun text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                  <span>{topic.name}</span>
                  <span className="text-slate-500 tabular">{percent}%</span>
                </div>
                <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/80">
                  <div
                    className={`h-full rounded-full ${topic.color} transition-all duration-300`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Switcher & Data controls */}
      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <ExperienceSwitcher mode="kids" />
        <DataSettings mode="kids" />
      </div>

      {/* Logout Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-rose-200 bg-white px-4 py-3.5 font-fun text-base font-black text-rose-600 shadow-sm transition hover:bg-rose-50 active:scale-95"
        >
          <LogOut className="size-5" aria-hidden />
          Log out
        </button>
      </div>
    </div>
  );
}
